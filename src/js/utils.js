function createImage(imageSrc, className, id) {
  const image = new Image()
  if(className){
  image.setAttribute('class',className)
  image.setAttribute('id',id)
}
  image.src = imageSrc
  return image
}
function showSlide(id){
  if (document.getElementById(`slide${id}`).classList.contains('visible')){
  document.getElementById('slides').classList.remove('darkbackground');

      document.querySelectorAll(".slide").forEach(slide=>{
        slide.classList.remove('visible');
      });
      } 
      else{
        document.getElementById('slides').classList.add('darkbackground');
        document.getElementById(`slide${id}`).classList.add('visible');
      }
}
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

function playAudio(src, loop=false){
  myAudio = new Audio(src); 
  if (loop){
    if (typeof myAudio.loop == 'boolean')
    {
        myAudio.loop = true;
    }
    else
    {
        myAudio.addEventListener('ended', function() {
          alert('done')
            this.currentTime = 0;
            this.play();
        }, false);
    }
  }
      return myAudio;
}
function fullscreen(canvas) {
  if (document.fullscreenElement) {
    document.exitFullscreen()
      .then(() => console.log("Document Exited from Full screen mode"))
      .catch((err) => console.error(err))
  } else {
    canvas.requestFullscreen();
  }
}
module.exports = { randomIntFromRange, randomColor, distance, createImage, playAudio, fullscreen ,showSlide}
