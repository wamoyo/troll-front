// Video Player - Client-side functionality
// Handles playback, seeking, fullscreen, keyboard controls, and Media Session API

;(function () {
  "use strict"

  // Initialize all video players on the page
  document.querySelectorAll('.cp-video-player').forEach(initPlayer)

  // Pure: formats seconds into HH:MM:SS or MM:SS string
  function formatTime (seconds) {
    var time = seconds || 0
    var hours = Math.floor(time / 3600)
    var minutes = Math.floor((time - hours * 3600) / 60)
    var secs = Math.floor(time - hours * 3600 - minutes * 60)
    secs = secs < 10 ? '0' + secs : secs
    if (hours) {
      minutes = minutes < 10 ? '0' + minutes : minutes
      return hours + ':' + minutes + ':' + secs
    }
    return minutes + ':' + secs
  }

  // Side effect: initializes a single video player instance
  function initPlayer (container) {
    // DOM elements
    var video = container.querySelector('.video')
    var bigPlayButton = container.querySelector('.big-play-button')
    var controls = container.querySelector('.video-controls')
    var playPauseButton = container.querySelector('.play-pause')
    var iconPlay = container.querySelector('.icon-play')
    var iconPause = container.querySelector('.icon-pause')
    var speaker = container.querySelector('.speaker')
    var iconSpeaker = container.querySelector('.icon-speaker')
    var iconMuted = container.querySelector('.icon-muted')
    var ccButton = container.querySelector('.cc')
    var iconCcOff = ccButton ? container.querySelector('.icon-cc-off') : null
    var iconCcOn = ccButton ? container.querySelector('.icon-cc-on') : null
    var track = video.textTracks[0] || null
    var fullscreenButton = container.querySelector('.fullscreen')
    var iconFullscreen = container.querySelector('.icon-fullscreen')
    var iconExitFullscreen = container.querySelector('.icon-exit-fullscreen')
    var settingsWrapper = container.querySelector('.settings-wrapper')
    var settingsButton = container.querySelector('.settings')
    var speedOptions = container.querySelectorAll('.speed-option')
    var loadingIndicator = container.querySelector('.loading-indicator')
    var seekbar = container.querySelector('.seekbar')
    var bufferbar = container.querySelector('.bufferbar')
    var timebar = container.querySelector('.timebar')
    var thumb = container.querySelector('.thumb')
    var totalTime = container.querySelector('.total-time')
    var heading = container.querySelector('.video-heading')

    // Config from data attributes
    var src = video.dataset.src
    var sessionTitle = container.dataset.sessionTitle || ''
    var artist = container.dataset.artist || ''
    var artwork = []
    try {
      artwork = JSON.parse(container.dataset.artwork || '[]')
    } catch (e) {
      artwork = []
    }

    // State
    var mediaPlayerRunning = false
    var seeking = false
    var idleCount = 0

    // Load video source
    video.src = src
    if (video.readyState < 1) video.load()

    // Enable player (remove disabled state)
    container.classList.remove('disabled')

    // Start with captions off
    if (track) track.mode = 'hidden'


    /*
     * Total time display
     */

    updateTotalTime()
    video.addEventListener('durationchange', updateTotalTime)

    function updateTotalTime () {
      totalTime.textContent = formatTime(video.duration)
    }


    /*
     * Play/Pause
     */

    bigPlayButton.addEventListener('click', handlePlayPauseClick)
    playPauseButton.addEventListener('click', handlePlayPauseClick)
    video.addEventListener('click', handlePlayPauseClick)

    function handlePlayPauseClick (event) {
      event.stopPropagation()
      playPauseToggle()
    }

    function playPauseToggle () {
      if (!mediaPlayerRunning) runSystemMediaPlayer()
      if (video.paused) {
        playVideo()
      } else {
        pauseVideo()
      }
    }

    function playVideo () {
      video.play()
      iconPlay.classList.add('hidden')
      iconPause.classList.remove('hidden')
      bigPlayButton.classList.add('hidden')
      if (heading) heading.classList.add('hidden')
    }

    function pauseVideo () {
      video.pause()
      iconPlay.classList.remove('hidden')
      iconPause.classList.add('hidden')
      bigPlayButton.classList.remove('hidden')
      if (heading) heading.classList.remove('hidden')
    }

    video.addEventListener('ended', function () {
      iconPlay.classList.remove('hidden')
      iconPause.classList.add('hidden')
      bigPlayButton.classList.remove('hidden')
      if (heading) heading.classList.remove('hidden')
    })


    /*
     * Captions toggle
     */

    if (ccButton && track) {
      ccButton.addEventListener('click', ccToggle)
    }

    function ccToggle () {
      if (track.mode === 'hidden') {
        track.mode = 'showing'
        iconCcOff.classList.add('hidden')
        iconCcOn.classList.remove('hidden')
      } else {
        track.mode = 'hidden'
        iconCcOff.classList.remove('hidden')
        iconCcOn.classList.add('hidden')
      }
    }


    /*
     * Mute toggle
     */

    speaker.addEventListener('click', muteToggle)

    function muteToggle () {
      if (video.muted) {
        video.muted = false
        iconSpeaker.classList.remove('hidden')
        iconMuted.classList.add('hidden')
      } else {
        video.muted = true
        iconSpeaker.classList.add('hidden')
        iconMuted.classList.remove('hidden')
      }
    }


    /*
     * Fullscreen toggle
     */

    fullscreenButton.addEventListener('click', fullscreenToggle)

    function fullscreenToggle () {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(function () {
          // Fallback for iOS - fullscreen the video element itself
          if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen()
          }
        })
      } else {
        document.exitFullscreen()
      }
    }

    document.addEventListener('fullscreenchange', function () {
      if (document.fullscreenElement === container) {
        iconFullscreen.classList.add('hidden')
        iconExitFullscreen.classList.remove('hidden')
      } else {
        iconFullscreen.classList.remove('hidden')
        iconExitFullscreen.classList.add('hidden')
      }
    })


    /*
     * Seekbar, buffer, thumb updates
     */

    video.addEventListener('timeupdate', function () {
      updateThumbTime()
      moveTimebarAndThumb()
      moveBufferbar()
      hideOnIdle()
    })

    window.addEventListener('resize', function () {
      moveTimebarAndThumb()
      moveBufferbar()
    })

    function updateThumbTime () {
      thumb.textContent = formatTime(video.currentTime)
    }

    function moveTimebarAndThumb () {
      if (seeking) return
      var progress = video.currentTime / video.duration
      var width = seekbar.offsetWidth
      var position = progress * width
      timebar.style.width = position + 'px'
      thumb.style.left = position + 'px'
    }

    function moveBufferbar () {
      var buffered = video.buffered
      if (buffered.length === 0) return
      var end = buffered.end(buffered.length - 1)
      var percent = (end / video.duration) * 100
      bufferbar.style.width = percent + '%'
    }

    function hideOnIdle () {
      if (video.paused || seeking) {
        video.classList.remove('idle')
        idleCount = 0
        return
      }
      idleCount += 1
      if (idleCount > 12) {
        video.classList.add('idle')
        idleCount = 0
      }
    }

    // Mouse events on video wrapper area
    var videoWrapper = container.querySelector('.video-wrapper')
    videoWrapper.addEventListener('mousemove', function () {
      video.classList.remove('idle')
      idleCount = 0
    })


    /*
     * Seekbar click to seek
     */

    seekbar.addEventListener('click', function (event) {
      var rect = seekbar.getBoundingClientRect()
      var clickX = event.clientX - rect.left
      var percent = clickX / rect.width
      video.currentTime = percent * video.duration
    })


    /*
     * Thumb dragging
     */

    thumb.addEventListener('mousedown', initiateThumbDrag)
    thumb.addEventListener('touchstart', initiateThumbDrag)

    function initiateThumbDrag (event) {
      event.preventDefault()
      event.stopPropagation()
      seeking = true
      document.body.classList.add('dragging')

      var rect = seekbar.getBoundingClientRect()
      var duration = video.duration
      var wasMuted = video.muted
      var wasPaused = video.paused

      document.addEventListener('mousemove', onDrag)
      document.addEventListener('touchmove', onDrag)
      document.addEventListener('mouseup', endDrag)
      document.addEventListener('touchend', endDrag)

      function onDrag (e) {
        if (!wasMuted) video.muted = true
        if (!wasPaused) video.pause()

        var clientX = e.clientX || (e.touches && e.touches[0].clientX)
        var position = clientX - rect.left
        position = Math.max(0, Math.min(position, rect.width))

        thumb.style.left = position + 'px'
        timebar.style.width = position + 'px'

        var time = (position / rect.width) * duration
        thumb.textContent = formatTime(time)

        // Throttled seek using requestAnimationFrame
        requestAnimationFrame(function () {
          video.currentTime = time
        })
      }

      function endDrag (e) {
        document.removeEventListener('mousemove', onDrag)
        document.removeEventListener('touchmove', onDrag)
        document.removeEventListener('mouseup', endDrag)
        document.removeEventListener('touchend', endDrag)

        var clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX)
        var position = clientX - rect.left
        position = Math.max(0, Math.min(position, rect.width))
        var time = (position / rect.width) * duration

        video.currentTime = time
        seeking = false
        document.body.classList.remove('dragging')

        if (!wasMuted) video.muted = false
        if (!wasPaused) video.play()
      }
    }


    /*
     * Visual feedback for keyboard actions
     */

    function showNotification (message) {
      var existing = container.querySelector('.video-notification')
      if (existing) existing.remove()

      var notification = document.createElement('div')
      notification.className = 'video-notification'
      notification.textContent = message
      container.appendChild(notification)

      setTimeout(function () {
        notification.style.opacity = '0'
        setTimeout(function () {
          notification.remove()
        }, 300)
      }, 800)
    }


    /*
     * Keyboard controls
     */

    container.setAttribute('tabindex', '0')
    container.addEventListener('keydown', handleKeyboard)

    function handleKeyboard (event) {
      // Ignore if typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return

      var key = event.key.toLowerCase()
      var handled = true

      switch (key) {
        case ' ':
        case 'k':
          playPauseToggle()
          break
        case 'arrowleft':
          video.currentTime = Math.max(0, video.currentTime - 5)
          showNotification('−5s')
          break
        case 'arrowright':
          video.currentTime = Math.min(video.duration, video.currentTime + 5)
          showNotification('+5s')
          break
        case 'j':
          video.currentTime = Math.max(0, video.currentTime - 10)
          showNotification('−10s')
          break
        case 'l':
          video.currentTime = Math.min(video.duration, video.currentTime + 10)
          showNotification('+10s')
          break
        case 'm':
          muteToggle()
          showNotification(video.muted ? 'Muted' : 'Unmuted')
          break
        case 'f':
          fullscreenToggle()
          break
        case 'c':
        case 's':
        case 't':
          if (ccButton && track) {
            ccToggle()
            showNotification(track.mode === 'showing' ? 'CC On' : 'CC Off')
          }
          break
        case ',':
          video.playbackRate = Math.max(0.25, video.playbackRate - 0.25)
          showNotification(video.playbackRate + 'x')
          updateSpeedButtons()
          break
        case '.':
          video.playbackRate = Math.min(4, video.playbackRate + 0.25)
          showNotification(video.playbackRate + 'x')
          updateSpeedButtons()
          break
        case '0':
          video.playbackRate = 1
          showNotification('1x')
          updateSpeedButtons()
          break
        default:
          handled = false
      }

      if (handled) {
        event.preventDefault()
        event.stopPropagation()
      }
    }


    /*
     * Video end / restart
     */

    video.addEventListener('ended', startOver)
    video.addEventListener('seeked', function () {
      if (video.currentTime === 0) startOver()
    })

    function startOver () {
      video.currentTime = 0
      setTimeout(function () {
        moveBufferbar()
        moveTimebarAndThumb()
        updateThumbTime()
      }, 100)
    }


    /*
     * Settings panel toggle
     */

    settingsButton.addEventListener('click', function (event) {
      event.stopPropagation()
      settingsWrapper.classList.toggle('open')
    })

    // Close settings when clicking outside
    document.addEventListener('click', function (event) {
      if (!settingsWrapper.contains(event.target)) {
        settingsWrapper.classList.remove('open')
      }
    })


    /*
     * Speed selection
     */

    speedOptions.forEach(function (option) {
      option.addEventListener('click', function () {
        var speed = parseFloat(option.dataset.speed)
        video.playbackRate = speed

        // Update active state
        speedOptions.forEach(function (opt) {
          opt.classList.remove('active')
        })
        option.classList.add('active')

        showNotification(speed + 'x')
        settingsWrapper.classList.remove('open')
      })
    })

    // Update speed buttons when changed via keyboard
    function updateSpeedButtons () {
      var currentSpeed = video.playbackRate
      speedOptions.forEach(function (opt) {
        var optSpeed = parseFloat(opt.dataset.speed)
        if (optSpeed === currentSpeed) {
          opt.classList.add('active')
        } else {
          opt.classList.remove('active')
        }
      })
    }


    /*
     * Double-tap to seek on mobile
     */

    var lastTap = 0
    var tapTimeout = null

    videoWrapper.addEventListener('touchend', function (event) {
      // Ignore if touching controls
      if (event.target.closest('.video-controls')) return

      var currentTime = Date.now()
      var tapLength = currentTime - lastTap

      if (tapLength < 300 && tapLength > 0) {
        // Double tap detected
        clearTimeout(tapTimeout)
        event.preventDefault()

        var rect = videoWrapper.getBoundingClientRect()
        var tapX = event.changedTouches[0].clientX - rect.left
        var halfWidth = rect.width / 2

        if (tapX < halfWidth) {
          // Left side - rewind 10s
          video.currentTime = Math.max(0, video.currentTime - 10)
          showNotification('−10s')
        } else {
          // Right side - forward 10s
          video.currentTime = Math.min(video.duration, video.currentTime + 10)
          showNotification('+10s')
        }
      } else {
        // Single tap - wait to see if it becomes double tap
        tapTimeout = setTimeout(function () {
          // Single tap action (play/pause) handled by existing click handler
        }, 300)
      }

      lastTap = currentTime
    })


    /*
     * Media Session API for OS-level controls
     */

    function runSystemMediaPlayer () {
      mediaPlayerRunning = true
      if (!('mediaSession' in navigator)) return

      navigator.mediaSession.metadata = new MediaMetadata({
        title: sessionTitle || document.title,
        artist: artist,
        album: '',
        artwork: artwork
      })

      navigator.mediaSession.setActionHandler('play', playVideo)
      navigator.mediaSession.setActionHandler('pause', pauseVideo)
      navigator.mediaSession.setActionHandler('seekbackward', function () {
        video.currentTime = Math.max(0, video.currentTime - 10)
        updateThumbTime()
        moveTimebarAndThumb()
      })
      navigator.mediaSession.setActionHandler('seekforward', function () {
        video.currentTime = Math.min(video.duration, video.currentTime + 10)
        updateThumbTime()
        moveTimebarAndThumb()
      })
    }
  }
})()
