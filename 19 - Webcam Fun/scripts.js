const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream)
            video.srcObject = localMediaStream;
            video.play()
        })
        .catch(err=>{
            console.error('Video Not Allowed', err)
        })
}

function paintToCanvas(){
    // const height = video.videoWidth
    // const width = video.videoWidth
    const {videoHeight: height, videoWidth: width} = video
    console.log(height, width)
    canvas.width = width
    canvas.height = height

    // return setInterval(()=>{
    //     ctx.drawImage(video, 0, 0, width, height)
    //     let pixels = ctx.getImageData(0, 0, width, height)
    //     pixels = redEffect(pixels)
    //     ctx.putImageData(pixels, 0, 0)
    // }, 15)

    const animate = () => {
        request = requestAnimationFrame(animate)
        ctx.drawImage(video, 0, 0, width, height)
        let pixels = ctx.getImageData(0, 0, width, height)
        // image data consists of an array like:
        // red: 
        // green:
        // blue:
        // alpha:
        // ...repeat...
        //pixels = redEffect(pixels)
        pixels = greenScreen(pixels)
        ctx.globalAlpha = 2;
        ctx.putImageData(pixels, 0, 0);
    }

    animate()
}

function takePhoto(){
    snap.currentTime = 0
    snap.play()

    const pic = canvas.toDataURL('image/jpeg')
    
    const link = document.createElement('a')
    link.href = pic
    link.setAttribute ('download', 'My Photo')
    link.textContent = 'Download Image'
    link.innerHTML = `<img src=${pic} alt="Photo Instance" >`
    strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels){
    for (let i = 0; i < pixels.data.length; i+=4 ){
        pixels.data[i + 0] += 200; // RED
        pixels.data[i + 1] -= 50; // GREEN
        pixels.data[i + 2] *= 0.5; // Blue
    }
    return pixels
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
}

getVideo()

video.addEventListener('canplay', paintToCanvas)