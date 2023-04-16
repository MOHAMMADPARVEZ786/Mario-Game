import platform from "../img/platform.png";
import hills from "../img/hills.png";
import star from '../img/star.png';
import background from "../img/background.png";
import rocket from '../img/rocket.png'
import { Platform, Player, GenericObject, Star} from "./main";
import { createImage, fullscreen, playAudio,randomIntFromRange, showSlide } from "./utils";

import slides1 from '../img/slides1.png';
import slides2 from '../img/slides2.png';
import slides3 from '../img/slides3.png';
import slides4 from '../img/slides4.png';
import slides5 from '../img/slides5.png';
import slides6 from '../img/slides6.png';

let slides = document.querySelector('#slides');
slides.append(createImage(slides1,'slide',"slide1"));
slides.append(createImage(slides2,'slide',"slide2"));
slides.append(createImage(slides3,'slide',"slide3"));
slides.append(createImage(slides4,'slide',"slide4"));
slides.append(createImage(slides5,'slide',"slide5"));
slides.append(createImage(slides6,'slide',"slide6"));

import audio from '../img/audio.mp3'
import jump from '../img/jump.mp3'
import collect from '../img/collect.mp3'

import confetti from 'canvas-confetti';

const canvas = document.querySelector("canvas");
const con = document.querySelector('#con');
const c = canvas.getContext("2d");





let Slides = 0;
canvas.width = 1024;
canvas.height = 570;
con.width = 1024;
con.height = 570;
let maxSlides = 6;
let music = playAudio(audio, true);
let platformImage;
let starImage;
let jumpAudio, collectAudio;
let player = null;
let platforms = [];
let stars = [];
let genericObjects = [];
let rocketobj;
let lastKey;

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function init() {
  platformImage = createImage(platform);
  starImage = createImage(star);
  jumpAudio = new Audio(jump);
  collectAudio = new Audio(collect);
  player = new Player(canvas);
platforms = [];
platforms.push(new Platform({ x: -1, y: 470, image: platformImage, canvas }))
    let o=0;
  for(let i=0;i<5;i++){
      o+=100;
      platforms.push(
      new Platform({
        x:  700+ (platformImage.width+300) *i    - 2,
        y: 470-Math.random()*100,
        image: platformImage,
        canvas,
      }))
  }
    stars = platforms.map((platform,idx)=>new Star({id:idx,x:randomIntFromRange(platform.position.x,platform.position.x+platform.width), y:platform.position.y-100,image:starImage,canvas}));
  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background),
      canvas,
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills),
      canvas,
    })
  ];
  rocketobj = new GenericObject({
    x:platforms.at(-1).position.x+platforms[0].width/2,
    y:platforms.at(-1).position.y-500,
    image:createImage(rocket),
    canvas
  })
  //headstart
  platforms.forEach(platform=>{
    // scrollOffset += 14640;
     platform.position.x += 0;
  })
  console.log(platforms)
  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  stars.forEach(star=>{

      star.draw();
  })
  rocketobj.draw()
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed && scrollOffset <6000 ) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      stars.forEach(star=>{
          star.position.x -= player.speed;
      })
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
      rocketobj.position.x-=player.speed;

    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      stars.forEach(star=>{
        star.position.x += player.speed;
      })

      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
      rocketobj.position.x+=player.speed;
    }
  }

  // console.log(scrollOffset);
  // star collision detection
  stars.forEach(star=>{
    if(
      player.position.x < star.position.x + star.width &&
        player.position.x + player.width > star.position.x &&
        player.position.y < star.position.y + star.height &&
        player.height + player.position.y > star.position.y
    ){
      Slides = star.id+1;
      if(!collectAudio.paused){
        collectAudio.pause();
        collectAudio.currentTime = 0;
      }
      collectAudio.play();

    }
  })

  // platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
      console.log(platforms.indexOf(platform))
    }
  });
  // sprite switching
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // win condition
  if(Slides/maxSlides == 1){
    window.dispatchEvent(new CustomEvent('conf'));
    c.font = "100px Arial";
    c.fillText('finalSlide',canvas.width/3,canvas.height/2);
  }
  
  // lose condition
  if (player.position.y > canvas.height) {
    init();
  }
  //stats
  c.rect(10,10,100,10);
  c.stroke();
  c.fillRect(10,10,(Slides/maxSlides)*100,10);
  c.font = "20px Arial";
  c.fillText(`Slide: ${Slides}`,10,50)

}

addEventListener('conf',()=>{
  
    var myConfetti = confetti.create(con, {
      resize: true,
      useWorker: true
    });
    myConfetti({
      particleCount: 100,
      spread: 160
      // any other options from the global
      // confetti function
    });
   
    setTimeout(() => {
      myConfetti.reset();
    }, 1000);
}, {once:true});
document.querySelector('button').addEventListener('click',()=>{
    let div = document.querySelector('.start');
      console.log('hi',div)
    div.classList.add('invisible')
    fullscreen(document.getElementById('fullscreen'))
    // music.play()
    init();
});
init();
animate();

addEventListener("keydown", ({ key }) => {

  switch (key) {
    case 'a':
    case 'ArrowLeft':
      console.log("left");
      keys.left.pressed = true;
      lastKey = "left";
      break;

    case 's':
    case 'ArrowDown':
      console.log("down");
      break;

    case 'd':
    case 'ArrowRight':
      console.log("right");
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case 'w':
    case 'ArrowUp':
      console.log("up");
      if(player.velocity.y==0){
      player.velocity.y -= 25;
      // laserate(244)
      if(!jumpAudio.paused){
            jumpAudio.pause();
            jumpAudio.currentTime = 0;
      }
    jumpAudio.play();
    }
      break;
    case 'f':
     fullscreen(document.getElementById('fullscreen'));
      break;
    case 'm':
      if(!music.paused){
        music.pause();
        music.currentTime = 0;
      }else{
        music.play();
      }
    break;
    case ' ':
      console.log(Slides)
      showSlide(Slides);
      break;
  }

  console.log(keys.right.pressed);
});

addEventListener("keyup", ({ key }) => {
  // console.log(keyCode)
  switch (key) {
    case 'a':
    case 'ArrowLeft':
      console.log("left");
      keys.left.pressed = false;
      break;

    case 's':
    case 'ArrowDown':
      console.log("down");
      break;

    case 'd':
    case 'ArrowRight':
      console.log("right");
      keys.right.pressed = false;

      break;
    case 'w':
    case 'ArrowUp':
      console.log("up");

      break;
  }

  console.log(keys.right.pressed);
});
