import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import firefliesVertexShader from './shaders/fireflies/vertex.vs.iglsl';
import firefliesFragmentShader from './shaders/fireflies/fragment.fs.iglsl';
import portalVertexShader from './shaders/portal/vertex.vs.iglsl';
import portalFragmentShader from './shaders/portal/fragment.fs.iglsl';
/**
 * Base
 */
// Debug
const debugObject = {
	clearColor: 0x3a222b,
	firefliesCount: 50,
	portalInnerColor: 0xffc96b,
	portalOuterColor: 0x54124b,
};
const gui = new dat.GUI({
	width: 400,
});

gui.addColor(debugObject, 'clearColor').onChange(() => {
	renderer.setClearColor(debugObject.clearColor);
});

gui.addColor(debugObject, 'portalInnerColor').onChange(() => {
	portalLightMaterial.uniforms.uEndColor.value.set(
		debugObject.portalInnerColor
	);
});

gui.addColor(debugObject, 'portalOuterColor').onChange(() => {
	portalLightMaterial.uniforms.uStartColor.value.set(
		debugObject.portalOuterColor
	);
});

gui.add(debugObject, 'firefliesCount')
	.min(1)
	.max(100)
	.step(1)
	.name('Fire flies Count')
	.onChange(() => {
		generateFireflies();
	});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// GLTF loader
const gltfLoader = new GLTFLoader();

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg');
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;
/**
 * Materials
 */

const bakedMaterial = new THREE.MeshBasicMaterial({
	map: bakedTexture,
});

const poleLightMaterial = new THREE.MeshBasicMaterial({
	color: 0xfffbe2,
});

const portalLightMaterial = new THREE.ShaderMaterial({
	vertexShader: portalVertexShader,
	fragmentShader: portalFragmentShader,
	side: THREE.DoubleSide,
	uniforms: {
		uTime: { value: 0 },
		uStartColor: { value: new THREE.Color(debugObject.portalOuterColor) },
		uEndColor: { value: new THREE.Color(debugObject.portalInnerColor) },
	},
});

/**
 * Model
 */

gltfLoader.load('portal.glb', (gltf) => {
	const bakedMesh = gltf.scene.children.find(
		(child) => child.name === 'Baked'
	);

	const poleLight1 = gltf.scene.children.find(
		(child) => child.name === 'Light001'
	);

	const poleLight2 = gltf.scene.children.find(
		(child) => child.name === 'Light002'
	);
	const portalLight = gltf.scene.children.find(
		(child) => child.name === 'PortalLight'
	);

	bakedMesh.material = bakedMaterial;
	poleLight1.material = poleLightMaterial;
	poleLight2.material = poleLightMaterial;
	portalLight.material = portalLightMaterial;
	scene.add(gltf.scene);
});

/**
 * Fireflies
 */
//Geometry
let fireflies;
let firefliesGeometry;

const generateFireflies = () => {
	if (fireflies) {
		scene.remove(fireflies);
		firefliesGeometry.dispose();
	}

	firefliesGeometry = new THREE.BufferGeometry();
	const firefliesPositions = new Float32Array(debugObject.firefliesCount * 3);
	const firefliesScales = new Float32Array(debugObject.firefliesCount * 1);
	for (let i = 0; i < debugObject.firefliesCount; i++) {
		firefliesPositions[i * 3 + 0] = (Math.random() - 0.5) * 4;
		firefliesPositions[i * 3 + 1] = Math.random() * 2;
		firefliesPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;

		firefliesScales[i] = Math.random();
	}

	firefliesGeometry.setAttribute(
		'position',
		new THREE.BufferAttribute(firefliesPositions, 3)
	);

	firefliesGeometry.setAttribute(
		'aScale',
		new THREE.BufferAttribute(firefliesScales, 1)
	);

	fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
	scene.add(fireflies);
};

// Material
const firefliesMaterial = new THREE.ShaderMaterial({
	uniforms: {
		uTime: { value: 0 },
		uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
		uSize: { value: 100 },
	},
	transparent: true,
	vertexShader: firefliesVertexShader,
	fragmentShader: firefliesFragmentShader,
	blending: THREE.AdditiveBlending,
	depthWrite: false,
});
gui.add(firefliesMaterial.uniforms.uSize, 'value')
	.min(0)
	.max(500)
	.step(1)
	.name('Fire flies Size');
generateFireflies();

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

	firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
		window.devicePixelRatio,
		2
	);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(debugObject.clearColor);
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	firefliesMaterial.uniforms.uTime.value = elapsedTime;
	portalLightMaterial.uniforms.uTime.value = elapsedTime;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
