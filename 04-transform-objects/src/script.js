import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;
mesh.rotation.y = Math.PI / 2;
scene.add(mesh);

/** Methods & properties
 * mesh.position // 3 vector
 * mesh.position.set(x, y, z)
 * mesh.position.length() // get distance from origin
 * mesh.position.distanceTo() // get distance to another position
 * mesh.position.normalize() // sets position vector length to 1
 * mesh.scale.x = x
 * mesh.scale.set(x, y, z)
 * mesh.rotation.reorder("YXZ") // sets order of rotation transformations - different rotation orders will have different results! E.g. X then Y means that changing Y position cannot result in scene horizon misaligned to screen horizontal - N.B. reorder must come before rotations
 */

// Group

const group = new THREE.Group();
group.position.x = 1.5;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube2.position.set(0, 1, 0);

group.add(cube1, cube2);

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

camera.lookAt(mesh.position);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
