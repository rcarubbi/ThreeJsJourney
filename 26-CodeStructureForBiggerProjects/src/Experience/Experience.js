import * as THREE from 'three';

import sources from './sources.js';

import Sizes from './Utils/Sizes.js';
import Time from './Utils/Time.js';
import Resources from './Utils/Resources.js';
import Debug from './Utils/Debug.js';

import Camera from './Camera.js';
import Renderer from './Renderer.js';

import World from './World/World.js';

export default class Experience {
	constructor(canvas) {
		// global access
		globalThis.experience = this;

		this.canvas = canvas;

		// Setup
		this.debug = new Debug();
		this.sizes = new Sizes();
		this.time = new Time();
		this.scene = new THREE.Scene();
		this.resources = new Resources(sources);
		this.camera = new Camera(this.sizes, this.scene, this.canvas);
		this.renderer = new Renderer(
			this.sizes,
			this.scene,
			this.canvas,
			this.camera
		);
		this.world = new World(
			this.scene,
			this.resources,
			this.time,
			this.debug
		);

		this.resizeHandler = () => {
			this.resize();
		};

		// Sizes resize event
		this.sizes.addEventListener('resize', this.resizeHandler);

		this.tickHandler = () => {
			this.update();
		};

		// Time tick event
		this.time.addEventListener('tick', this.tickHandler);
	}

	resize() {
		this.camera.resize();
		this.renderer.resize();
	}

	update() {
		this.camera.update();
		this.world.update();
		this.renderer.update();
	}

	destroy() {
		this.sizes.removeEventListener('resize', this.resizeHandler);
		this.time.removeEventListener('tick', this.tickHandler);

		this.scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.geometry.dispose();

				for (const key in child.material) {
					const value = child.material[key];
					if (value && typeof value.dispose === 'function') {
						value.dispose();
					}
				}
			}
		});

		this.camera.controls.dispose();
		this.renderer.instance.dispose();

		if (this.debug.active) this.debug.ui.destroy();
	}
}
