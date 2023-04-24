import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RGBShiftShader } from 'three/addons/Shaders/RGBShiftShader.js';
import { GammaCorrectionShader } from 'three/addons/Shaders/GammaCorrectionShader.js';
import * as dat from 'lil-gui';
import tintVertextShader from './shaders/tint/vertex.vs.iglsl';
import tintFragmentShader from './shaders/tint/fragment.fs.iglsl';
import displacementVertextShader from './shaders/displacement/vertex.vs.iglsl';
import displacementFragmentShader from './shaders/displacement/fragment.fs.iglsl';
import normalVertextShader from './shaders/normal/vertex.vs.iglsl';
import normalFragmentShader from './shaders/normal/fragment.fs.iglsl';
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
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
	scene.traverse((child) => {
		if (
			child instanceof THREE.Mesh &&
			child.material instanceof THREE.MeshStandardMaterial
		) {
			child.material.envMapIntensity = 2.5;
			child.material.needsUpdate = true;
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
	'/textures/environmentMaps/0/px.jpg',
	'/textures/environmentMaps/0/nx.jpg',
	'/textures/environmentMaps/0/py.jpg',
	'/textures/environmentMaps/0/ny.jpg',
	'/textures/environmentMaps/0/pz.jpg',
	'/textures/environmentMaps/0/nz.jpg',
]);
environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Models
 */
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
	gltf.scene.scale.set(2, 2, 2);
	gltf.scene.rotation.y = Math.PI * 0.5;
	scene.add(gltf.scene);

	updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
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

	// Update effect composer
	effectComposer.setSize(sizes.width, sizes.height);
	effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
camera.position.set(4, 1, -4);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Post Processing
 */

const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
	samples: renderer.getPixelRatio() === 1 ? 2 : 0,
});

const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(renderer.getPixelRatio());
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

gui.add(dotScreenPass, 'enabled').name('dotScreenPass');

const glitchPass = new GlitchPass();
glitchPass.goWild = false;
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

const glitchPassGui = gui.addFolder('glitchPass');
glitchPassGui.add(glitchPass, 'enabled');
glitchPassGui.add(glitchPass, 'goWild');

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

gui.add(rgbShiftPass, 'enabled').name('RgbShiftPass');

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

gui.add(gammaCorrectionPass, 'enabled').name('gammaCorrectionPass');

const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.enabled = false;
unrealBloomPass.strength = 0.3;
unrealBloomPass.radius = 1;
unrealBloomPass.threshold = 0.6;
effectComposer.addPass(unrealBloomPass);

const unrealBloomPassGui = gui.addFolder('UnrealBloomPass');
unrealBloomPassGui.add(unrealBloomPass, 'enabled');
unrealBloomPassGui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001);
unrealBloomPassGui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001);
unrealBloomPassGui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001);

if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
	const smaaPass = new SMAAPass();
	effectComposer.addPass(smaaPass);
}

// Tint Pass

const TintShader = {
	uniforms: {
		tDiffuse: { value: null },
		uTint: { value: null },
	},
	vertexShader: tintVertextShader,
	fragmentShader: tintFragmentShader,
};

const tintPass = new ShaderPass(TintShader);
tintPass.enabled = false;
tintPass.material.uniforms.uTint.value = new THREE.Vector3();
effectComposer.addPass(tintPass);

const tintShaderGui = gui.addFolder('TintPass');
tintShaderGui.add(tintPass, 'enabled');
tintShaderGui
	.add(tintPass.material.uniforms.uTint.value, 'x')
	.min(-1)
	.max(1)
	.step(0.001)
	.name('red');
tintShaderGui
	.add(tintPass.material.uniforms.uTint.value, 'y')
	.min(-1)
	.max(1)
	.step(0.001)
	.name('green');
tintShaderGui
	.add(tintPass.material.uniforms.uTint.value, 'z')
	.min(-1)
	.max(1)
	.step(0.001)
	.name('blue');

// Displacement Pass

const DisplacementShader = {
	uniforms: {
		tDiffuse: { value: null },
		uTime: { value: null },
	},
	vertexShader: displacementVertextShader,
	fragmentShader: displacementFragmentShader,
};

const displacementPass = new ShaderPass(DisplacementShader);
displacementPass.material.uniforms.uTime.value = 0;
displacementPass.enabled = false;
effectComposer.addPass(displacementPass);

gui.add(displacementPass, 'enabled').name('displacementPass');

// Normal Pass

const NormalShader = {
	uniforms: {
		tDiffuse: { value: null },
		uNormalMap: { value: null },
	},
	vertexShader: normalVertextShader,
	fragmentShader: normalFragmentShader,
};

const normalPass = new ShaderPass(NormalShader);
normalPass.material.uniforms.uNormalMap.value = textureLoader.load(
	'/textures/interfaceNormalMap.png'
);
normalPass.enabled = false;
effectComposer.addPass(normalPass);

gui.add(normalPass, 'enabled').name('normalPass');

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	displacementPass.material.uniforms.uTime.value = elapsedTime;
	// Update controls
	controls.update();

	// Render
	// renderer.render(scene, camera);
	effectComposer.render();

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
