import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
directionalLight.position.set(1, 0, 1); // note this really defines the unit vector of the parallel light rays, as a negative of the params, because they take the vector that a light at the given position would need to point directly at the origin
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9); // good low-performance-cost option for simulating light reflections, e.g. use green and blue for grass and sky
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 1.5, 1); // 3rd & 4th params are distance - how far the light travels before not illuminating anything - and decay
pointLight.position.x = 2;
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight(0x4c00ff, 6, 1, 1); // 3rd & 4th params are the dimensions of the light source. NB only works with MeshStandardMaterial and MeshPhysicalMaterial!
rectAreaLight.position.set(1.5, 0, 1.5);
rectAreaLight.lookAt(0, 0, 0);
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(
  0x78ff00,
  1.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
); // 3rd param is fade distance, 4th is angle of illumination - i.e. sharpness of the cone, 5th is penumbra - i.e. sharpness or diffusion at edge of cone, 6th is decay - note that playing with this can cause the light to end abruptly when it reaches its max distance - usually kept at 1
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -1.5; // cannot use lookAt() - spotLight always looks at a target
scene.add(spotLight.target); // must add target to a scene
scene.add(spotLight);

// Performance: lights can cost a lot of performance - minimal cost is ambient and hemisphere, moderate cost is directional and point, high is spot and rectArea - consider baking textures if an issue

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight); // has to be imported (see imports at top)
scene.add(rectAreaLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
scene.add(spotLightHelper);

// Personal note: probably best to put these all in debug gui!

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
