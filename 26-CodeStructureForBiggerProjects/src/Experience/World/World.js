import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';

export default class World {
	constructor(scene, resources, time, debug) {
		this.scene = scene;
		this.resources = resources;
		this.time = time;
		this.debug = debug;
		// Wait for resources
		this.resources.addEventListener('ready', () => {
			// Setup
			this.floor = new Floor(this.scene, this.resources);
			this.fox = new Fox(
				this.scene,
				this.resources,
				this.time,
				this.debug
			);
			this.environment = new Environment(
				this.scene,
				this.resources,
				this.debug
			);
		});
	}

	update() {
		if (this.fox) this.fox.update();
	}
}
