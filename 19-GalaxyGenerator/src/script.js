import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { PointsMaterial } from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 360 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {
	count: 100000,
	size: 0.01,
	radius: 5,
	branches: 3,
	spin: 1,
	randomness: 0.2,
	randomnessPower: 3,
	insideColor: 0xff6030,
	outsideColor: 0x1b3984,
};

let galaxy = null;
let geometry = null;
let material = null;
const generateGalaxy = () => {
	/**
	 * Destroy old galaxy
	 */
	if (galaxy) {
		geometry.dispose();
		material.dispose();
		scene.remove(galaxy);
	}

	const positions = new Float32Array(parameters.count * 3);
	const colors = new Float32Array(parameters.count * 3);
	const insideColor = new THREE.Color(parameters.insideColor);
	const outsideColor = new THREE.Color(parameters.outsideColor);

	for (let i = 0; i < parameters.count; i++) {
		// position
		const radius = Math.random() * parameters.radius;
		const spinAngle = radius * parameters.spin;
		const branchAngle =
			((i % parameters.branches) / parameters.branches) * Math.PI * 2;

		const randomX =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1);
		const randomZ =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1);
		const randomY =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1);

		const i3 = i * 3;
		positions[i3 + 0] =
			Math.cos(branchAngle + spinAngle) * radius + randomX; //x
		positions[i3 + 1] = randomY; //y
		positions[i3 + 2] =
			Math.sin(branchAngle + spinAngle) * radius + randomZ; //z

		// color
		const mixedColor = insideColor.clone();
		mixedColor.lerp(outsideColor, radius / parameters.radius);
		colors[i3 + 0] = mixedColor.r; //r
		colors[i3 + 1] = mixedColor.g; //g
		colors[i3 + 2] = mixedColor.b; //b
	}

	/**
	 * Geometry
	 */
	geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

	/**
	 * Material
	 */
	material = new PointsMaterial({
		size: parameters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
		// color: '#ff5588'
	});

	/**
	 * Points
	 */
	galaxy = new THREE.Points(geometry, material);

	scene.add(galaxy);
};

gui.add(parameters, 'count')
	.min(100)
	.max(1000000)
	.step(100)
	.onFinishChange(generateGalaxy);
gui.add(parameters, 'size')
	.min(0.001)
	.max(0.1)
	.step(0.001)
	.onFinishChange(generateGalaxy);
gui.add(parameters, 'radius')
	.min(0.01)
	.max(20)
	.step(0.01)
	.onFinishChange(generateGalaxy);
gui.add(parameters, 'branches')
	.min(2)
	.max(20)
	.step(1)
	.onFinishChange(generateGalaxy);
gui.add(parameters, 'spin')
	.min(-5)
	.max(5)
	.step(0.001)
	.onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness')
	.min(0)
	.max(2)
	.step(0.01)
	.onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower')
	.min(1)
	.max(10)
	.step(0.001)
	.onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

generateGalaxy();

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
camera.position.x = 3;
camera.position.y = 3;
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

	galaxy.rotation.y =
		(parameters.spin > 0 ? elapsedTime : -elapsedTime) * 0.2;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
