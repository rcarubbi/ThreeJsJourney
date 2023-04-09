export default class Sizes extends EventTarget {
	constructor() {
		super();
		this.setSizes();

		window.addEventListener('resize', () => {
			this.setSizes();
			this.dispatchEvent(new Event('resize'));
		});
	}

	setSizes() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.pixelRation = Math.min(window.devicePixelRatio, 2);
	}
}
