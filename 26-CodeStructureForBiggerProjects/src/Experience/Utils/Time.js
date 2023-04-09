export default class Time extends EventTarget {
	constructor() {
		super();

		this.start = Date.now();
		this.current = this.start;
		this.ellapsedTime = 0;
		this.delta = 16;
		window.requestAnimationFrame(() => this.tick());
	}

	tick() {
		const currentTime = Date.now();
		this.delta = currentTime - this.current;
		this.current = currentTime;
		this.ellapsedTime = this.current - this.start;

		this.dispatchEvent(new Event('tick'));

		window.requestAnimationFrame(() => this.tick());
	}
}
