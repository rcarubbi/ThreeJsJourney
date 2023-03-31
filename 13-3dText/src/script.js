import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	bevelSize: 0.02,
	bevelThickness: 0.03,
};

/**
 * Textures
 */

const mapcapTexture = textureLoader.load('/textures/matcaps/8.png');

const parameteres = {
	donutCounter: 300,
	speed: 0,
	amplitude: 0,
};

gui.add(parameteres, 'speed').min(0).max(100).step(0.01);
gui.add(parameteres, 'amplitude').min(0).max(10).step(0.01);

let donutsGroup;
let text;
const renderDonuts = (donutGeometry, material) => {
	console.time('donuts');
	const group = new THREE.Group();
	for (let i = 0; i < parameteres.donutCounter; i++) {
		const donut = new THREE.Mesh(donutGeometry, material);

		donut.position.set(
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10
		);
		donut.rotation.x = Math.random() * Math.PI;
		donut.rotation.y = Math.random() * Math.PI;
		donut.rotation.z = Math.random() * Math.PI;

		const scale = Math.random();
		donut.scale.set(scale, scale, scale);
		group.add(donut);
	}
	console.timeEnd('donuts');
	return group;
};

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry('Raphael Carubbi', {
		font,
		size: 0.5,
		height: 0.2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: sizes.bevelThickness,
		bevelSize: sizes.bevelSize,
		bevelOffset: 0,
		bevelSegments: 4,
	});

	// textGeometry.computeBoundingBox()
	// textGeometry.translate(
	//     - (textGeometry.boundingBox.max.x - sizes.bevelSize) * 0.5
	//     , - (textGeometry.boundingBox.max.y - sizes.bevelSize) * 0.5
	//     , - (textGeometry.boundingBox.max.z - sizes.bevelThickness) * 0.5)

	textGeometry.center();

	const material = new THREE.MeshMatcapMaterial({ matcap: mapcapTexture });

	text = new THREE.Mesh(textGeometry, material);
	scene.add(text);

	const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

	gui.add(parameteres, 'donutCounter')
		.min(0)
		.max(1000)
		.step(1)
		.onChange(() => {
			scene.remove(donutsGroup);
			donutsGroup = renderDonuts(donutGeometry, material);
			scene.add(donutsGroup);
		});

	donutsGroup = renderDonuts(donutGeometry, material);
	scene.add(donutsGroup);
});

// Axes Helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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
camera.position.x = 1;
camera.position.y = 1;
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

	camera.position.x =
		Math.cos(elapsedTime * parameteres.speed) * parameteres.amplitude;
	camera.position.y =
		Math.sin(elapsedTime * parameteres.speed) * parameteres.amplitude;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
