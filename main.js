/* main.js - renderer + EST time logic + parallax
   Requires config.js (SCHEDULE_CONFIG) to be loaded first.
*/
(function () {
  const cfg = window.SCHEDULE_CONFIG;
  if (!cfg) return console.error("SCHEDULE_CONFIG missing");

  const root = document.getElementById('schedule-root');
  const container = document.getElementById('schedule-container');
  const parallaxImg = document.getElementById('parallax-img');

  /* ---------- Parallax ---------- */
  function initParallax() {
    if (!cfg.background || !cfg.background.url) return;
    parallaxImg.src = cfg.background.url;
    parallaxImg.alt = "Decorative background";
    document.documentElement.style.setProperty('--bg-opacity', String(cfg.background.opacity ?? 0.18));
    document.documentElement.style.setProperty('--bg-scale', String(cfg.background.scale ?? 1.12));
    const speed = Math.max(0.005, cfg.background.speed ?? 0.02);
    const amplitude = 18;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      const offset = Math.sin(t * Math.PI * 2 * speed) * amplitude;
      parallaxImg.style.transform = `translate(-50%, calc(-50% + ${offset}px)) scale(${cfg.background.scale ?? 1.12})`;
      requestAnimationFrame(step);
    }
    if (parallaxImg.complete) requestAnimationFrame(step);
    else parallaxImg.addEventListener('load', () => requestAnimationFrame(step), { once: true });
  }

  /* ---------- Time helpers (EST) ---------- */
  function nowInEST() {
    const now = new Date();
    const estStr = now.toLocaleString('en-US', { timeZone: cfg.timezone });
    return new Date(estStr);
  }

  function parseTimeToESTDate(hhmm) {
    const now = nowInEST();
    const [hh, mm] = hhmm.split(':').map(Number);
    const d = new Date(now);
    d.setHours(hh, mm || 0, 0, 0);
    return d;
  }

  function addHours(date, hours) {
    const d = new Date(date);
    const whole = Math.floor(hours);
    const frac = hours - whole;
    d.setHours(d.getHours() + whole);
    d.setMinutes(d.getMinutes() + Math.round(frac * 60));
    return d;
  }

  function isLive(slot) {
    const start = parseTimeToESTDate(slot.time);
    const end = addHours(start, slot.duration || 1);
    const now = nowInEST();
    // handle wrap-around if end is next day
    if (end <= start) end.setDate(end.getDate() + 1);
    return now >= start && now < end;
  }

  /* ---------- Renderer ---------- */
  function createCard(slot) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = slot.xLink || '#';
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.dataset.id = slot.id;

    // flame wrapper
    const flameWrap = document.createElement('div');
    flameWrap.className = 'flame-wrap';
    const flameVideo = document.createElement('video');
    flameVideo.className = 'flame';
    flameVideo.src = slot.flameVideo || '';
    flameVideo.loop = true;
    flameVideo.muted = true;
    flameVideo.playsInline = true;
    flameVideo.preload = 'auto';
    flameWrap.appendChild(flameVideo);
    card.appendChild(flameWrap);

    // foreground lighter image
    const fg = document.createElement('div');
    fg.className = 'fg';
    const img = document.createElement('img');
    img.className = 'lighter';
    img.alt = slot.label || '';
    if (slot.type === 'zippo') img.src = slot.closedImg;
    else img.src = slot.bicImg;
    fg.appendChild(img);
    card.appendChild(fg);

    // label
    const label = document.createElement('div');
    label.className = 'card-label';
    label.textContent = `${slot.label} • ${slot.time}`;
    card.appendChild(label);

    // popup
    const popup = document.createElement('div');
    popup.className = 'popup';
    const popImg = document.createElement('img');
    popImg.src = slot.summaryImg || '';
    popImg.alt = `${slot.label} summary`;
    popup.appendChild(popImg);
    card.appendChild(popup);

    // hover/touch handlers
    let touchTimer = null;
    card.addEventListener('mouseenter', () => card.classList.add('show-popup'));
    card.addEventListener('mouseleave', () => card.classList.remove('show-popup'));
    card.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      if (card.classList.contains('show-popup')) card.classList.remove('show-popup');
      else card.classList.add('show-popup');
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => card.classList.remove('show-popup'), 6000);
    }, { passive: true });

    return { card, imgEl: img, flameVideoEl: flameVideo, slot };
  }

  function renderSchedule() {
    container.innerHTML = '';

    // Founders row (locked)
    const foundersRow = document.createElement('div');
    foundersRow.className = 'schedule-row';
    cfg.foundersRow.forEach(slot => {
      const { card, imgEl, flameVideoEl } = createCard(slot);
      foundersRow.appendChild(card);
      card._meta = { slot, imgEl, flameVideoEl };
    });
    container.appendChild(foundersRow);

    // Other spaces: render in a single flexible row that wraps (keeps order)
    const otherRow = document.createElement('div');
    otherRow.className = 'schedule-row';
    // reorder to start at 06:00 visually
    const ordered = orderSpacesStartingAt(cfg.spaces, "06:00");
    ordered.forEach(slot => {
      if (cfg.foundersRow.some(f => f.id === slot.id)) return;
      const { card, imgEl, flameVideoEl } = createCard(slot);
      otherRow.appendChild(card);
      card._meta = { slot, imgEl, flameVideoEl };
    });
    container.appendChild(otherRow);

    updateLiveStates();
  }

  /* ---------- Ordering helper ---------- */
  function orderSpacesStartingAt(spaces, anchorHHMM) {
    // Convert times to minutes since midnight (EST) and sort, then rotate so anchor is first
    const toMinutes = (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      return (h * 60 + (m || 0)) % (24 * 60);
    };
    const anchor = toMinutes(anchorHHMM);
    const mapped = spaces.map(s => ({ s, mins: toMinutes(s.time) }));
    mapped.sort((a, b) => a.mins - b.mins);
    // rotate
    const idx = mapped.findIndex(m => m.mins >= anchor);
    if (idx === -1) return mapped.map(m => m.s);
    return mapped.slice(idx).concat(mapped.slice(0, idx)).map(m => m.s);
  }

  /* ---------- Live state updates ---------- */
  function updateLiveStates() {
    const cards = container.querySelectorAll('.card');
    // collect live slots to handle overlaps and priorities if needed
    const liveCards = [];
    cards.forEach(card => {
      const meta = card._meta;
      if (!meta) return;
      const slot = meta.slot;
      const live = isLive(slot);
      const imgEl = meta.imgEl;
      const flameVideoEl = meta.flameVideoEl;

      if (live) {
        flameVideoEl.style.display = 'block';
        flameVideoEl.play().catch(()=>{});
        if (slot.type === 'zippo' && slot.openImg) imgEl.src = slot.openImg;
        else if (slot.type === 'bic' && slot.bicImg) imgEl.src = slot.bicImg;
        liveCards.push({ card, slot });
      } else {
        flameVideoEl.pause();
        flameVideoEl.style.display = 'none';
        if (slot.type === 'zippo' && slot.closedImg) imgEl.src = slot.closedImg;
        else if (slot.type === 'bic' && slot.bicImg) imgEl.src = slot.bicImg;
        card.classList.remove('live');
      }
    });

    // Optional: apply visual emphasis based on overlapPriority when many live
    if (liveCards.length > 1) {
      liveCards.sort((a,b) => (b.slot.overlapPriority||0) - (a.slot.overlapPriority||0));
      // highest priority gets a subtle scale
      liveCards.forEach((lc, i) => {
        lc.card.classList.add('live');
        lc.card.style.zIndex = 3 + (liveCards.length - i);
        if (i === 0) lc.card.style.transform = 'translateY(-8px) scale(1.02)';
        else lc.card.style.transform = '';
      });
    } else if (liveCards.length === 1) {
      const lc = liveCards[0];
      lc.card.classList.add('live');
      lc.card.style.zIndex = 4;
      lc.card.style.transform = 'translateY(-8px) scale(1.02)';
    }
  }

  function startTicker() {
    const sec = cfg.refreshIntervalSec || 30;
    setInterval(updateLiveStates, sec * 1000);
  }

  /* ---------- Init ---------- */
  initParallax();
  renderSchedule();
  startTicker();

  // Close popups when tapping outside (mobile)
  document.addEventListener('touchstart', (e) => {
    const cards = container.querySelectorAll('.card.show-popup');
    cards.forEach(c => { if (!c.contains(e.target)) c.classList.remove('show-popup'); });
  }, { passive: true });

})();
/* JSON-LD injector for SCHEDULE_CONFIG
   Paste this at the end of main.js (after SCHEDULE_CONFIG and renderer code).
*/
(function injectJsonLdSafely() {
  try {
    // Wait until SCHEDULE_CONFIG is available
    if (typeof window === 'undefined') return;
    const waitForConfig = (resolve) => {
      if (window.SCHEDULE_CONFIG && Array.isArray(window.SCHEDULE_CONFIG.spaces)) return resolve(window.SCHEDULE_CONFIG);
      const maxWait = 3000; // ms
      const start = Date.now();
      const iv = setInterval(() => {
        if (window.SCHEDULE_CONFIG && Array.isArray(window.SCHEDULE_CONFIG.spaces)) {
          clearInterval(iv);
          return resolve(window.SCHEDULE_CONFIG);
        }
        if (Date.now() - start > maxWait) {
          clearInterval(iv);
          return resolve(null);
        }
      }, 100);
    };

    waitForConfig((cfg) => {
      if (!cfg) return; // config not available in time; silently exit

      const tz = cfg.timezone || 'America/New_York';

      // Helper: return a Date object for the next occurrence of hh:mm in EST
      function nextOccurrenceEST(hhmm) {
        const parts = (hhmm || '00:00').split(':').map(Number);
        const now = new Date();
        // Build a date string in EST by using toLocaleString conversion
        const estNowStr = now.toLocaleString('en-US', { timeZone: tz });
        const estNow = new Date(estNowStr);
        const d = new Date(estNow);
        d.setHours(parts[0] || 0, parts[1] || 0, 0, 0);
        if (d <= estNow) d.setDate(d.getDate() + 1);
        return d;
      }

      // Build JSON-LD events from foundersRow + spaces
      const slots = (cfg.foundersRow || []).concat(cfg.spaces || []);
      const events = slots.map(slot => {
        const start = nextOccurrenceEST(slot.time);
        const end = new Date(start.getTime() + Math.round((slot.duration || 1) * 60 * 60 * 1000));
        // If duration has fractional hours (e.g., 1.5), add minutes accordingly
        const frac = (slot.duration || 1) % 1;
        if (frac) {
          end.setMinutes(end.getMinutes() + Math.round(frac * 60));
        }
        // Convert to ISO strings (UTC) — crawlers accept ISO; timezone offset is preserved by using toLocaleString earlier
        const startISO = start.toISOString();
        const endISO = end.toISOString();

        return {
          "@type": "Event",
          "name": `${slot.label || slot.id} — 789 Studios Space`,
          "startDate": startISO,
          "endDate": endISO,
          "url": slot.xLink || "",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": { "@type": "VirtualLocation", "url": slot.xLink || "" }
        };
      });

      if (!events.length) return;

      const jsonLd = {
        "@context": "https://schema.org",
        "@graph": events
      };

      // Inject script tag safely
      try {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.text = JSON.stringify(jsonLd);
        if (document.head) document.head.appendChild(s);
        else document.body.appendChild(s);
      } catch (err) {
        // If injection fails, do not throw — log for debugging
        console.warn('JSON-LD injection failed:', err);
      }
    });
  } catch (e) {
    // Defensive: never break the widget if JSON-LD fails
    console.warn('JSON-LD injector error:', e);
  }
})();
