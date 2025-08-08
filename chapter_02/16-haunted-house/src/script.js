import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";
import { Timer } from "three/addons/misc/Timer.js";
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

// Axes helper
// scene.add(new THREE.AxesHelper(10));

/**
 * Textures
 */

// Floor
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg"
);
const floorNormal = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
);
const floorARM = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg"
);
const floorDisplacement = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"
);
const floorAlpha = textureLoader.load("./floor/alpha.jpg");
floorTexture.colorSpace = THREE.SRGBColorSpace;
floorTexture.repeat.set(8, 8);
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorNormal.repeat.set(8, 8);
floorNormal.wrapS = THREE.RepeatWrapping;
floorNormal.wrapT = THREE.RepeatWrapping;
floorARM.repeat.set(8, 8);
floorARM.wrapS = THREE.RepeatWrapping;
floorARM.wrapT = THREE.RepeatWrapping;
floorDisplacement.repeat.set(8, 8);
floorDisplacement.wrapS = THREE.RepeatWrapping;
floorDisplacement.wrapT = THREE.RepeatWrapping;

// Wall
const wallTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg"
);
const wallNormal = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg"
);
const wallARM = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg"
);
wallTexture.colorSpace = THREE.SRGBColorSpace;
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallNormal.wrapS = THREE.RepeatWrapping;
wallNormal.wrapT = THREE.RepeatWrapping;
wallARM.wrapS = THREE.RepeatWrapping;
wallARM.wrapT = THREE.RepeatWrapping;

// Roof
const roofTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg"
);
const roofNormal = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg"
);
const roofARM = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg"
);
roofTexture.colorSpace = THREE.SRGBColorSpace;
roofTexture.repeat.set(3, 1);
roofNormal.repeat.set(3, 1);
roofARM.repeat.set(3, 1);
roofTexture.wrapS = THREE.RepeatWrapping;
roofNormal.wrapS = THREE.RepeatWrapping;
roofARM.wrapS = THREE.RepeatWrapping;

// Door
const doorTexture = textureLoader.load("./door/color.jpg");
const doorNormal = textureLoader.load("./door/normal.jpg");
const doorAO = textureLoader.load("./door/ambientOcclusion.jpg");
const doorRoughness = textureLoader.load("./door/roughness.jpg");
const doorMetalness = textureLoader.load("./door/metalness.jpg");
const doorAlpha = textureLoader.load("./door/alpha.jpg");
const doorDisplacement = textureLoader.load("./door/height.jpg");
doorTexture.colorSpace = THREE.SRGBColorSpace;

// Bush
const bushTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg"
);
const bushNormal = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg"
);
const bushARM = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg"
);
bushTexture.colorSpace = THREE.SRGBColorSpace;
bushTexture.repeat.set(2, 1);
bushNormal.repeat.set(2, 1);
bushARM.repeat.set(2, 1);
bushTexture.wrapS = THREE.RepeatWrapping;
bushNormal.wrapS = THREE.RepeatWrapping;
bushARM.wrapS = THREE.RepeatWrapping;

// Grave
const graveTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg"
);
const graveNormal = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg"
);
const graveARM = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg"
);
graveTexture.colorSpace = THREE.SRGBColorSpace;
graveTexture.repeat.set(0.3, 0.4);
graveNormal.repeat.set(0.3, 0.4);
graveARM.repeat.set(0.3, 0.4);

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallTexture,
    normalMap: wallNormal,
    aoMap: wallARM,
    roughnessMap: wallARM,
    metalnessMap: wallARM,
  })
);
walls.geometry.computeBoundingBox();
walls.position.y +=
  (walls.geometry.boundingBox.max.y - walls.geometry.boundingBox.min.y) / 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofTexture,
    normalMap: roofNormal,
    aoMap: roofARM,
    roughnessMap: roofARM,
    metalnessMap: roofARM,
  })
);
roof.geometry.computeBoundingBox();
roof.position.y +=
  (roof.geometry.boundingBox.max.y - roof.geometry.boundingBox.min.y) / 2 + 2.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorTexture,
    normalMap: doorNormal,
    aoMap: doorAO,
    roughnessMap: doorRoughness,
    metalnessMap: doorMetalness,
    displacementMap: doorDisplacement,
    displacementBias: -0.07,
    displacementScale: 0.2,
    alphaMap: doorAlpha,
    transparent: true,
  })
);
door.position.z += walls.geometry.boundingBox.max.z + 0.01;
door.position.y += 1;
house.add(door);

gui
  .add(door.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.01)
  .name("doorDisplacementScale");
gui
  .add(door.material, "displacementBias")
  .min(-0.5)
  .max(0)
  .step(0.01)
  .name("doorDisplacementBias");

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0xccffcc,
  map: bushTexture,
  normalMap: bushNormal,
  aoMap: bushARM,
  roughnessMap: bushARM,
  metalnessMap: bushARM,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveTexture,
  normalMap: graveNormal,
  aoMap: graveARM,
  roughnessMap: graveARM,
  metalnessMap: graveARM,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const azimuth = Math.random() * Math.PI * 2;
  const radius = Math.random() * 4 + 3;
  const height = Math.random() * 0.4;
  grave.position.set(
    Math.sin(azimuth) * radius,
    height,
    Math.cos(azimuth) * radius
  );
  const tilt = (Math.random() - 0.5) * Math.PI * 0.25;
  const lean = (Math.random() - 0.5) * Math.PI * 0.25;
  grave.rotation.set(tilt, lean, 0);
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    map: floorTexture,
    normalMap: floorNormal,
    displacementMap: floorDisplacement,
    displacementScale: 0.3,
    displacementBias: -0.2,
    aoMap: floorARM,
    roughnessMap: floorARM,
    metalnessMap: floorARM,
    alphaMap: floorAlpha,
    transparent: true,
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(0)
  .step(0.001)
  .name("floorDisplacementBias");

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
scene.add(ghost1, ghost2, ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

for (let grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

// Helpers
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// scene.add(directionalLightCameraHelper);

/**
 * Sky
 */
const sky = new Sky();
sky.scale.setScalar(100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
scene.fog = new THREE.FogExp2("#02343f", 0.1);

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Update ghosts
  const ghostAzimuth1 = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghostAzimuth1) * 4;
  ghost1.position.z = Math.sin(ghostAzimuth1) * 4;
  ghost1.position.y =
    Math.sin(ghostAzimuth1) *
    Math.sin(ghostAzimuth1 * 2.34) *
    Math.sin(ghostAzimuth1 * 3.45);

  const ghostAzimuth2 = -elapsedTime * 0.35;
  ghost2.position.x = Math.cos(ghostAzimuth2) * 3;
  ghost2.position.z = Math.sin(ghostAzimuth2) * 3;
  ghost2.position.y =
    Math.sin(ghostAzimuth2) *
    Math.sin(ghostAzimuth2 * 2.34) *
    Math.sin(ghostAzimuth2 * 3.45);

  const ghostAzimuth3 = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghostAzimuth3) * 6;
  ghost3.position.z = Math.sin(ghostAzimuth3) * 6;
  ghost3.position.y =
    Math.sin(ghostAzimuth3) *
    Math.sin(ghostAzimuth3 * 2.34) *
    Math.sin(ghostAzimuth3 * 3.45);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
