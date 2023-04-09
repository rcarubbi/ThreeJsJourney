import * as THREE from 'three';

export default class Renderer {
	constructor(sizes, scene, canvas, camera) {
		this.sizes = sizes;
		this.scene = scene;
		this.canvas = canvas;
		this.camera = camera;

		this.setInstance();
	}

	setInstance() {
		this.instance = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		});

		this.instance.physicallyCorrectLights = true;
		this.instance.outputEncoding = THREE.sRGBEncoding;
		this.instance.toneMapping = THREE.CineonToneMapping;
		this.instance.toneMappingExposure = 1.75;
		this.instance.shadowMap.enabled = true;
		this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
		this.instance.setClearColor('#211d20');
		this.resize();
	}

	resize() {
		this.instance.setSize(this.sizes.width, this.sizes.height);
		this.instance.setPixelRatio(this.sizes.devicePixelRatio);
	}

	update() {
		this.instance.render(this.scene, this.camera.instance);
	}
}
