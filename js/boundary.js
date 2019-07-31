class Boundary {
	constructor(v1, v2) {
		this.v1 = v1;
		this.v2 = v2;
	}

	show() {
		stroke(255);
		line(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
	}
}
