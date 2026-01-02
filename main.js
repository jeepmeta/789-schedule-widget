/* main.js - full renderer for 789 Schedule Widget
   Replace the entire file with this content.
*/
(function () {
  'use strict';

  // Utility: wait for SCHEDULE_CONFIG to exist
  function waitForConfig(timeout = 3000) {
    return new Promise((resolve) => {
      if (window.SCHEDULE_CONFIG && Array.isArray(window.SCHEDULE_CONFIG.spaces)) return resolve(window.SCHEDULE_CONFIG);
      const start = Date.now();
      const iv = setInterval(() => {
        if (window.SCHEDULE_CONFIG && Array.isArray(window.SCHEDULE_CONFIG.spaces)) {
          clearInterval(iv);
          return resolve(window.SCHEDULE_CONFIG);
        }
        if (Date.now() - start > timeout) {
          clearInterval(iv);
          return resolve(null);
        }
      }, 100);
    });
  }

  // Parse HH:MM into minutes since midnight
  function hhmmToMinutes(hhmm) {
    if (!hhmm) return 0;
    const [h, m] = hhmm.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  // Create DOM structure if missing
  function ensureStage() {
    const root = document.getElementById('schedule-root');
    if (!root) throw new Error('schedule-root missing');
    // clear container
    const container = document.getElementById('schedule-container') || document.createElement('div');
    container.id = 'schedule-container';
    container.innerHTML = '';

    // stage wrapper
    const stage = document.createElement('div');
    stage.className = 'stage';

    // parallax background
    const bg = document.createElement('div');
    bg.className = 'parallax-bg';
    stage.appendChild(bg);

    // rows wrapper
    const rows = document.createElement('div');
    rows.className = 'rows';

    const rowTop = document.createElement('div');
    rowTop.className = 'row row-top';
    rowTop.id = 'row-top';

    const rowFounders = document.createElement('div');
    rowFounders.className = 'row row-founders';
    rowFounders.id = 'row-founders';

    const rowBottom = document.createElement('div');
    rowBottom.className = 'row row-bottom';
    rowBottom.id = 'row-bottom';

    rows.appendChild(rowTop);
    rows.appendChild(rowFounders);
    rows.appendChild(rowBottom);

    stage.appendChild(rows);

    // popups container
    const popups = document.createElement('div');
    popups.id = 'popups';
    stage.appendChild(popups);

    container.appendChild(stage);
    root.appendChild(container);
    return { stage, bg, rowTop, rowFounders, rowBottom, popups };
  }

  // Create a card element for a slot
  function createCard(slot, config) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', slot.id || '');
    // set height variable based on type
    const bicHeight = '360px';
    const zippoHeight = '300px';
    const height = slot.type === 'zippo' ? zippoHeight : bicHeight;
    card.style.setProperty('--card-height', height);

    // video (flame) if present
    if (slot.flameVideo) {
      const video = document.createElement('video');
      video.src = slot.flameVideo;
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('aria-hidden', 'true');
      video.className = 'flame';
      // ensure autoplay works: keep muted
      video.muted = true;
      video.style.zIndex = '0';
      video.addEventListener('error', () => {
        // silent fallback
      });
      card.appendChild(video);
      // attempt to play (some browsers require user gesture; muted autoplay usually works)
      video.play().catch(()=>{});
    }

    // image element (choose correct key)
    const img = document.createElement('img');
    img.alt = slot.label || slot.id || '';
    img.draggable = false;
    img.className = 'space-img';
    // choose image property based on type
    if (slot.type === 'zippo') {
      img.src = slot.openImg || slot.closedImg || slot.bicImg || '';
    } else {
      img.src = slot.bicImg || slot.closedImg || '';
    }
    // fallback placeholder if image fails
    img.onerror = () => {
      img.style.opacity = '0.0';
    };
    card.appendChild(img);

    // click to open popup summary
    if (slot.summaryImg) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        showPopup(slot, card);
      });
    }

    // link behavior if xLink present
    if (slot.xLink) {
      card.addEventListener('dblclick', () => {
        window.open(slot.xLink, '_blank', 'noopener');
      });
    }

    return card;
  }

  // Show popup summary image positioned above the card
  function showPopup(slot, card) {
    const popups = document.getElementById('popups');
    if (!popups) return;
    // clear existing
    popups.innerHTML = '';
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', `${slot.label} summary`);
    const img = document.createElement('img');
    img.src = slot.summaryImg;
    img.alt = `${slot.label} summary`;
    img.style.maxWidth = '640px';
    img.style.width = 'auto';
    img.style.height = 'auto';
    popup.appendChild(img);

    // position popup near card
    const rect = card.getBoundingClientRect();
    const stageRect = document.querySelector('.stage').getBoundingClientRect();
    // compute coordinates relative to stage
    const left = Math.max(16, rect.left - stageRect.left);
    const top = Math.max(16, rect.bottom - stageRect.top + 8);
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    // close on click outside
    setTimeout(() => {
      const onDoc = (ev) => {
        if (!popup.contains(ev.target)) {
          popups.innerHTML = '';
          document.removeEventListener('click', onDoc);
        }
      };
      document.addEventListener('click', onDoc);
    }, 10);

    popups.appendChild(popup);
  }

  // Build JSON-LD for crawlers (non-blocking)
  function injectJsonLd(cfg) {
    try {
      const slots = (cfg.foundersRow || []).concat(cfg.spaces || []);
      const events = slots.map(s => {
        const start = new Date();
        return {
          "@type": "Event",
          "name": s.label || s.id,
          "startDate": start.toISOString(),
          "url": s.xLink || ""
        };
      });
      const jsonLd = { "@context": "https://schema.org", "@graph": events };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.text = JSON.stringify(jsonLd);
      (document.head || document.body).appendChild(s);
    } catch (e) {
      // do not break page
      console.warn('json-ld error', e);
    }
  }

  // Parallax background handler
  function initParallax(bgEl, config) {
    if (!bgEl || !config || !config.background) return;
    bgEl.style.backgroundImage = `url("${config.background.url}")`;
    bgEl.style.opacity = String(config.background.opacity ?? 0.18);
    bgEl.style.backgroundSize = 'cover';
    bgEl.style.backgroundPosition = 'center';
    const maxShift = 60;
    window.addEventListener('scroll', () => {
      const stage = document.querySelector('.stage');
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const pct = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
      const shift = (pct - 0.5) * 2 * maxShift;
      bgEl.style.transform = `translateY(${shift}px)`;
    }, { passive: true });
  }

  // Main render flow
  async function render() {
    const cfg = await waitForConfig(4000);
    if (!cfg) {
      console.warn('SCHEDULE_CONFIG missing');
      return;
    }

    const { stage, bg, rowTop, rowFounders, rowBottom } = ensureStage();

    // set background clipping by stage size via CSS variables if desired
    // populate rows according to rules
    const founders = Array.isArray(cfg.foundersRow) ? cfg.foundersRow.slice() : [];
    const spaces = Array.isArray(cfg.spaces) ? cfg.spaces.slice() : [];

    // determine first founders time in minutes
    const firstFounderTime = founders.length ? hhmmToMinutes(founders[0].time) : 24 * 60;

    // top row: spaces with time < firstFounderTime
    const topSpaces = spaces.filter(s => hhmmToMinutes(s.time) < firstFounderTime);
    // bottom row: remaining spaces
    const bottomSpaces = spaces.filter(s => hhmmToMinutes(s.time) >= firstFounderTime);

    // append top row cards
    topSpaces.forEach(s => {
      const card = createCard(s, cfg);
      rowTop.appendChild(card);
    });

    // append founders row
    founders.forEach(f => {
      const card = createCard(f, cfg);
      rowFounders.appendChild(card);
    });

    // append bottom row cards
    bottomSpaces.forEach(s => {
      const card = createCard(s, cfg);
      rowBottom.appendChild(card);
    });

    // initialize parallax
    initParallax(bg, cfg);

    // inject JSON-LD for crawlers
    injectJsonLd(cfg);
  }

  // Start rendering
  document.addEventListener('DOMContentLoaded', () => {
    render().catch(e => console.error('render error', e));
  });

  // Also attempt immediate render in case DOMContentLoaded already fired
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    render().catch(()=>{});
  }
})();
