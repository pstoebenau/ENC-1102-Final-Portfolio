const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("resize", resizeCanvas);

let vertices = [];

const fps = 30;
const frameRate = 1000/fps;
let past = Date.now();
let elapsed = 0;

function initialize() {
  resizeCanvas();
  setFrameRate();
  for (let i = 0; i < 150; i++) {
    vertices.push(new Vertex(3));
  }
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
    else
      console.error("Please define an update function");
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < vertices.length; i++) {
    vertices[i].update(vertices);
  }
}

class Vertex {
  position;
  velocity;
  size;
  neighbors = [];

  constructor(size)
  {
    this.position = {
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
    };
    this.velocity = {
      x: Math.random()*3-1.5,
      y: Math.random()*3-1.5,
    };
    this.size = size;
  }

  updateNeighbors(vertices)
  {
    for (let i = 0; i < vertices.length; i++) {
      if(this.distance(vertices[i]) < 100)
        this.neighbors[i] = vertices[i];
      else
        this.neighbors[i] = null;
    }
  }

  distance(vertex){
    let sum = Math.pow(this.position.x-vertex.position.x, 2);
    sum += Math.pow(this.position.y-vertex.position.y, 2);;
    return Math.sqrt(sum);
  }

  draw()
  {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    for (var i = 0; i < this.neighbors.length; i++) {
      if(!this.neighbors[i])
        continue;

      let a = this.position;
      let b = this.neighbors[i].position;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.closePath();
    }
  }

  update(vertices)
  {
    this.updateNeighbors(vertices);
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if(this.position.x < 0 || this.position.x > canvas.width)
      this.velocity.x *= -1;

    if(this.position.y < 0 || this.position.y > canvas.height)
      this.velocity.y *= -1;
  }
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
