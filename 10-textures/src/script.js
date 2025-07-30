import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures
 */

/** Nuts & bolts method:
 * const image = new Image();
 * const texture = new THREE.Texture(image);
 * image.onload = () => {
 *   texture.needsUpdate = true; // this allows us to declare and assign texture outside the scope of image.onload, and then update the texture once the image changes
 * };
 * image.src = "/textures/door/color.jpg";
 */

// abstracted method:
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoad = () => {
  console.log("onLoad");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/textures/door/color.jpg"); // takes 4 arguments, url and 3 callbacks - first for load, second for progress, third for errors; an alternative is to use a LoadingManager and its .onStart, .onProgress, .onLoad & .onError methods
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg"); // we can re-use textureLoader and get messages from loadingManager for each instance
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

colorTexture.colorSpace = THREE.SRGBColorSpace; // textures used as map or matcap need to be encoded as sRGB
colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3; // by itself, scales texture by 1/3 and causes the last pixel to repeat to the end of the UV mapping coordinate
colorTexture.wrapS = THREE.RepeatWrapping; // causes whole texture to repeat rather than just last pixel
colorTexture.wrapT = THREE.MirroredRepeatWrapping; // same but mirrored every wrap... but not working??
colorTexture.offset.x = 0.5; // units are texture dimensions
colorTexture.rotation = Math.PI * 0.5; // radians - default centre of rotation is at a vertex - 0,0 on the UV map (?)
colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
