// main.js
import { ASSET_BASE_URL, BACKGROUND_IMAGE, TIMEZONE, HOSTS } from './config.js';

/**
 * Parse "HH:MM" into minutes since midnight.
 * Supports "24:00" as 1440 for end-of-day boundaries.
 */
function parseTimeToMinutes(timeStr) {
  const [hourStr, minuteStr] = timeStr.split(':');
  const h = parseInt(hourStr, 10);
  const m = parseInt(minuteStr, 10) || 0;
  if (h === 24 && m === 0) return 24 * 60;
  return h * 60 + m;
}

/**
 * Get current time in minutes since midnight in the configured timezone.
 */
function getCurrentMinutesInTimezone() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
  const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);
  return hour * 60 + minute;
}

/**
 * Whether the host is live at the given time (in minutes).
 * Handles segments that wrap across midnight via separate schedule entries.
 */
function isHostLive(host, minutesNow) {
  return host.schedule.some(({ start, end }) => {
    const startMin = parseTimeToMinutes(start);
    const endMin = parseTimeToMinutes(end);
    return minutesNow >= startMin && minutesNow < endMin;
  });
}

/**
 * Choose the correct image for zippo hosts (closed vs open).
 */
function getZippoImageForHost(host, isLiveNow) {
  if (host.type !== 'zippo') return host.image;
  return isLiveNow ? host.zippoOpen : host.zippoClosed;
}

/**
 * Create a lighter DOM element (container with CSS flame + img).
 */
function createLighterElement(host, minutesNow) {
  const liveNow = isHostLive(host, minutesNow);
  const container = document.createElement('div');
  container.className = 'lighter';
  container.dataset.hostId = host.id;

  // Add .live class for wobble + glow
  if (liveNow) {
    container.classList.add('live');

    // CSS flame element
    const flame = document.createElement('div');
    flame.className = 'css-flame';
    container.appendChild(flame);
  }

  // Lighter image
  const img = document.createElement('img');
  img.className = 'lighter-image';
  img.alt = host.name;
  img.loading = 'lazy';
  img.src = host.type === 'zippo'
    ? getZippoImageForHost(host, liveNow)
    : host.image;

  container.appendChild(img);

  // Click to open summary popup
  container.addEventListener('click', () => showSummaryPopup(host));

  return container;
}

/**
 * Render all rows (day, zippo, night).
 */
function renderRows() {
  const dayRow = document.getElementById('lighter-row-day');
  const zippoRow = document.getElementById('lighter-row-zippo');
  const nightRow = document.getElementById('lighter-row-night');

  dayRow.innerHTML = '';
  zippoRow.innerHTML = '';
  nightRow.innerHTML = '';

  const minutesNow = getCurrentMinutesInTimezone();

  HOSTS.forEach(host => {
    const lighterEl = createLighterElement(host, minutesNow);
    switch (host.row) {
      case 'day':
        dayRow.appendChild(lighterEl);
        break;
      case 'zippo':
        zippoRow.appendChild(lighterEl);
        break;
      case 'night':
        nightRow.appendChild(lighterEl);
        break;
      default:
        dayRow.appendChild(lighterEl);
    }
  });
}

/**
 * Show summary popup for a host.
 */
function showSummaryPopup(host) {
  const overlay = document.getElementById('summary-overlay');
  const popup = document.getElementById('summary-popup');

  popup.style.backgroundImage = `url("${host.summaryImage}")`;
  overlay.classList.remove('hidden');

  popup.onclick = (event) => {
    event.stopPropagation();
    window.open(host.xUrl, '_blank');
  };

  overlay.onclick = () => {
    overlay.classList.add('hidden');
  };
}

/**
 * Hide summary popup.
 */
function hideSummaryPopup() {
  const overlay = document.getElementById('summary-overlay');
  overlay.classList.add('hidden');
}

/**
 * Initialize background image and parallax behavior.
 */
function initBackground() {
  const bg = document.getElementById('background');
  bg.style.backgroundImage = `url("${BACKGROUND_IMAGE}")`;

  let scrollY = window.scrollY || 0;
  let mouseX = 0;
  let mouseY = 0;

  function updateParallax() {
    const scrollOffset = scrollY * -0.05;
    const mouseOffsetX = (mouseX - window.innerWidth / 2) * 0.01;
    const mouseOffsetY = (mouseY - window.innerHeight / 2) * 0.01;
    bg.style.transform = `translate3d(${mouseOffsetX}px, ${scrollOffset + mouseOffsetY}px, 0)`;
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || 0;
    updateParallax();
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateParallax();
  });

  updateParallax();
}

/**
 * Re-render lighters periodically to update live state & zippo images.
 */
function startScheduleRefresh() {
  renderRows();
  setInterval(renderRows, 60 * 1000);
}

/**
 * Entry point
 */
function init() {
  initBackground();
  startScheduleRefresh();
}

document.addEventListener('DOMContentLoaded', init);

// --------------------------------------------------
// WIND-REACTIVE FLAME: inertia + gust + auto wind
// --------------------------------------------------
(() => {
  const state = {
    currentWind: 0,      // what the CSS currently sees
    targetWind: 0,       // where we want to move toward
    lastMouseX: null,
    lastTime: null,
    lastMoveTime: 0,
  };

  // Mouse moves influence the target wind (gusts + direction)
  document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    const x = e.clientX;

    // Base lean from horizontal position: -3deg (left) to +3deg (right)
    const base = (x / window.innerWidth - 0.5) * 6;

    // Compute horizontal speed for gusts
    if (state.lastMouseX !== null && state.lastTime !== null) {
      const dx = x - state.lastMouseX;
      const dt = now - state.lastTime;
      const speed = Math.abs(dx) / Math.max(dt, 1); // px per ms

      // Gust strength: map speed into a small extra lean
      let gust = speed * 0.04;  // tune factor here
      if (gust > 4) gust = 4;   // clamp gust magnitude

      // Direction of gust matches direction of movement
      gust *= Math.sign(dx || 1);

      state.targetWind = base + gust;
    } else {
      state.targetWind = base;
    }

    state.lastMouseX = x;
    state.lastTime = now;
    state.lastMoveTime = now;
  });

  function updateWind() {
    const now = performance.now();

    // Autonomous wind: layered sines for natural sway
    const t = now * 0.0004;
    const auto =
      Math.sin(t) * 1.5 +
      Math.sin(t * 0.37) * 0.7;

    // If no mouse movement for a while, let target drift back toward 0
    const timeSinceMove = now - state.lastMoveTime;
    if (timeSinceMove > 1200) {
      state.targetWind *= 0.96; // gentle decay toward 0
    }

    // Desired wind = auto sway + user-modulated lean
    const desired = auto + state.targetWind;

    // Inertia: smooth interpolation toward desired
    const lerpFactor = 0.08; // smaller = smoother, larger = snappier
    state.currentWind =
      state.currentWind + (desired - state.currentWind) * lerpFactor;

    // Apply to CSS variable
    document.documentElement.style.setProperty(
      '--wind',
      `${state.currentWind}deg`
    );

    requestAnimationFrame(updateWind);
  }

  requestAnimationFrame(updateWind);
})();
