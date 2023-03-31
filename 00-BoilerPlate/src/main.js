import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import './style.css';
import fontJson from '../public/fonts/helvetiker_regular.typeface.json';
/**
 * Canvas
 */
const screenParams = {
	width: window.innerWidth,
	height: window.innerHeight,
};
const canvas = document.querySelector('canvas.webgl');

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Camera
 */
const cameraParams = {
	fov: 35,
	aspect: screenParams.width / screenParams.height,
	near: 1,
	far: 100,
	viewSize: 2,
};
// const camera = new THREE.PerspectiveCamera(cameraParams.fov, cameraParams.aspect, cameraParams.near, cameraParams.far)
const camera = new THREE.OrthographicCamera(
	-cameraParams.viewSize * cameraParams.aspect,
	cameraParams.viewSize * cameraParams.aspect,
	cameraParams.viewSize,
	-cameraParams.viewSize,
	0.1,
	100
);

camera.position.z = 7;
scene.add(camera);

/**
 * Debug
 */
const gui = new dat.GUI({ width: 360 });
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.setSize(screenParams.width, screenParams.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

/**
 * Resize event
 */

window.addEventListener('resize', () => {
	screenParams.width = window.innerWidth;
	screenParams.height = window.innerHeight;
	cameraParams.aspect = screenParams.width / screenParams.height;

	camera.aspect = cameraParams.aspect;

	camera.left = -cameraParams.viewSize * cameraParams.aspect;
	camera.right = cameraParams.viewSize * cameraParams.aspect;
	camera.top = cameraParams.viewSize;
	camera.bottom = -cameraParams.viewSize;
	camera.updateProjectionMatrix();

	renderer.setSize(screenParams.width, screenParams.height);
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

/**
 * Main code
 */

// load font
const loader = new FontLoader();
let font = loader.parse(fontJson);

// geometry
const setText = (newText) => {
	const geometry = new TextGeometry(newText, {
		font: font,
		size: 0.5,
		height: 0.2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: 0.02,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 4,
	});
	geometry.center();
	return geometry;
};

const geometry = setText('test');

// material
const material = new THREE.MeshBasicMaterial({
	color: 0xffffff,
});

// mesh
let textMesh = new THREE.Mesh(geometry, material);

scene.add(textMesh);

/**
 * Animation
 */

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	if (elapsedTime.toFixed(2) % 1 === 0) {
		scene.remove(textMesh);

		textMesh = new THREE.Mesh(
			setText(`Elapsed Time: ${elapsedTime.toFixed(2)}`),
			material
		);

		scene.add(textMesh);
	}

	orbitControls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
