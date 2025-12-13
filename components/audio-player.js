// CSS: styles/components/audio-player.css

import html from '@utilities/html.js'

// Pure: returns audio player component with head, body, scripts
// audio object: { id, src, title?, avatar?, sessionTitle?, artist?, artwork?, wide? }
export default function audioPlayer (audio) {
  var artworkAttr = audio.artwork ? `data-artwork='${JSON.stringify(audio.artwork)}'` : ''
  var wideClass = audio.wide ? ' width-full' : ''

  return {
    head: html`
      <link rel="stylesheet" href="/styles/components/audio-player.css">
    `,
    body: html`
      <div id="${audio.id}" class="cp-audio-player disabled${wideClass}"
           data-session-title="${audio.sessionTitle || ''}"
           data-artist="${audio.artist || ''}"
           ${artworkAttr}>
        ${audio.avatar ? html`
        <div class="avatar">
          <img src="${audio.avatar}" alt="${audio.artist || 'Speaker'}" width="60" height="60">
        </div>
        ` : ''}
        <div class="player-content">
          ${audio.title ? html`<div class="audio-title">${audio.title}</div>` : ''}
          <audio class="audio" preload="metadata" data-src="${audio.src}"></audio>
          <div class="audio-controls">
            <button class="skip-back" tabindex="0" aria-label="Skip back 15 seconds">
              <svg viewBox="0 0 24 28" fill="currentColor">
                <text x="12" y="12" text-anchor="middle" font-size="12" font-weight="bold">15</text>
                <path d="M17 20H7l4-4-4 4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="play-pause" tabindex="0" aria-label="Play/Pause">
              <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
              <svg class="icon-pause hidden" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="3" width="4" height="18"/>
                <rect x="15" y="3" width="4" height="18"/>
              </svg>
            </button>
            <button class="skip-forward" tabindex="0" aria-label="Skip forward 15 seconds">
              <svg viewBox="0 0 24 28" fill="currentColor">
                <text x="12" y="12" text-anchor="middle" font-size="12" font-weight="bold">15</text>
                <path d="M7 20h10l-4-4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="seekbar">
              <div class="bufferbar"></div>
              <div class="timebar"></div>
              <div class="thumb">0:00</div>
            </div>
            <div class="total-time">0:00</div>
            <button class="speaker" tabindex="0" aria-label="Mute/Unmute">
              <svg class="icon-speaker" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="3,9 7,9 12,4 12,20 7,15 3,15"/>
                <path d="M16,8 Q20,12 16,16" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M18,5 Q24,12 18,19" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg class="icon-muted hidden" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="3,9 7,9 12,4 12,20 7,15 3,15"/>
                <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" stroke-width="2"/>
                <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <div class="settings-wrapper">
              <button class="settings" tabindex="0" aria-label="Settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
              <div class="settings-panel">
                <div class="settings-section">
                  <div class="settings-label">Speed</div>
                  <div class="speed-options">
                    <button class="speed-option" data-speed="0.5">0.5x</button>
                    <button class="speed-option" data-speed="0.75">0.75x</button>
                    <button class="speed-option active" data-speed="1">1x</button>
                    <button class="speed-option" data-speed="1.25">1.25x</button>
                    <button class="speed-option" data-speed="1.5">1.5x</button>
                    <button class="speed-option" data-speed="2">2x</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    scripts: html`
      <script src="/scripts/components/audio-player.js" defer></script>
    `
  }
}
