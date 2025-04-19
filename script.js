const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

let bubbles = [];

class Bubble {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 60;
    this.y = y + (Math.random() - 0.5) * 60;
    this.radius = Math.random() * 8 + 3;
    this.alpha = 1;
    this.speedY = Math.random() * -0.5 - 0.3;
    this.speedX = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fill with orange
  ctx.fillStyle = "orange";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Transparent reveal circle
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 375, 0, Math.PI * 2); // Increased radius
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  // Add and draw bubbles
  bubbles.push(new Bubble(mouse.x, mouse.y));
  bubbles = bubbles.filter((b) => b.alpha > 0);
  bubbles.forEach((b) => {
    b.update();
    b.draw();
  });

  requestAnimationFrame(draw);
}
draw();
