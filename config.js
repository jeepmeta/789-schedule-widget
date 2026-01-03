/* config.js - Root schedule configuration for 789 Schedule Widget
   Replace this file in your project. Edit only this file to update times,
   durations, images, and X links. Times are in EST (America/New_York).
*/

const SCHEDULE_CONFIG = {
  timezone: "America/New_York",
  refreshIntervalSec: 30,

  background: {
    url: "https://jeepmeta.github.io/789-schedule-assets/backgrounds/background.png",
    opacity: 0.18,
    scale: 1.12,
    speed: 0.02
  },

  // Shared flame sources (webm primary, hevc/mov fallback for Safari)
  flameSources: {
    bic: {
      webm: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.webm",
      hevc: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame-hevc.mov"
    },
    zippo: {
      webm: "https://jeepmeta.github.io/789-schedule-assets/flames/zippo-flame.webm",
      hevc: "https://jeepmeta.github.io/789-schedule-assets/flames/zippo-flame-hevc.mov"
    }
  },

  foundersRow: [
    {
      id: "Vibes",
      label: "Vibes",
      time: "19:00",
      duration: 1,
      type: "zippo",
      closedImg: "https://jeepmeta.github.io/789-schedule-assets/zippos/Vibes-closed.png",
      openImg: "https://jeepmeta.github.io/789-schedule-assets/zippos/Vibes-open.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Vibes-summary.png",
      xLink: "https://x.com/vibesmetax",
      overlapPriority: 2
    },
    {
      id: "Wooki",
      label: "Wooki",
      time: "20:00",
      duration: 1,
      type: "zippo",
      closedImg: "https://jeepmeta.github.io/789-schedule-assets/zippos/Wooki-closed.png",
      openImg: "https://jeepmeta.github.io/789-schedule-assets/zippos/Wooki-open.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Wooki-summary.png",
      xLink: "https://x.com/wookimeta",
      overlapPriority: 2
    },
    {
      id: "Gator",
      label: "Gator",
      time: "21:00",
      duration: 1,
      type: "zippo",
      closedImg: "https://jeepmeta.github.io/789-schedule-assets/zippos/Gator-closed.png",
      openImg: "https://jeepmeta.github.io/789-schedule-assets/zippos/Gator-open.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Gator-summary.png",
      xLink: "https://x.com/gatormetax",
      overlapPriority: 2
    }
  ],

  spaces: [
    {
      id: "Grami",
      label: "Grami",
      time: "06:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Grami.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Grami-summary.png",
      xLink: "https://x.com/gramixmeta",
      overlapPriority: 2
    },
    {
      id: "Leah",
      label: "Leah",
      time: "06:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Leah.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Leah-summary.png",
      xLink: "https://x.com/leahbluewater",
      overlapPriority: 1
    },
    {
      id: "Shibo",
      label: "Shibo",
      time: "10:00",
      duration: 2,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Shibo.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Shibo-summary.png",
      xLink: "https://x.com/godsburnt",
      overlapPriority: 1
    },
    {
      id: "Paws",
      label: "Paws",
      time: "13:00",
      duration: 2,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Paws.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Paws-summary.png",
      xLink: "https://x.com/pawsmeta",
      overlapPriority: 2
    },
    {
      id: "Shield",
      label: "Shield",
      time: "14:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Shield.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Shield-summary.png",
      xLink: "https://x.com/shieldmetax",
      overlapPriority: 1
    },
    {
      id: "Anthem",
      label: "Anthem",
      time: "15:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Anthem.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Anthem-summary.png",
      xLink: "https://x.com/anthemhayek",
      overlapPriority: 1
    },
    {
      id: "Bark",
      label: "Bark",
      time: "17:00",
      duration: 2,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Bark.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Bark-summary.png",
      xLink: "https://x.com/barkmeta",
      overlapPriority: 1
    },
    {
      id: "Sauce",
      label: "Sauce",
      time: "22:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Sauce.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Sauce-summary.png",
      xLink: "https://x.com/crypto_sauce",
      overlapPriority: 1
    },
    {
      id: "Dream",
      label: "Dream",
      time: "23:00",
      duration: 1.5,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Dream.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Dream-summary.png",
      xLink: "https://x.com/dreammetax",
      overlapPriority: 1
    },
    {
      id: "Grow",
      label: "Grow",
      time: "00:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Grow.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Grow-summary.png",
      xLink: "https://x.com/growxmeta",
      overlapPriority: 1
    },
    {
      id: "Neuro",
      label: "Neuro",
      time: "01:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Neuro.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Neuro-summary.png",
      xLink: "https://x.com/neurometax",
      overlapPriority: 1
    },
    {
      id: "Artsy",
      label: "Artsy",
      time: "02:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Artsy.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Artsy-summary.png",
      xLink: "https://x.com/artsymeta",
      overlapPriority: 1
    },
    {
      id: "Truck",
      label: "Truck",
      time: "03:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Truck.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Truck-summary.png",
      xLink: "https://x.com/truckmeta",
      overlapPriority: 1
    }
  ]
};

/* Expose globally so main.js can read it reliably */
window.SCHEDULE_CONFIG = SCHEDULE_CONFIG;

/* Optional CommonJS export for local Node checks */
if (typeof module !== "undefined") {
  module.exports = { SCHEDULE_CONFIG };
}
