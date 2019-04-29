const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fSButton = player.querySelector('.fullscreen');

function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
    // Is equal to:
    // if(video.paused){
    //     video.play();
    // } else video.pause();
}

function updateButton(){
    const icon = this.paused? '►' : '❚ ❚';
    toggle.textContent = icon
    console.log('update button')
}

function skip(){
    console.log(this.dataset.skip)
    video.currentTime += parseFloat(this.dataset.skip)
}

function handleRangeUpdate(){
    console.log(this.name)
    console.log(this.value)
    video[this.name] = this.value
}

function handleProgress(){
    const percent = (video.currentTime/video.duration)*100
    progressBar.style.flexBasis = `${percent}%`
}

function scrub(e){
    console.log(e)
    const time = (e.offsetX / progress.offsetWidth) * video.duration
    video.currentTime = time
}

function toggleFullScreen() {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) { /* Firefox */
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { /* IE/Edge */
      video.msRequestFullscreen();
    }
  } 

video.addEventListener('click', togglePlay)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)
video.addEventListener('timeupdate', handleProgress)
toggle.addEventListener('click', togglePlay)

skipButtons.forEach(button=> button.addEventListener('click', skip))
ranges.forEach(range=>range.addEventListener('change', handleRangeUpdate))
ranges.forEach(range=>range.addEventListener('mousemove', handleRangeUpdate))

let mouseDown = false
progress.addEventListener('click', scrub)
progress.addEventListener('mousemove', (e)=>mouseDown && scrub(e))
progress.addEventListener('mousedown', ()=> mouseDown = true)
progress.addEventListener('mouseup', ()=> mouseDown = false)

fSButton.addEventListener('click', toggleFullScreen)