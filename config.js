// config.js

// Base URL for all assets (GitHub Pages)
export const ASSET_BASE_URL = 'https://jeepmeta.github.io/789-schedule-assets';

// Single background image for the whole widget
export const BACKGROUND_IMAGE = `${ASSET_BASE_URL}/backgrounds/background.png`;

// Global flame video sources
// Widget code should try sources in order for best compatibility
export const FLAMES = {
  bic: {
    primary: `${ASSET_BASE_URL}/flames/bic-flame.webm`,
    fallback: `${ASSET_BASE_URL}/flames/bic-flame.mov`,
    hevc: `${ASSET_BASE_URL}/flames/bic-flame-hevc.mov`,
  },
  zippo: {
    primary: `${ASSET_BASE_URL}/flames/zippo-flame.webm`,
    fallback: `${ASSET_BASE_URL}/flames/zippo-flame.mov`,
    hevc: `${ASSET_BASE_URL}/flames/zippo-flame-hevc.mov`,
  },
};

// Timezone for schedule
export const TIMEZONE = 'America/New_York'; // EST/EDT

// Schedule + assets
export const HOSTS = [
  {
    id: 'grami',
    name: 'Grami',
    xHandle: '@gramixmeta',
    xUrl: 'https://x.com/gramixmeta',
    type: 'bic',
    row: 'day',
    image: `${ASSET_BASE_URL}/bics/Grami.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Grami-summary.png`,
    schedule: [{ start: '06:00', end: '07:00' }],
  },
  {
    id: 'leah',
    name: 'Leah',
    xHandle: '@leahbluewater',
    xUrl: 'https://x.com/leahbluewater',
    type: 'bic',
    row: 'day',
    image: `${ASSET_BASE_URL}/bics/Leah.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Leah-summary.png`,
    schedule: [{ start: '06:00', end: '07:00' }],
  },
  {
    id: 'shibo',
    name: 'Shibo',
    xHandle: '@godsburnt',
    xUrl: 'https://x.com/godsburnt',
    type: 'bic',
    row: 'day',
    image: `${ASSET_BASE_URL}/bics/Shibo.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Shibo-summary.png`,
    schedule: [{ start: '10:00', end: '12:00' }],
  },
  {
    id: 'paws',
    name: 'Paws',
    xHandle: '@pawsmeta',
    xUrl: 'https://x.com/pawsmeta',
    type: 'bic',
    row: 'day',
    image: `${ASSET_BASE_URL}/bics/Paws.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Paws-summary.png`,
    schedule: [{ start: '13:00', end: '15:00' }],
  },
  {
    id: 'shield',
    name: 'Shield',
    xHandle: '@shieldmetax',
    xUrl: 'https://x.com/shieldmetax',
    type: 'bic',
    row: 'day',
    image: `${ASSET_BASE_URL}/bics/Shield.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Shield-summary.png`,
    schedule: [{ start: '14:00', end: '15:00' }],
  },
  {
    id: 'anthem',
    name: 'Anthem',
    xHandle: '@anthemhayek',
    xUrl: 'https://x.com/anthemhayek',
    type: 'bic',
    row: 'day',
    image: `${ASSET_BASE_URL}/bics/Anthem.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Anthem-summary.png`,
    schedule: [{ start: '15:00', end: '16:00' }],
  },
  {
    id: 'bark',
    name: 'Bark',
    xHandle: '@barkmeta',
    xUrl: 'https://x.com/barkmeta',
    type: 'bic',
    row: 'day',
    image: `${ASSET_BASE_URL}/bics/Bark.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Bark-summary.png`,
    schedule: [{ start: '17:00', end: '19:00' }],
  },

  // ZIPPO row: 7pm, 8pm, 9pm
  {
    id: 'vibes',
    name: 'Vibes',
    xHandle: '@vibesmetax',
    xUrl: 'https://x.com/vibesmetax',
    type: 'zippo',
    row: 'zippo',
    zippoClosed: `${ASSET_BASE_URL}/zippos/Vibes-closed.png`,
    zippoOpen: `${ASSET_BASE_URL}/zippos/Vibes-open.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Vibes-summary.png`,
    schedule: [{ start: '19:00', end: '20:00' }],
  },
  {
    id: 'wooki',
    name: 'Wooki',
    xHandle: '@wookimeta',
    xUrl: 'https://x.com/wookimeta',
    type: 'zippo',
    row: 'zippo',
    zippoClosed: `${ASSET_BASE_URL}/zippos/Wooki-closed.png`,
    zippoOpen: `${ASSET_BASE_URL}/zippos/Wooki-open.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Wooki-summary.png`,
    schedule: [{ start: '20:00', end: '21:00' }],
  },
  {
    id: 'gator',
    name: 'Gator',
    xHandle: '@gatormetax',
    xUrl: 'https://x.com/gatormetax',
    type: 'zippo',
    row: 'zippo',
    zippoClosed: `${ASSET_BASE_URL}/zippos/Gator-closed.png`,
    zippoOpen: `${ASSET_BASE_URL}/zippos/Gator-open.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Gator-summary.png`,
    schedule: [{ start: '21:00', end: '22:00' }],
  },

  // Night row: 22:00–06:00
  {
    id: 'sauce',
    name: 'Sauce',
    xHandle: '@crypto_sauce',
    xUrl: 'https://x.com/crypto_sauce',
    type: 'bic',
    row: 'night',
    image: `${ASSET_BASE_URL}/bics/Sauce.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Sauce-summary.png`,
    schedule: [{ start: '22:00', end: '23:00' }],
  },
  {
    id: 'dream',
    name: 'Dream',
    xHandle: '@dreammetax',
    xUrl: 'https://x.com/dreammetax',
    type: 'bic',
    row: 'night',
    image: `${ASSET_BASE_URL}/bics/Dream.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Dream-summary.png`,
    // crosses midnight
    schedule: [
      { start: '23:00', end: '24:00' },
      { start: '00:00', end: '00:30' },
    ],
  },
  {
    id: 'grow',
    name: 'Grow',
    xHandle: '@growxmeta',
    xUrl: 'https://x.com/growxmeta',
    type: 'bic',
    row: 'night',
    image: `${ASSET_BASE_URL}/bics/Grow.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Grow-summary.png`,
    schedule: [{ start: '00:00', end: '01:00' }],
  },
  {
    id: 'neuro',
    name: 'Neuro',
    xHandle: '@neurometax',
    xUrl: 'https://x.com/neurometax',
    type: 'bic',
    row: 'night',
    image: `${ASSET_BASE_URL}/bics/Neuro.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Neuro-summary.png`,
    schedule: [{ start: '01:00', end: '02:00' }],
  },
  {
    id: 'artsy',
    name: 'Artsy',
    xHandle: '@artsymeta',
    xUrl: 'https://x.com/artsymeta',
    type: 'bic',
    row: 'night',
    image: `${ASSET_BASE_URL}/bics/Artsy.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Artsy-summary.png`,
    schedule: [{ start: '02:00', end: '03:00' }],
  },
  {
    id: 'truck',
    name: 'Truck',
    xHandle: '@truckmeta',
    xUrl: 'https://x.com/truckmeta',
    type: 'bic',
    row: 'night',
    image: `${ASSET_BASE_URL}/bics/Truck.png`,
    summaryImage: `${ASSET_BASE_URL}/summaries/Truck-summary.png`,
    schedule: [{ start: '03:00', end: '04:00' }],
  },
];
