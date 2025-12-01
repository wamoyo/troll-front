// Audio Player - Client-side functionality
// Handles playback, seeking, keyboard controls, and Media Session API

;(function () {
  "use strict"

  // Initialize all audio players on the page
  document.querySelectorAll('.cp-audio-player').forEach(initPlayer)

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

  // Side effect: initializes a single audio player instance
  function initPlayer (container) {
    // DOM elements
    var audio = container.querySelector('.audio')
    var playPauseButton = container.querySelector('.play-pause')
    var iconPlay = container.querySelector('.icon-play')
    var iconPause = container.querySelector('.icon-pause')
    var skipBackButton = container.querySelector('.skip-back')
    var skipForwardButton = container.querySelector('.skip-forward')
    var speaker = container.querySelector('.speaker')
    var iconSpeaker = container.querySelector('.icon-speaker')
    var iconMuted = container.querySelector('.icon-muted')
    var settingsWrapper = container.querySelector('.settings-wrapper')
    var settingsButton = container.querySelector('.settings')
    var speedOptions = container.querySelectorAll('.speed-option')
    var seekbar = container.querySelector('.seekbar')
    var bufferbar = container.querySelector('.bufferbar')
    var timebar = container.querySelector('.timebar')
    var thumb = container.querySelector('.thumb')
    var totalTime = container.querySelector('.total-time')

    // Config from data attributes
    var src = audio.dataset.src
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

    // Load audio source
    audio.src = src
    if (audio.readyState < 1) audio.load()

    // Enable player (remove disabled state)
    container.classList.remove('disabled')


    /*
     * Total time display
     */

    updateTotalTime()
    audio.addEventListener('durationchange', updateTotalTime)

    function updateTotalTime () {
      totalTime.textContent = formatTime(audio.duration)
    }


    /*
     * Play/Pause
     */

    playPauseButton.addEventListener('click', handlePlayPauseClick)

    function handlePlayPauseClick (event) {
      event.stopPropagation()
      playPauseToggle()
    }

    function playPauseToggle () {
      if (!mediaPlayerRunning) runSystemMediaPlayer()
      if (audio.paused) {
        playAudio()
      } else {
        pauseAudio()
      }
    }

    function playAudio () {
      audio.play()
      iconPlay.classList.add('hidden')
      iconPause.classList.remove('hidden')
    }

    function pauseAudio () {
      audio.pause()
      iconPlay.classList.remove('hidden')
      iconPause.classList.add('hidden')
    }

    audio.addEventListener('ended', function () {
      iconPlay.classList.remove('hidden')
      iconPause.classList.add('hidden')
    })


    /*
     * Skip buttons
     */

    if (skipBackButton) {
      skipBackButton.addEventListener('click', function () {
        audio.currentTime = Math.max(0, audio.currentTime - 15)
        showNotification('−15s')
      })
    }

    if (skipForwardButton) {
      skipForwardButton.addEventListener('click', function () {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 15)
        showNotification('+15s')
      })
    }


    /*
     * Mute toggle
     */

    speaker.addEventListener('click', muteToggle)

    function muteToggle () {
      if (audio.muted) {
        audio.muted = false
        iconSpeaker.classList.remove('hidden')
        iconMuted.classList.add('hidden')
      } else {
        audio.muted = true
        iconSpeaker.classList.add('hidden')
        iconMuted.classList.remove('hidden')
      }
    }


    /*
     * Seekbar, buffer, thumb updates
     */

    audio.addEventListener('timeupdate', function () {
      updateThumbTime()
      moveTimebarAndThumb()
      moveBufferbar()
    })

    window.addEventListener('resize', function () {
      moveTimebarAndThumb()
      moveBufferbar()
    })

    function updateThumbTime () {
      thumb.textContent = formatTime(audio.currentTime)
    }

    function moveTimebarAndThumb () {
      if (seeking) return
      var progress = audio.currentTime / audio.duration
      var width = seekbar.offsetWidth
      var position = progress * width
      timebar.style.width = position + 'px'
      thumb.style.left = position + 'px'
    }

    function moveBufferbar () {
      var buffered = audio.buffered
      if (buffered.length === 0) return
      var end = buffered.end(buffered.length - 1)
      var percent = (end / audio.duration) * 100
      bufferbar.style.width = percent + '%'
    }


    /*
     * Seekbar mousedown to seek + drag
     */

    seekbar.addEventListener('mousedown', handleSeekbarDown)
    seekbar.addEventListener('touchstart', handleSeekbarDown)

    function handleSeekbarDown (event) {
      // Ignore if clicking on thumb (it has its own handler)
      if (event.target === thumb) return
      // Ignore right-click
      if (event.button && event.button !== 0) return
      // Prevent scrolling on touch
      if (event.type === 'touchstart') event.preventDefault()

      // Jump thumb to click/touch position and start drag
      var rect = seekbar.getBoundingClientRect()
      var clientX = event.clientX || (event.touches && event.touches[0].clientX)
      var clickX = clientX - rect.left

      var percent = clickX / rect.width
      var time = percent * audio.duration

      // Update thumb position immediately
      thumb.style.left = clickX + 'px'
      timebar.style.width = clickX + 'px'
      thumb.textContent = formatTime(time)
      audio.currentTime = time

      // Trigger drag mode
      initiateThumbDrag(event)
    }


    /*
     * Thumb dragging
     */

    thumb.addEventListener('mousedown', initiateThumbDrag)
    thumb.addEventListener('touchstart', initiateThumbDrag)

    function initiateThumbDrag (event) {
      // Ignore right-click
      if (event.button && event.button !== 0) return

      event.preventDefault()
      event.stopPropagation()
      seeking = true
      document.body.classList.add('dragging')

      var rect = seekbar.getBoundingClientRect()
      var duration = audio.duration
      var wasMuted = audio.muted
      var wasPaused = audio.paused

      document.addEventListener('mousemove', onDrag)
      document.addEventListener('touchmove', onDrag)
      document.addEventListener('mouseup', endDrag)
      document.addEventListener('touchend', endDrag)

      function onDrag (e) {
        if (!wasMuted) audio.muted = true
        if (!wasPaused) audio.pause()

        var clientX = e.clientX || (e.touches && e.touches[0].clientX)
        var position = clientX - rect.left
        position = Math.max(0, Math.min(position, rect.width))

        thumb.style.left = position + 'px'
        timebar.style.width = position + 'px'

        var time = (position / rect.width) * duration
        thumb.textContent = formatTime(time)

        requestAnimationFrame(function () {
          audio.currentTime = time
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

        audio.currentTime = time
        seeking = false
        document.body.classList.remove('dragging')

        if (!wasMuted) audio.muted = false
        if (!wasPaused) audio.play()
      }
    }


    /*
     * Visual feedback for actions
     */

    function showNotification (message) {
      var existing = container.querySelector('.audio-notification')
      if (existing) existing.remove()

      var notification = document.createElement('div')
      notification.className = 'audio-notification'
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
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return

      var key = event.key.toLowerCase()
      var handled = true

      switch (key) {
        case ' ':
        case 'k':
          playPauseToggle()
          break
        case 'arrowleft':
          audio.currentTime = Math.max(0, audio.currentTime - 5)
          showNotification('−5s')
          break
        case 'arrowright':
          audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
          showNotification('+5s')
          break
        case 'j':
          audio.currentTime = Math.max(0, audio.currentTime - 15)
          showNotification('−15s')
          break
        case 'l':
          audio.currentTime = Math.min(audio.duration, audio.currentTime + 15)
          showNotification('+15s')
          break
        case 'm':
          muteToggle()
          showNotification(audio.muted ? 'Muted' : 'Unmuted')
          break
        case ',':
          audio.playbackRate = Math.max(0.25, audio.playbackRate - 0.25)
          showNotification(audio.playbackRate + 'x')
          updateSpeedButtons()
          break
        case '.':
          audio.playbackRate = Math.min(4, audio.playbackRate + 0.25)
          showNotification(audio.playbackRate + 'x')
          updateSpeedButtons()
          break
        case '0':
          audio.playbackRate = 1
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
     * Audio end / restart
     */

    audio.addEventListener('ended', startOver)
    audio.addEventListener('seeked', function () {
      if (audio.currentTime === 0) startOver()
    })

    function startOver () {
      audio.currentTime = 0
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
        audio.playbackRate = speed

        speedOptions.forEach(function (opt) {
          opt.classList.remove('active')
        })
        option.classList.add('active')

        showNotification(speed + 'x')
        settingsWrapper.classList.remove('open')
      })
    })

    function updateSpeedButtons () {
      var currentSpeed = audio.playbackRate
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

      navigator.mediaSession.setActionHandler('play', playAudio)
      navigator.mediaSession.setActionHandler('pause', pauseAudio)
      navigator.mediaSession.setActionHandler('seekbackward', function () {
        audio.currentTime = Math.max(0, audio.currentTime - 15)
        updateThumbTime()
        moveTimebarAndThumb()
      })
      navigator.mediaSession.setActionHandler('seekforward', function () {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 15)
        updateThumbTime()
        moveTimebarAndThumb()
      })
    }
  }
})()
