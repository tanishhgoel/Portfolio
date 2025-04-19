// ===================
// Canvas Setup
// ===================
const backgroundCanvas = document.getElementById("background-canvas");
const overlayCanvas = document.getElementById("overlay");
const ctx = overlayCanvas.getContext("2d");

function resizeCanvas() {
  backgroundCanvas.width = window.innerWidth;
  backgroundCanvas.height = window.innerHeight;
  overlayCanvas.width = window.innerWidth;
  overlayCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===================
// Mouse Tracking
// ===================
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let lastMouse = { x: mouse.x, y: mouse.y };
let velocity = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// ===================
// Blob Setup
// ===================
const numPoints = 32;
const radius = 375;
const tension = 0.04;
const drag = 0.3;

let points = [];
for (let i = 0; i < numPoints; i++) {
  const angle = (i / numPoints) * 2 * Math.PI;
  points.push({
    angle,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    vx: 0,
    vy: 0,
  });
}

function updateBlob() {
  velocity.x = mouse.x - lastMouse.x;
  velocity.y = mouse.y - lastMouse.y;
  lastMouse.x = mouse.x;
  lastMouse.y = mouse.y;

  const mag = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
  const normVel =
    mag > 0 ? { x: velocity.x / mag, y: velocity.y / mag } : { x: 0, y: 0 };

  for (let p of points) {
    const targetX = Math.cos(p.angle) * radius;
    const targetY = Math.sin(p.angle) * radius;

    const normal = { x: -Math.sin(p.angle), y: Math.cos(p.angle) };
    const influence = normal.x * normVel.x + normal.y * normVel.y;
    const offset = influence * mag * 0.7;

    p.vx += (targetX - p.x) * tension + normVel.x * offset * drag;
    p.vy += (targetY - p.y) * tension + normVel.y * offset * drag;

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
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
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

// ===================
// Orange Overlay + Blob Reveal
// ===================
function drawOverlay() {
  // Draw full orange layer
  const gradient = ctx.createRadialGradient(
    mouse.x,
    mouse.y,
    100,
    mouse.x,
    mouse.y,
    overlayCanvas.width * 0.8
  );
  gradient.addColorStop(0, "#ffa500");
  gradient.addColorStop(1, "#ffa500");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
}

// ===================
// Draw Loop
// ===================
function draw() {
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  drawOverlay();
  updateBlob();
  drawBlob();
  requestAnimationFrame(draw);
}
draw();

// ===================
// 3D Setup (Three.js)
// ===================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({
  canvas: backgroundCanvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting
// White hemisphere light with softer intensity
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
scene.add(hemiLight);

// White directional light with reduced intensity
const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
dirLight.position.set(100, 100, 100);
scene.add(dirLight);

// White point light, subtle glow
const pointLight = new THREE.PointLight(0xffffff, 0.8, 200);
pointLight.position.set(0, 0, 50);
scene.add(pointLight);

const bottomRightLight = new THREE.PointLight(0xffa500, 2, 500);
bottomRightLight.position.set(150, -150, 100);
scene.add(bottomRightLight);

const bottomLeftLight = new THREE.PointLight(0xffa500, 2, 500);
bottomLeftLight.position.set(-150, -150, 100);
scene.add(bottomLeftLight);

hemiLight.intensity = 0.8;
dirLight.intensity = 0.5;
pointLight.intensity = 1.0;

// Spheres
const spheres = [];
const group = new THREE.Group();
scene.add(group);

const sphereGeometry = new THREE.SphereGeometry(10, 32, 32);

const sphereMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    color: { value: new THREE.Color(0xffa500) }, // orange tint
    fresnelPower: { value: 2.5 },
  },
  vertexShader: `
    varying float vFresnel;

    void main() {
      vec3 viewDir = normalize(cameraPosition - (modelViewMatrix * vec4(position, 1.0)).xyz);
      vec3 normalDir = normalize(normalMatrix * normal);
      vFresnel = pow(1.0 - dot(viewDir, normalDir), 2.5);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying float vFresnel;

    void main() {
      vec3 glow = color * vFresnel;
      gl_FragColor = vec4(glow, vFresnel + 0.1); // soft edge glow, faint center
    }
  `,
});

for (let i = 0; i < 15; i++) {
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
  mesh.position.set(
    (Math.random() - 0.5) * 300,
    (Math.random() - 0.5) * 300,
    (Math.random() - 0.5) * 300
  );
  group.add(mesh);
  spheres.push({ mesh, rotationSpeed: Math.random() * 0.02 + 0.005 });
}

// Animate 3D
function animate3D() {
  requestAnimationFrame(animate3D);
  group.rotation.y += 0.003;
  group.rotation.x += 0.001;
  spheres.forEach(({ mesh, rotationSpeed }) => {
    mesh.rotation.x += rotationSpeed;
    mesh.rotation.y += rotationSpeed;
  });
  renderer.render(scene, camera);
}
animate3D();
