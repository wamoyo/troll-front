// CSS: styles/components/video-player.css

import html from '@utils/html.js'

// Pure: returns video player component with head, body, scripts
// video object: { id, src, poster, captions?, title?, sessionTitle?, artist?, artwork?, wide? }
export default function videoPlayer (video) {
  var artworkAttr = video.artwork ? `data-artwork='${JSON.stringify(video.artwork)}'` : ''
  var wideClass = video.wide ? ' width-full' : ''

  return {
    head: html`
      <link rel="stylesheet" href="/styles/components/video-player.css">
    `,
    body: html`
      <div id="${video.id}" class="cp-video-player disabled${wideClass}"
           data-session-title="${video.sessionTitle || ''}"
           data-artist="${video.artist || ''}"
           ${artworkAttr}>
        <div class="video-wrapper">
          ${video.title ? html`<h1 class="video-heading">${video.title}</h1>` : ''}
          <video class="video" preload="metadata" poster="${video.poster}" data-src="${video.src}">
            ${video.captions ? html`<track class="track" label="English" kind="captions" srclang="en" src="${video.captions}" default>` : ''}
          </video>
          <button class="big-play-button" tabindex="0" aria-label="Play video">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="48" stroke="currentColor" stroke-width="3" fill="rgba(0,0,0,0.5)"/>
              <polygon points="40,30 40,70 72,50" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div class="video-controls">
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
            <div class="thumb" draggable="true">0:00</div>
          </div>
          <div class="total-time">0:00</div>
          ${video.captions ? html`
          <button class="cc" tabindex="0" aria-label="Toggle captions">
            <svg class="icon-cc-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <text x="12" y="15" text-anchor="middle" font-size="8" fill="currentColor" stroke="none">CC</text>
            </svg>
            <svg class="icon-cc-on hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor"/>
              <text x="12" y="15" text-anchor="middle" font-size="8" fill="black" stroke="none" font-weight="bold">CC</text>
            </svg>
          </button>
          ` : ''}
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
          <button class="fullscreen" tabindex="0" aria-label="Toggle fullscreen">
            <svg class="icon-fullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4,14 4,20 10,20"/>
              <polyline points="20,14 20,20 14,20"/>
              <polyline points="4,10 4,4 10,4"/>
              <polyline points="20,10 20,4 14,4"/>
            </svg>
            <svg class="icon-exit-fullscreen hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="10,20 10,14 4,14"/>
              <polyline points="14,20 14,14 20,14"/>
              <polyline points="10,4 10,10 4,10"/>
              <polyline points="14,4 14,10 20,10"/>
            </svg>
          </button>
        </div>
      </div>
    `,
    scripts: html`
      <script src="/scripts/components/video-player.js" defer></script>
    `
  }
}
