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
 * Galaxy
 */
const parameters = {
  countExponent: 5,
  sizeExponent: -3,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  axialDecay: 2,
  radialDecay: 2,
};

let galaxyGeometry = null;
let galaxyMaterial = null;
let galaxy = null;

const generateGalaxy = () => {
  /**
   * Destroy old galaxy
   */
  if (galaxy !== null) {
    galaxyGeometry.dispose();
    galaxyMaterial.dispose();
    scene.remove(galaxy);
  }

  /**
   * Material
   */
  galaxyMaterial = new THREE.PointsMaterial({
    color: "white",
    size: 10 ** parameters.sizeExponent,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  /**
   * Geometry
   */
  galaxyGeometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(10 ** parameters.countExponent * 3);

  for (let i = 0; i < 10 ** parameters.countExponent; i++) {
    const i3 = i * 3;

    const radius = Math.random() ** parameters.radialDecay * parameters.radius;
    const branchAngle =
      ((i % parameters.branches) * 2 * Math.PI) / parameters.branches;
    const spinAngle = radius * parameters.spin;
    const randomX =
      Math.random() ** parameters.axialDecay *
      (Math.random() > 0.5 ? 1 : -1) *
      parameters.randomness;
    const randomY =
      Math.random() ** parameters.axialDecay *
      (Math.random() > 0.5 ? 1 : -1) *
      parameters.randomness;
    const randomZ =
      Math.random() ** parameters.axialDecay *
      (Math.random() > 0.5 ? 1 : -1) *
      parameters.randomness;

    vertices[i3 + 0] = radius * Math.cos(branchAngle + spinAngle) + randomX;
    vertices[i3 + 1] = radius * Math.sin(branchAngle + spinAngle) + randomY;
    vertices[i3 + 2] = randomZ;
  }

  galaxyGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3)
  );

  /**
   * Points
   */
  galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxy);
};

generateGalaxy();

gui
  .add(parameters, "countExponent")
  .min(2)
  .max(6)
  .step(0.1)
  .name("star count exponent")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "sizeExponent")
  .min(-3)
  .max(-1)
  .step(0.1)
  .name("star size exponent")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .name("galactic radius")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .name("number of branches")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.1)
  .name("spin")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.01)
  .name("randomness")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "axialDecay")
  .min(0.01)
  .max(5)
  .step(0.01)
  .name("axial decay")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radialDecay")
  .min(0.01)
  .max(5)
  .step(0.01)
  .name("radial decay")
  .onFinishChange(generateGalaxy);

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
camera.position.x = 3;
camera.position.y = 3;
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
