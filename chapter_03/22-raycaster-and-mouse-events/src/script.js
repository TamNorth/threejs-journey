import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { modelDirection } from "three/src/nodes/TSL.js";

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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

object1.updateMatrixWorld();
object2.updateMatrixWorld();
object3.updateMatrixWorld(); // three updates objects coordinates (called matrices) right before rendering them, so we have to manually update before raycasting if we want accurate results

/**
 * Models
 */
const gltfLoader = new GLTFLoader();

let duck = null;
gltfLoader.load("models/Duck/glTF/Duck.gltf", (gltf) => {
  gltf.scene.position.y = -1.2;
  duck = gltf.scene;
  scene.add(gltf.scene);
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize(); // ray direction vector must have length 1

// raycaster.set(rayOrigin, rayDirection);
// const intersect = raycaster.intersectObject(object2); // returns an array of intersections - not per object, but per intersection with an object, so possibly multiple even just for one object
// const intersects = raycaster.intersectObjects([object1, object2, object3]); // each array element contains properties of distance (from origin to intersection), face & face index (of the object where it was intersected), object (so we can determine which object was intersected), point of the intersection (as a vector3), uv with 2D uv coordinates of intersection (we might use this e.g. to place a texture where the intersection occurred)

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
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -((event.clientY / sizes.height) * 2 - 1);
  //   console.log(mouse.x.toFixed(2) + " " + mouse.y.toFixed(2));
}); // note that we need to do our raycasting in the tick rather than here, because in some browsers the mousemove event can fire more often than the framerate

window.addEventListener("click", () => {
  if (currentIntersection) {
    if (currentIntersection.object === object1) {
      console.log("sphere1");
    } else if (currentIntersection.object === object2) {
      console.log("sphere2");
    } else if (currentIntersection.object === object3) {
      console.log("sphere3");
    }
  }
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

let currentIntersection = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate objects
  object1.position.y = Math.sin(elapsedTime);
  object2.position.y = Math.sin(elapsedTime * 0.5);
  object3.position.y = Math.sin(elapsedTime * 1.5);

  //   // Cast a ray
  //   const rayOrigin = new THREE.Vector3(-3, 0, 0);
  //   const rayDirection = new THREE.Vector3(1, 0, 0);
  //   rayDirection.normalize();
  //   raycaster.set(rayOrigin, rayDirection);
  //   const objectsToIntersect = [object1, object2, object3];
  //   const intersections = raycaster.intersectObjects(objectsToIntersect);

  //   for (const object of objectsToIntersect) {
  //     object.material.color.set(0xff0000);
  //   }
  //   for (const intersection of intersections) {
  //     intersection.object.material.color.set(0x00ff00);
  //   } // alternatively, just do intersections[0] to just paint the first sphere in the ray path blue

  raycaster.setFromCamera(mouse, camera); // amazing functionality!
  const objectsToIntersect = [object1, object2, object3];
  const intersections = raycaster.intersectObjects(objectsToIntersect);
  for (const object of objectsToIntersect) {
    object.material.color.set(0xff0000);
  }
  for (const intersection of intersections) {
    intersection.object.material.color.set(0x0000ff);
  }

  if (intersections.length) {
    if (currentIntersection === null) {
      console.log("mouse enter");
    }
    currentIntersection = intersections[0];
  } else {
    if (currentIntersection !== null) {
      console.log("mouse leave");
    }
    currentIntersection = null;
  }

  // Update duck
  if (duck) {
    const duckIntersection = raycaster.intersectObject(duck); // although duck is a group and not a mesh, .intersectObject will recursively check children for meshes by default <3 this can be deactivated with a boolean second argument
    if (duckIntersection.length) {
      duck.scale.setScalar(1.5);
    } else {
      duck.scale.setScalar(1);
    }
  }
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
