class Track {
	constructor(w, segments) {
		this.w = w;
		this.segments = segments;
		this.innerPoints = [];
		this.outerPoints = [];
		this.boundaries = [];
		this.start = createVector();
		this.end = createVector();

		this.generateTrack();
	}

	generateTrack() {
		for (let angle = 0; angle < TWO_PI; angle += TWO_PI / this.segments) {
			let offsetX = 160 + 150 * noise(angle);
			let offsetY = 100 + 130 * noise(angle);
			let xOut = offsetX * sin(angle) + width / 2;
			let yOut = offsetY * cos(angle) + height / 2;
			let xIn = (offsetX - this.w) * sin(angle) + width / 2;
			let yIn = (offsetY - this.w) * cos(angle) + height / 2;
			this.outerPoints.push(createVector(xOut, yOut));
			this.innerPoints.push(createVector(xIn, yIn));
		}

		this.createBoundaries(this.outerPoints);
		this.createBoundaries(this.innerPoints);
		// create boundary to separate start and end points
		let innerLast = this.innerPoints[this.segments - 1];
		let outerLast = this.outerPoints[this.segments - 1];
		this.boundaries.push(new Boundary(innerLast, outerLast));

		// set start and end points
		this.start = p5.Vector.lerp(this.innerPoints[0], this.outerPoints[0], 0.5);
		let last = this.segments - 2;
		this.end = p5.Vector.lerp(this.innerPoints[last], this.outerPoints[last], 0.5);
	}

	createBoundaries(points) {
		let prev = points[0];
		for (let i = 1; i < points.length; i++) {
			this.boundaries.push(new Boundary(prev, points[i]));
			prev = points[i];
		}
		this.boundaries.push(new Boundary(prev, points[0]));
	}

	show() {
		for (let b of this.boundaries) {
			b.show();
		}

		fill('red');
		circle(this.start.x, this.start.y, 7);
		fill('green');
		circle(this.end.x, this.end.y, 7);
	}

	debug() {
		for (let i = 0; i < this.innerPoints.length; i++) {
			stroke(255, 100);
			let p1 = this.innerPoints[i];
			let p2 = this.outerPoints[i];
			line(p1.x, p1.y, p2.x, p2.y);
		}
	}
}
