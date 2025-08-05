import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Debug
 */

const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/5.png");
const gradientTexture = textureLoader.load("./textures/gradients/5.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Objects
 */
// // MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color(0x00ff00);
// material.transparent = true; // required if modifying alpha e.g. with .opacity or .alphaMap
// material.opacity = 0.2;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide; // renders texture on both sides but requires more processing

// // MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true; // useful for debugging

// // MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;
// // where to get matcaps: https://github.com/nidorx/matcaps (but note licences not all verified) or make one at https://www.kchapelier.com/matcap-studio/ or in 3D software by rendering a sphere with lighting and taking a 2D image, or paint one!

// // MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial();
// // for complex materials, shadows etc.

// // MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();
// // most performant material that supports lights, but parameters are inconvenient and there may be strange effects with rounded geometries

// // MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);
// // less performant than Lambert but supports these extra properties - however these are not physics-based

// // MeshToonMaterial
// const material = new THREE.MeshToonMaterial(); // by default provides a 2-part gradient - dark & light
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// gradientTexture.magFilter = THREE.NearestFilter;
// material.gradientMap = gradientTexture; // NB default mip-mapping will stretch and smooth our gradientTexture so that we do not get separate defined values

// // MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial();
// material.roughness = 1;
// material.metalness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1; // provided for example but 1 is default value anyway
// material.displacementMap = doorHeightTexture; // note we need to add segments to geometry to see displacment
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);
// // standard because it uses physically-based rendering (PBR), giving realistic effects that give similar results across software environments

// MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial();
material.roughness = 0;
material.metalness = 0;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1; // provided for example but 1 is default value anyway
// material.displacementMap = doorHeightTexture; // note we need to add segments to geometry to see displacment
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
material.transparent = true;
// material.alphaMap = doorAlphaTexture;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

// material.clearcoat = 1; // note this property is hard on performance
// material.clearcoatRoughness = 0;
// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

// material.sheen = 1;
// material.sheenRoughness = 0;
// // material.sheenColor = new THREE.Color(0xff0000);
// material.sheenColor.set(1, 1, 1);
// gui.add(material, "sheen").min(0).max(1).step(0.0001);
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
// gui.addColor(material, "sheenColor");

// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];
// gui.add(material, "iridescence").min(0).max(1).step(0.0001);
// gui.add(material, "iridescenceIOR").min(1).max(2.333).step(0.0001); // values outside this range are not physically realistic
// gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(0.0001);
// gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(0.0001);

material.transmission = 1;
material.ior = 1.5; // e.g. diamond = 2.417, glass = ~1.5, water = 1.333, air = 1.000293 (more at https://en.wikipedia.org/wiki/List_of_refractive_indices)
material.thickness = 0.5; // note Three cannot calculate thickness from geometry
gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(10).step(0.001);
gui.add(material, "thickness").min(0).max(1).step(0.001);

// extends MeshStandardMaterial and additionally supports clearcoat, sheen, iridescence and transmission properties

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 300, 300), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

sphere.position.x = -1.5;
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Lights
 */

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

/**
 * Environment Map
 */

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

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
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
