import { ASSET_BASE_URL, BACKGROUND_IMAGE, TIMEZONE, HOSTS } from './config.js';

function parseTimeToMinutes(timeStr) {
  const [hourStr, minuteStr] = timeStr.split(':');
  const h = parseInt(hourStr, 10);
  const m = parseInt(minuteStr, 10) || 0;
  if (h === 24 && m === 0) return 24 * 60;
  return h * 60 + m;
}

function getCurrentMinutesInTimezone() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
  const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);
  return hour * 60 + minute;
}

function isHostLive(host, minutesNow) {
  return host.schedule.some(({ start, end }) => {
    const startMin = parseTimeToMinutes(start);
    const endMin = parseTimeToMinutes(end);
    return minutesNow >= startMin && minutesNow < endMin;
  });
}

function getZippoImageForHost(host, isLiveNow) {
  if (host.type !== 'zippo') return host.image;
  return isLiveNow ? host.zippoOpen : host.zippoClosed;
}

function getFlameVideoSrc(host) {
  if (host.type === 'zippo') {
    return `${ASSET_BASE_URL}/flames/zippo-flame.webm`;
  }
  return `${ASSET_BASE_URL}/flames/bic-flame.webm`;
}

function createLighterElement(host, minutesNow) {
  const liveNow = isHostLive(host, minutesNow);
  const container = document.createElement('div');
  container.className = 'lighter';
  container.dataset.hostId = host.id;

  if (liveNow) {
    container.classList.add('live');

    const flameWrap = document.createElement('div');
    flameWrap.className = 'css-flame-wrap';

    const flameVideo = document.createElement('video');
    flameVideo.className = 'flame-video';
    flameVideo.autoplay = true;
    flameVideo.loop = true;
    flameVideo.muted = true;
    flameVideo.playsInline = true;

    const source = document.createElement('source');
    source.src = getFlameVideoSrc(host);
    source.type = 'video/webm';

    flameVideo.appendChild(source);
    flameWrap.appendChild(flameVideo);
    container.appendChild(flameWrap);
  }

  const img = document.createElement('img');
  img.className = 'lighter-image';
  img.alt = host.name;
  img.loading = 'lazy';
  img.src = host.type === 'zippo'
    ? getZippoImageForHost(host, liveNow)
    : host.image;

  container.appendChild(img);

  container.addEventListener('click', () => showSummaryPopup(host));

  return container;
}

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

function showSummaryPopup(host) {
  const overlay = document.getElementById('summary-overlay');
  const popup = document.getElementById('summary-popup');

  popup.style.backgroundImage = `url("${host.summaryImage}")`;
  overlay.classList.remove('hidden');

  popup.onclick = event => {
    event.stopPropagation();
    window.open(host.xUrl, '_blank');
  };

  overlay.onclick = () => {
    overlay.classList.add('hidden');
  };
}

function hideSummaryPopup() {
  const overlay = document.getElementById('summary-overlay');
  overlay.classList.add('hidden');
}

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

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateParallax();
  });

  updateParallax();
}

function startScheduleRefresh() {
  renderRows();
  setInterval(renderRows, 60 * 1000);
}

function init() {
  initBackground();
  startScheduleRefresh();
}

document.addEventListener('DOMContentLoaded', init);

(() => {
  const state = {
    currentWind: 0,
    targetWind: 0,
    lastMouseX: null,
    lastTime: null,
    lastMoveTime: 0
  };

  document.addEventListener('mousemove', e => {
    const now = performance.now();
    const x = e.clientX;

    const base = (x / window.innerWidth - 0.5) * 6;

    if (state.lastMouseX !== null && state.lastTime !== null) {
      const dx = x - state.lastMouseX;
      const dt = now - state.lastTime;
      const speed = Math.abs(dx) / Math.max(dt, 1);

      let gust = speed * 0.04;
      if (gust > 4) gust = 4;
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

    const t = now * 0.0004;
    const auto =
      Math.sin(t) * 1.5 +
      Math.sin(t * 0.37) * 0.7;

    const timeSinceMove = now - state.lastMoveTime;
    if (timeSinceMove > 1200) {
      state.targetWind *= 0.96;
    }

    const desired = auto + state.targetWind;

    const lerpFactor = 0.08;
    state.currentWind =
      state.currentWind + (desired - state.currentWind) * lerpFactor;

    document.documentElement.style.setProperty(
      '--wind',
      `${state.currentWind}deg`
    );

    requestAnimationFrame(updateWind);
  }

  requestAnimationFrame(updateWind);
})();

window.enableFlameDebug = function () {
  document.body.classList.add('flame-debug');
};

window.disableFlameDebug = function () {
  document.body.classList.remove('flame-debug');
};
