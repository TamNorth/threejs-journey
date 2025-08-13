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
  // alphaTest: 0.001, // This is better, as the alphaTest simply tells the GPU not to render parts of the material if their alphaMap value is below a certain threshold (in conjunction with alphaMap partial transparency) - however, it has a hard cut-off, so the same problems as before will occur in some cases, just at a different threshold - so it doesn't work great for partial transparency
  transparent: true,
  size: 0.1,
  sizeAttenuation: true,
});
// particleMaterial.depthTest = false; // This prevents WebGL from trying to order particles according to whether they are nearer or further from the camera, and avoids the initial issue with particles behind being affected by the alphaMap of particles in front. However it will cause bugs when other materials with different colours, etc., are introduced to the scene, as particles behind an object will be rendered as if in front of it
particleMaterial.depthWrite = false; // Instead of telling WebGL not to look in the depth buffer to test whether what's being drawn is closer than what's already been drawn, we can just tell it not to write in it when drawing an object (i.e. it will not go back and modify objects behind?). This is generally a good solution
particleMaterial.blending = THREE.AdditiveBlending; // This will add the colour values of overlapping particles together. This is more realistic for combining particles of light, which do not obscure one another, rather than material objects like snowflakes. It also has a performance cost.

// Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
const particleCount = 5000;
const particlesGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(vertices, 3)
);

// Points
const particles = new THREE.Points(particlesGeometry, particleMaterial);
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
