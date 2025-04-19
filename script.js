const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let lastMouse = { x: mouse.x, y: mouse.y };
let velocity = { x: 0, y: 0 };
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

// Blob setup
const numPoints = 32;
const radius = 375;
const tension = 0.04;
const drag = 0.3;

let points = [];

for (let i = 0; i < numPoints; i++) {
  const angle = (i / numPoints) * 2 * Math.PI;
  points.push({
    angle: angle,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    vx: 0,
    vy: 0,
  });
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function updateBlob() {
  velocity.x = mouse.x - lastMouse.x;
  velocity.y = mouse.y - lastMouse.y;
  lastMouse.x = mouse.x;
  lastMouse.y = mouse.y;

  const mag = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
  const normVel = {
    x: mag > 0 ? velocity.x / mag : 0,
    y: mag > 0 ? velocity.y / mag : 0,
  };

  for (let p of points) {
    const targetX = Math.cos(p.angle) * radius;
    const targetY = Math.sin(p.angle) * radius;

    const normal = { x: -Math.sin(p.angle), y: Math.cos(p.angle) };
    const influence = normal.x * normVel.x + normal.y * normVel.y;
    const offset = influence * mag * 0.7;

    p.vx += (targetX - p.x) * tension;
    p.vy += (targetY - p.y) * tension;

    p.vx += normVel.x * offset * drag;
    p.vy += normVel.y * offset * drag;

    p.vx *= 0.92;
    p.vy *= 0.92;

    p.x += p.vx;
    p.y += p.vy;
  }
}

function drawBlob() {
  ctx.save();
  ctx.translate(mouse.x, mouse.y);
  ctx.globalCompositeOperation = "destination-out";

  ctx.beginPath();
  for (let i = 0; i < numPoints; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % numPoints];
    const cpX = (p1.x + p2.x) / 2;
    const cpY = (p1.y + p2.y) / 2;
    if (i === 0) {
      ctx.moveTo(cpX, cpY);
    } else {
      ctx.quadraticCurveTo(p1.x, p1.y, cpX, cpY);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
}

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Green cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube for effect
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render the 3D scene
  renderer.render(scene, camera);
}

// Start the Three.js animation
animate();

// Main draw loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Orange fill for 2D content
  ctx.fillStyle = "orange";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw 2D blob
  updateBlob();
  drawBlob();

  // Draw 2D bubbles
  bubbles.push(new Bubble(mouse.x, mouse.y));
  bubbles = bubbles.filter((b) => b.alpha > 0);
  bubbles.forEach((b) => {
    b.update();
    b.draw();
  });

  requestAnimationFrame(draw);
}

draw();
