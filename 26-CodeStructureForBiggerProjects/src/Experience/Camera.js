import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class Camera {
	constructor(sizes, scene, canvas) {
		this.sizes = sizes;
		this.scene = scene;
		this.canvas = canvas;

		this.setInstance();
		this.setOrbitControls();
	}

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			35,
			this.sizes.width / this.sizes.height,
			0.1,
			100
		);

		this.instance.position.set(6, 4, 8);
		this.scene.add(this.instance);
	}

	setOrbitControls() {
		this.controls = new OrbitControls(this.instance, this.canvas);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.01;
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.updateProjectionMatrix();
	}

	update() {
		this.controls.update();
	}
}
