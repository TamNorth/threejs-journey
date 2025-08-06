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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 2.4, 10, Math.PI * 0.3);
spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);

// Point light
const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);
// Note about point lights - because they are omnidirectional, the shadow camera has to render in 6 directions to create the shadowMap - high performance cost!

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

scene.add(sphere, plane);

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
 * Shadows
 */
sphere.castShadow = true;
plane.receiveShadow = true;
directionalLight.castShadow = true;
spotLight.castShadow = true;
pointLight.castShadow = true;
renderer.shadowMap.enabled = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024; // must be a power of 2

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6; // this step helps performance a little but it is more about precision of where we want our shadows to be
directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.bottom = -1; // reducing orthographic camera size means the sphere is larger in the camera view relative to the shadowMap size, therefore the shadow is higher-res
// directionalLight.shadow.radius = 10; // adds a blur, simulates diffraction but beware this is not physically realistic - blur is not relative to shadow-object distance - NB this doesn't work with PCFSoftShadowMap

spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.fov = 30; // NB in later versions of three.js, this doesn't work - even though changes will be reflected by the cameraHelper, the shadow.camera.fov will be overridden by the spotLight fov

pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

// Notes on shadowMap algorithms: BasicShadowMap - very performant but poor quality; PCFShadowMap - less performant but smoother edges (default); PCFSoftShadowMap - less performant but even softer edges; VSMShadowMap - less performant, more constraints, can have unexpected results

renderer.shadowMap.type = THREE.PCFSoftShadowMap; // NB directionalLight.shadow.radius does not work with this type, but instead we can blur using a lower resolution of shadowMap

/**
 * Helpers
 */

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// scene.add(directionalLightCameraHelper);

const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightHelper);

const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightHelper);

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
