// main.js
import { ASSET_BASE_URL, BACKGROUND_IMAGE, FLAMES, TIMEZONE, HOSTS } from './config.js';

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
 * Get the best flame source URL for a given lighter type.
 */
function getFlameSourceForType(type) {
  const set = type === 'zippo' ? FLAMES.zippo : FLAMES.bic;
  return set.primary || set.fallback || set.hevc || '';
}

/**
 * Create a lighter DOM element (container with video + img).
 */
function createLighterElement(host, minutesNow) {
  const liveNow = isHostLive(host, minutesNow);
  const container = document.createElement('div');
  container.className = 'lighter';
  container.dataset.hostId = host.id;

  // Flame video (behind image)
  const flameSrc = liveNow ? getFlameSourceForType(host.type) : null;
  if (flameSrc) {
    const flame = document.createElement('video');
    flame.className = 'flame';
    flame.src = flameSrc;
    flame.autoplay = true;
    flame.loop = true;
    flame.muted = true;
    flame.playsInline = true;
    flame.style.zIndex = '0';
    container.appendChild(flame);
  }

  // Lighter image
  const img = document.createElement('img');
  img.className = 'lighter-image';
  img.alt = host.name;
  img.loading = 'lazy';
  if (host.type === 'zippo') {
    img.src = getZippoImageForHost(host, liveNow);
  } else {
    img.src = host.image;
  }
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
 * Popup always stays in viewport; clicking inside opens X link.
 * Clicking outside closes.
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
    const scrollOffset = scrollY * -0.05; // subtle vertical parallax
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
  // Initial render
  renderRows();
  // Refresh every 60 seconds
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
