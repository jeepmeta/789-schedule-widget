/* config.js - Root schedule configuration for 789 Schedule Widget
   Edit only this file to update times, durations, images, and X links.
   Times are in EST (America/New_York). Durations accept decimals (e.g., 1.5).
*/

const SCHEDULE_CONFIG = {
  timezone: "America/New_York",      // EST timezone for all comparisons
  refreshIntervalSec: 30,            // how often (seconds) to re-evaluate live state
  background: {
    url: "https://jeepmeta.github.io/789-schedule-assets/backgrounds/background.png",
    opacity: 0.18,
    scale: 1.12,
    speed: 0.02
  },

  // Founders row (locked Zippo trio at 19:00, 20:00, 21:00)
  foundersRow: [
    {
      id: "Vibes",
      label: "Vibes",
      time: "19:00",
      duration: 1,
      type: "zippo",
      closedImg: "https://jeepmeta.github.io/789-schedule-assets/zippos/Vibes-closed.png",
      openImg:   "https://jeepmeta.github.io/789-schedule-assets/zippos/Vibes-open.png",
      summaryImg:"https://jeepmeta.github.io/789-schedule-assets/summaries/Vibes-summary.png",
      flameVideo:"https://jeepmeta.github.io/789-schedule-assets/flames/zippo-flame.mp4",
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
      openImg:   "https://jeepmeta.github.io/789-schedule-assets/zippos/Wooki-open.png",
      summaryImg:"https://jeepmeta.github.io/789-schedule-assets/summaries/Wooki-summary.png",
      flameVideo:"https://jeepmeta.github.io/jeepmeta/789-schedule-assets/flames/zippo-flame.mp4",
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
      openImg:   "https://jeepmeta.github.io/789-schedule-assets/zippos/Gator-open.png",
      summaryImg:"https://jeepmeta.github.io/789-schedule-assets/summaries/Gator-summary.png",
      flameVideo:"https://jeepmeta.github.io/789-schedule-assets/flames/zippo-flame.mp4",
      xLink: "https://x.com/gatormetax",
      overlapPriority: 2
    }
  ],

  // All other spaces (named entries). Times are EST. Durations can be fractional.
  // The visual schedule will be rendered starting at 06:00 and flow forward.
  spaces: [
    {
      id: "Grami",
      label: "Grami",
      time: "06:00",
      duration: 1,
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Grami.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Grami-summary.png",
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
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
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
      xLink: "https://x.com/leahbluewater",
      overlapPriority: 1
    },
    {
      id: "Shibo",
      label: "Shibo",
      time: "10:00",
      duration: 2, // 2-hour slot
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Shibo.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Shibo-summary.png",
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
      xLink: "https://x.com/godsburnt",
      overlapPriority: 1
    },
    {
      id: "Paws",
      label: "Paws",
      time: "13:00",
      duration: 2, // 2-hour slot
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Paws.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Paws-summary.png",
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
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
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
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
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
      xLink: "https://x.com/anthemhayek",
      overlapPriority: 1
    },
    {
      id: "Bark",
      label: "Bark",
      time: "17:00",
      duration: 2, // 2-hour slot (17:00-19:00)
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Bark.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Bark-summary.png",
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
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
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
      xLink: "https://x.com/crypto_sauce",
      overlapPriority: 1
    },
    {
      id: "Dream",
      label: "Dream",
      time: "23:00",
      duration: 1.5, // 1.5 hours (23:00 - 00:30 next day)
      type: "bic",
      bicImg: "https://jeepmeta.github.io/789-schedule-assets/bics/Dream.png",
      summaryImg: "https://jeepmeta.github.io/789-schedule-assets/summaries/Dream-summary.png",
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
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
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
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
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
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
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
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
      flameVideo: "https://jeepmeta.github.io/789-schedule-assets/flames/bic-flame.mp4",
      xLink: "https://x.com/truckmeta",
      overlapPriority: 1
    }
  ]
};

/* Export for environments that support modules (optional) */
if (typeof module !== "undefined") {
  module.exports = { SCHEDULE_CONFIG };
}
