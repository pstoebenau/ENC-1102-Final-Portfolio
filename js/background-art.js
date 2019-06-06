const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("resize", resizeCanvas);

let stars = [];

const fps = 60;
const frameRate = 1000/fps;
let past = Date.now();
let elapsed = 0;

function initialize() {
  resizeCanvas();
  setFrameRate();
}

function resizeCanvas() {
  const aspectRatio = canvas.parentElement.clientWidth/canvas.parentElement.clientHeight;

  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  //canvas.style.width = `${canvas.parentElement.clientWidth}px`;
  //canvas.style.height = `${canvas.parentElement.clientHeight}px`;
}

// Call update function at constant framerate
function setFrameRate() {
  // Game loop
  requestAnimationFrame(setFrameRate);

  elapsed = Date.now() - past;

  if(elapsed >= frameRate){
    past = Date.now() - (elapsed%frameRate);

    if(typeof update === "function")
      update();
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let randNum = Math.random();

  if(randNum < .2)
    stars.push(new Star());

  for (let i = stars.length-1; i >= 0; i--) {
    stars[i].update();

    if(!stars[i].isAlive)
      stars.splice(i, 1);
  }
}

class Vertex {
  position;
  size;
  
}

class Star {
  position;
  size;
  alpha = -1;
  isAlive = true;

  constructor() {
    this.position = {
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
    }

    this.size = Math.random()*1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 1 - Math.abs(this.alpha);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();

    this.alpha += 0.003;
    if(this.alpha >= 1)
      this.isAlive = false;
  }
}

initialize();
