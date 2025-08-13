import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("./textures/particles/2.png");

/**
 * Particles
 */
// Material
const particleMaterial = new THREE.PointsMaterial({
  color: "cyan",
  alphaMap: particleTexture, // Problem with this method alone is that it depends on the draw order - e.g. if a particle in front of another is rendered first and the alpha is 0, the pixels of the particle behind will be invisible too as the alpha map will be applied to both
  //   alphaTest: 0.001, // This is better, as the alphaTest simply tells the GPU not to render parts of the material if their alphaMap value is below a certain threshold (in conjunction with alphaMap partial transparency) - however, it has a hard cut-off, so the same problems as before will occur in some cases, just at a different threshold - so it doesn't work great for partial transparency
  transparent: true,
  size: 0.1,
  sizeAttenuation: true,
});

// Geometry
// const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
const particleCount = 5000;
const particleGeometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < particleCount * 3; i++) {
  vertices.push((Math.random() - 0.5) * 10);
}
const verticesTyped = new Float32Array(vertices);
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(verticesTyped, 3)
);

// Points
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
