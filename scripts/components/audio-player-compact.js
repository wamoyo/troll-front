// Compact Audio Player - Client-side functionality
// Simplified playback controls without settings or mute

;(function () {
  "use strict"

  // Initialize all compact audio players on the page
  document.querySelectorAll('.cp-audio-player-compact').forEach(initPlayer)

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

  // Side effect: initializes a single compact audio player instance
  function initPlayer (container) {
    // DOM elements
    var audio = container.querySelector('.audio')
    var playPauseButton = container.querySelector('.play-pause')
    var iconPlay = container.querySelector('.icon-play')
    var iconPause = container.querySelector('.icon-pause')
    var skipBackButton = container.querySelector('.skip-back')
    var skipForwardButton = container.querySelector('.skip-forward')
    var seekbar = container.querySelector('.seekbar')
    var bufferbar = container.querySelector('.bufferbar')
    var timebar = container.querySelector('.timebar')
    var currentTimeEl = container.querySelector('.current-time')
    var totalTimeEl = container.querySelector('.total-time')

    // Config from data attributes
    var src = audio.dataset.src

    // Load audio source
    audio.src = src
    if (audio.readyState < 1) audio.load()

    // Enable player (remove disabled state)
    container.classList.remove('disabled')


    /*
     * Time display updates
     */

    updateTotalTime()
    audio.addEventListener('durationchange', updateTotalTime)

    function updateTotalTime () {
      totalTimeEl.textContent = formatTime(audio.duration)
    }

    function updateCurrentTime () {
      currentTimeEl.textContent = formatTime(audio.currentTime)
    }


    /*
     * Play/Pause
     */

    playPauseButton.addEventListener('click', playPauseToggle)

    function playPauseToggle () {
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

    skipBackButton.addEventListener('click', function () {
      audio.currentTime = Math.max(0, audio.currentTime - 15)
    })

    skipForwardButton.addEventListener('click', function () {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 15)
    })


    /*
     * Seekbar and timebar updates
     */

    audio.addEventListener('timeupdate', function () {
      updateCurrentTime()
      moveTimebar()
      moveBufferbar()
    })

    window.addEventListener('resize', function () {
      moveTimebar()
      moveBufferbar()
    })

    function moveTimebar () {
      var progress = audio.currentTime / audio.duration
      var percent = progress * 100
      timebar.style.width = percent + '%'
    }

    function moveBufferbar () {
      var buffered = audio.buffered
      if (buffered.length === 0) return
      var end = buffered.end(buffered.length - 1)
      var percent = (end / audio.duration) * 100
      bufferbar.style.width = percent + '%'
    }


    /*
     * Seekbar click to seek
     */

    seekbar.addEventListener('click', handleSeekbarClick)

    function handleSeekbarClick (event) {
      var rect = seekbar.getBoundingClientRect()
      var clickX = event.clientX - rect.left
      var percent = clickX / rect.width
      var time = percent * audio.duration
      audio.currentTime = time
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
        moveTimebar()
        updateCurrentTime()
      }, 100)
    }
  }
})()
