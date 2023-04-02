import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {
	createSphere: () => {
		createSphere(Math.random() * 0.5, {
			x: (Math.random() - 0.5) * 3,
			y: 3,
			z: (Math.random() - 0.5) * 3,
		});
	},
	createBox: () => {
		createBox(Math.random(), Math.random(), Math.random(), {
			x: (Math.random() - 0.5) * 3,
			y: 3,
			z: (Math.random() - 0.5) * 3,
		});
	},
	reset: () => {
		for (const objectToUpdate of objectsToUpdate) {
			objectToUpdate.body.removeEventListener('collide', playHitSound);
			world.removeBody(objectToUpdate.body);
			scene.remove(objectToUpdate.mesh);
		}

		objectsToUpdate.splice(0, objectsToUpdate.length);
	},
};

gui.add(debugObject, 'createSphere');
gui.add(debugObject, 'createBox');
gui.add(debugObject, 'reset');

/**
 * Audio
 */
const hitSound = new Audio('/sounds/hit.mp3');

const playHitSound = (collision) => {
	const collisionStrength = Math.min(
		collision.contact.getImpactVelocityAlongNormal(),
		7
	);

	if (collisionStrength > 1.5) {
		hitSound.volume = collisionStrength / 7;
		hitSound.currentTime = 0;
		hitSound.play();
	}
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
	'/textures/environmentMaps/0/px.png',
	'/textures/environmentMaps/0/nx.png',
	'/textures/environmentMaps/0/py.png',
	'/textures/environmentMaps/0/ny.png',
	'/textures/environmentMaps/0/pz.png',
	'/textures/environmentMaps/0/nz.png',
]);

/**
 * Physics
 */

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

// Materials
// const concreteMaterial = new CANNON.Material('concrete');
// const plasticMaterial = new CANNON.Material('plastic');
// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
// 	concreteMaterial,
// 	plasticMaterial,
// 	{
// 		friction: 0.1,
// 		restitution: 0.9,
// 	}
// );
// world.addContactMaterial(concretePlasticContactMaterial);

const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
	defaultMaterial,
	defaultMaterial,
	{
		friction: 0.1,
		restitution: 0.7,
	}
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
// 	mass: 1,
// 	position: new CANNON.Vec3(0, 3, 0),
// 	shape: sphereShape,
// 	// material: plasticMaterial,
// 	// material: defaultMaterial,
// });

// sphereBody.applyLocalForce(
// 	new CANNON.Vec3(150, 0, 0),
// 	new CANNON.Vec3(0, 0, 0)
// );

// world.addBody(sphereBody);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
	mass: 0,
});
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
// floorBody.material = concreteMaterial;
// floorBody.material = defaultMaterial;
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
// 	new THREE.SphereGeometry(0.5, 32, 32),
// 	new THREE.MeshStandardMaterial({
// 		metalness: 0.3,
// 		roughness: 0.4,
// 		envMap: environmentMapTexture,
// 		envMapIntensity: 0.5,
// 	})
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: '#777777',
		metalness: 0.3,
		roughness: 0.4,
		envMap: environmentMapTexture,
		envMapIntensity: 0.5,
	})
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const objectMaterial = new THREE.MeshStandardMaterial({
	metalness: 0.4,
	roughness: 0.3,
	envMap: environmentMapTexture,
});

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const createSphere = (radius, position) => {
	const mesh = new THREE.Mesh(sphereGeometry, objectMaterial);
	mesh.scale.set(radius, radius, radius);
	mesh.castShadow = true;

	mesh.position.copy(position);
	scene.add(mesh);

	// CANNON Body
	const shape = new CANNON.Sphere(radius);
	const body = new CANNON.Body({ mass: 1, shape });
	body.addEventListener('collide', playHitSound);
	body.position.copy(position);
	world.addBody(body);

	// save in  objects to update
	objectsToUpdate.push({ mesh, body });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

const createBox = (width, height, depth, position) => {
	const mesh = new THREE.Mesh(boxGeometry, objectMaterial);
	mesh.scale.set(width, height, depth);
	mesh.castShadow = true;
	mesh.position.copy(position);
	scene.add(mesh);

	// CANNON Body
	const shape = new CANNON.Box(
		new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
	);
	const body = new CANNON.Body({ mass: 1, shape });

	body.addEventListener('collide', playHitSound);
	body.position.copy(position);
	world.addBody(body);

	// save in  objects to update
	objectsToUpdate.push({ mesh, body });
};

// createSphere(0.5, { x: 0, y: 3, z: 0 });

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const delta = clock.getDelta();
	const elapsedTime = clock.getElapsedTime();

	// sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

	// Update physics world
	world.step(1 / 60, delta, 3);

	// sphere.position.copy(sphereBody.position);

	for (const objectToUpdate of objectsToUpdate) {
		objectToUpdate.mesh.position.copy(objectToUpdate.body.position);
		objectToUpdate.mesh.quaternion.copy(objectToUpdate.body.quaternion);
	}

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
