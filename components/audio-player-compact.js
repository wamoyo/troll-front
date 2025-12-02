// CSS: styles/components/audio-player-compact.css

import html from '@utils/html.js'

// Pure: returns compact audio player component with head, body, scripts
// audio object: { id, src }
export default function audioPlayerCompact (audio) {
  return {
    head: html`
      <link rel="stylesheet" href="/styles/components/audio-player-compact.css">
    `,
    body: html`
      <div id="${audio.id}" class="cp-audio-player-compact disabled">
        <audio class="audio" preload="metadata" data-src="${audio.src}"></audio>
        <button class="play-pause" tabindex="0" aria-label="Play/Pause">
          <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
          <svg class="icon-pause hidden" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="3" width="4" height="18"/>
            <rect x="15" y="3" width="4" height="18"/>
          </svg>
        </button>
        <div class="seekbar">
          <div class="bufferbar"></div>
          <div class="timebar"></div>
        </div>
        <button class="skip-back" tabindex="0" aria-label="Skip back 15 seconds">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15,18 9,12 15,6"/>
            <polyline points="9,18 3,12 9,6"/>
          </svg>
        </button>
        <div class="time-display">
          <span class="current-time">0:00</span>
          <span class="separator">/</span>
          <span class="total-time">0:00</span>
        </div>
        <button class="skip-forward" tabindex="0" aria-label="Skip forward 15 seconds">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9,6 15,12 9,18"/>
            <polyline points="15,6 21,12 15,18"/>
          </svg>
        </button>
      </div>
    `,
    scripts: html`
      <script src="/scripts/components/audio-player-compact.js" defer></script>
    `
  }
}
