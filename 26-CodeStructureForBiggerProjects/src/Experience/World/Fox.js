import * as THREE from 'three';

export default class Fox {
	constructor(scene, resources, time, debug) {
		this.scene = scene;
		this.resources = resources;
		this.time = time;
		this.debug = debug;

		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('fox');
		}
		// setup
		this.resource = this.resources.items.foxModel;
		this.setModel();
		this.setAnimation();
	}

	setModel() {
		this.model = this.resource.scene;
		this.model.scale.set(0.02, 0.02, 0.02);
		this.scene.add(this.model);

		this.model.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
			}
		});
	}

	setAnimation() {
		const mixer = new THREE.AnimationMixer(this.model);
		const actions = {
			idle: mixer.clipAction(this.resource.animations[0]),
			walking: mixer.clipAction(this.resource.animations[1]),
			running: mixer.clipAction(this.resource.animations[2]),
			current: null,
		};

		this.animation = {
			mixer,
			actions,
			play: (name) => {
				const newAction = this.animation.actions[name];
				const oldAction = this.animation.actions.current;
				newAction.reset();
				newAction.play();
				newAction.crossFadeFrom(oldAction, 1);
				this.animation.actions.current = newAction;
			},
		};

		this.animation.actions.current = this.animation.actions.idle;
		this.animation.actions.current.play();

		// debug
		if (this.debug.active) {
			const debugObject = {
				playIdle: () => {
					this.animation.play('idle');
				},
				playWalking: () => {
					this.animation.play('walking');
				},
				playRunning: () => {
					this.animation.play('running');
				},
			};

			this.debugFolder.add(debugObject, 'playIdle');
			this.debugFolder.add(debugObject, 'playWalking');
			this.debugFolder.add(debugObject, 'playRunning');
		}
	}

	update() {
		this.animation.mixer.update(this.time.delta * 0.001);
	}
}
