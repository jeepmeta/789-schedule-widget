/* main.js - full renderer (replace entire file) */
(function () {
  'use strict';

  // Wait for SCHEDULE_CONFIG to exist
  function waitForConfig(timeout = 4000) {
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

  // Current minutes in configured timezone
  function getNowMinutes(timezone) {
    try {
      const now = new Date();
      const timeOnly = now.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false, hour: '2-digit', minute: '2-digit' });
      const [hh, mm] = timeOnly.split(':').map(Number);
      return (hh || 0) * 60 + (mm || 0);
    } catch (e) {
      const d = new Date();
      return d.getHours() * 60 + d.getMinutes();
    }
  }

  // Adjust minutes so schedule day starts at dayStart (default 06:00)
  function adjustedMinutes(minutes, dayStart = 6 * 60) {
    const DAY = 24 * 60;
    return (minutes - dayStart + DAY) % DAY;
  }

  // Build DOM stage if missing
  function ensureStage() {
    const root = document.getElementById('schedule-root');
    if (!root) throw new Error('schedule-root missing');
    let container = document.getElementById('schedule-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'schedule-container';
    }
    container.innerHTML = '';

    const stage = document.createElement('div');
    stage.className = 'stage';

    const bg = document.createElement('div');
    bg.className = 'parallax-bg';
    stage.appendChild(bg);

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

    const popups = document.createElement('div');
    popups.id = 'popups';
    stage.appendChild(popups);

    container.appendChild(stage);
    root.appendChild(container);
    return { stage, bg, rowTop, rowFounders, rowBottom, popups };
  }

  // Determine if a slot is currently live
  function isSlotLive(slot, cfg) {
    if (!slot || !slot.time) return false;
    const now = getNowMinutes(cfg.timezone);
    const start = hhmmToMinutes(slot.time);
    const durationMin = Math.round((slot.duration || 0) * 60);
    const end = (start + durationMin) % (24 * 60);
    if (durationMin <= 0) return false;
    if (start <= end) {
      return now >= start && now < end;
    } else {
      return now >= start || now < end;
    }
  }

  // Create a card element for a slot
  function createCard(slot, cfg) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', slot.id || '');
    card.setAttribute('data-type', slot.type || '');
    const bicHeight = '360px';
    const zippoHeight = '300px';
    const height = slot.type === 'zippo' ? zippoHeight : bicHeight;
    card.style.setProperty('--card-height', height);

    const img = document.createElement('img');
    img.alt = slot.label || slot.id || '';
    img.draggable = false;
    img.className = 'space-img';

    if (slot.type === 'zippo') {
      img.src = slot.closedImg || slot.openImg || slot.bicImg || '';
    } else {
      img.src = slot.bicImg || slot.closedImg || '';
    }

    card._img = img;
    card._slot = slot;

    img.onerror = () => { img.style.opacity = '0'; };

    card.appendChild(img);

    // Hover to show popup
    card.addEventListener('mouseenter', () => {
      showPopup(slot, card);
    });

    // Hide popup when leaving card (popup keeps it open while hovered)
    card.addEventListener('mouseleave', () => {
      setTimeout(() => {
        const pop = document.getElementById('popups').firstElementChild;
        if (!pop) return;
        if (!pop.matches(':hover') && !card.matches(':hover')) {
          hidePopup();
        }
      }, 60);
    });

    // Click opens xLink (if present)
    if (slot.xLink) {
      card.addEventListener('click', () => {
        window.open(slot.xLink, '_blank', 'noopener');
      });
    }

    card.setAttribute('data-live', 'false');

    return card;
  }

  // Create video element with fallback attempt (.mov -> .mp4)
  function createVideoElement(src) {
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');
    video.className = 'flame';
    video.style.zIndex = '0';
    video.style.pointerEvents = 'none';
    video.addEventListener('error', () => {
      if (src.match(/\.mov$/i)) {
        const alt = src.replace(/\.mov$/i, '.mp4');
        if (alt !== src) {
          try { video.remove(); } catch (e) {}
          const v2 = createVideoElement(alt);
          return v2;
        }
      }
    });
    return video;
  }

  // attachFlameVideo: uses global flameSources from SCHEDULE_CONFIG based on slot.type
function attachFlameVideo(card, slot) {
  if (!slot || !window.SCHEDULE_CONFIG || !window.SCHEDULE_CONFIG.flameSources) return;
  // avoid duplicate video
  if (card.querySelector('video')) return;

  // pick flame sources by slot.type (fallback to bic if unknown)
  const type = slot.type === 'zippo' ? 'zippo' : 'bic';
  const sources = window.SCHEDULE_CONFIG.flameSources[type] || {};
  const webm = sources.webm || '';
  const hevc = sources.hevc || '';

  // create video element
  const video = document.createElement('video');
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('aria-hidden', 'true');
  video.className = 'flame';
  video.style.zIndex = '0';
  video.style.pointerEvents = 'none';

  // helper to append a source if URL exists
  const addSource = (src, type) => {
    if (!src) return;
    const s = document.createElement('source');
    s.src = src;
    if (type) s.type = type;
    video.appendChild(s);
  };

  // add sources: webm first, then hevc fallback
  if (webm) addSource(webm, 'video/webm; codecs="vp9"');
  if (hevc) addSource(hevc, 'video/quicktime');

  // insert video before image so it sits behind
  const img = card.querySelector('img');
  if (img) card.insertBefore(video, img);

  // try to play; if browser can't play any source, remove video after error
  video.play().catch(() => {
    setTimeout(() => {
      try { video.remove(); } catch(e){}
    }, 500);
  });

  // if the browser reports an error, remove video to avoid broken element
  video.addEventListener('error', () => {
    setTimeout(() => { try { video.remove(); } catch(e){} }, 300);
  });
}

  // Remove flame video
  function detachFlameVideo(card) {
    const v = card.querySelector('video');
    if (v) {
      try { v.pause(); } catch (e) {}
      v.remove();
    }
  }

  // Show popup with smooth transition and smart placement
  function showPopup(slot, card) {
    const popups = document.getElementById('popups');
    if (!popups) return;
    popups.innerHTML = '';
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', `${slot.label} summary`);
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(8px) scale(0.98)';
    popup.style.transition = 'opacity 180ms ease, transform 220ms cubic-bezier(.22,.9,.35,1)';
    const img = document.createElement('img');
    img.src = slot.summaryImg;
    img.alt = `${slot.label} summary`;
    img.style.maxWidth = '640px';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.display = 'block';
    popup.appendChild(img);

    popups.appendChild(popup);

    const place = () => {
      const rect = card.getBoundingClientRect();
      const stageRect = document.querySelector('.stage').getBoundingClientRect();
      const stageWidth = stageRect.width;
      const popupRect = popup.getBoundingClientRect();
      const popupW = popupRect.width;
      const popupH = popupRect.height;
      const cardCenter = (rect.left + rect.right) / 2 - stageRect.left;
      const margin = 12;

      let left;
      if (cardCenter < stageWidth * 0.33) {
        left = rect.right - stageRect.left - popupW + margin;
      } else if (cardCenter >= stageWidth * 0.33 && cardCenter <= stageWidth * 0.66) {
        left = rect.left - stageRect.left + (rect.width - popupW) / 2;
      } else {
        left = rect.left - stageRect.left + margin;
      }

      left = Math.max(margin, Math.min(left, stageWidth - popupW - margin));

      let top = rect.bottom - stageRect.top + 8;
      const stageHeight = stageRect.height;
      if (top + popupH + margin > stageHeight) {
        top = rect.top - stageRect.top - popupH - 8;
        if (top < margin) top = stageHeight - popupH - margin;
      }

      popup.style.left = `${Math.round(left)}px`;
      popup.style.top = `${Math.round(top)}px`;

      requestAnimationFrame(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0) scale(1)';
      });
    };

    if (!img.complete) {
      img.addEventListener('load', place);
      img.addEventListener('error', place);
    } else {
      place();
    }

    popup.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!card.matches(':hover') && !popup.matches(':hover')) hidePopup();
      }, 60);
    });

    popups.appendChild(popup);
  }

  // Smooth hide
  function hidePopup() {
    const popups = document.getElementById('popups');
    if (!popups) return;
    const popup = popups.firstElementChild;
    if (!popup) return;
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(8px) scale(0.98)';
    setTimeout(() => { popups.innerHTML = ''; }, 220);
  }

  // Update live/open states and attach/detach flames
  function updateLiveStates(cfg) {
    if (!cfg) return;
    const cards = Array.from(document.querySelectorAll('.card'));
    cards.forEach(card => {
      const slot = card._slot;
      if (!slot) return;
      const live = isSlotLive(slot, cfg);
      const prev = card.getAttribute('data-live') === 'true';
      if (slot.type === 'zippo') {
        if (live && !prev) {
          if (slot.openImg) card._img.src = slot.openImg;
          attachFlameVideo(card, slot);
          card.setAttribute('data-live', 'true');
        } else if (!live && prev) {
          if (slot.closedImg) card._img.src = slot.closedImg;
          detachFlameVideo(card);
          card.setAttribute('data-live', 'false');
        }
      } else {
        // For bic: attach flame when live
        if (live && !prev) {
          attachFlameVideo(card, slot);
          card.setAttribute('data-live', 'true');
        } else if (!live && prev) {
          // keep images visible; detach if you prefer
          // detachFlameVideo(card);
          card.setAttribute('data-live', 'false');
        }
      }
    });
  }

  // JSON-LD injection (non-blocking)
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
      console.warn('json-ld error', e);
    }
  }

  // Parallax init (stronger, smoother)
  function initParallax(bgEl, config) {
    if (!bgEl || !config || !config.background) return;
    bgEl.style.backgroundImage = `url("${config.background.url}")`;
    bgEl.style.opacity = String(config.background.opacity ?? 0.18);
    bgEl.style.backgroundRepeat = 'no-repeat';
    bgEl.style.backgroundPosition = 'center center';
    const maxShift = 140;
    window.addEventListener('scroll', () => {
      const stage = document.querySelector('.stage');
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const pct = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
      const shift = (pct - 0.5) * 2 * maxShift;
      const horiz = Math.sin(pct * Math.PI * 2) * (maxShift * 0.08);
      bgEl.style.transform = `translate3d(${horiz}px, ${shift}px, 0)`;
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

    initParallax(bg, cfg);

    const founders = Array.isArray(cfg.foundersRow) ? cfg.foundersRow.slice() : [];
    const spaces = Array.isArray(cfg.spaces) ? cfg.spaces.slice() : [];

    const dayStartMinutes = 6 * 60;
    const firstFounderTime = founders.length ? hhmmToMinutes(founders[0].time) : 24 * 60;
    const firstFounderAdjusted = adjustedMinutes(firstFounderTime, dayStartMinutes);

    const topSpaces = [];
    const bottomSpaces = [];

    spaces.forEach(s => {
      const m = hhmmToMinutes(s.time);
      const adj = adjustedMinutes(m, dayStartMinutes);
      if (adj < firstFounderAdjusted) topSpaces.push(s);
      else bottomSpaces.push(s);
    });

    topSpaces.forEach(s => {
      const card = createCard(s, cfg);
      rowTop.appendChild(card);
    });

    founders.forEach(f => {
      const card = createCard(f, cfg);
      rowFounders.appendChild(card);
    });

    bottomSpaces.forEach(s => {
      const card = createCard(s, cfg);
      rowBottom.appendChild(card);
    });

    // initial live state update
    updateLiveStates(cfg);

    const intervalMs = (cfg.refreshIntervalSec || 30) * 1000;
    setInterval(() => updateLiveStates(cfg), intervalMs);

    injectJsonLd(cfg);
  }

  document.addEventListener('DOMContentLoaded', () => {
    render().catch(e => console.error('render error', e));
  });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    render().catch(()=>{});
  }
})();
