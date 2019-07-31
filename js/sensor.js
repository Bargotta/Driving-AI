class Sensor {
	constructor(start, angle, mag) {
		this.start = start;
		this.sensorAngle = angle;
		this.carAngle = 0;
		this.mag = mag;
		this.hit = null;
	}

	show() {
		stroke(0, 255, 255, 100);
		let dir = createVector(0, -1).rotate(this.sensorAngle).rotate(this.carAngle);
		let end = p5.Vector.add(this.start, p5.Vector.mult(dir, this.mag));
		line(this.start.x, this.start.y, end.x, end.y);

		if (this.hit) {
			fill(0, 255, 255);
			circle(this.hit.x, this.hit.y, 5);
		}
	}

	update(x, y, h, carAngle) {
		this.start.x = x + h * sin(carAngle);
		this.start.y = y - h * cos(carAngle);
		this.carAngle = carAngle;
	}

	locate(track) {
		this.hit = null;
		for (let b of track.boundaries) {
			let dir = createVector(0, -1).rotate(this.sensorAngle).rotate(this.carAngle);
			let end = p5.Vector.add(this.start, p5.Vector.mult(dir, this.mag));
			let hit = collideLineLine(b.v1.x, b.v1.y, b.v2.x, b.v2.y, this.start.x, this.start.y, end.x, end.y, true);
			if (hit.x && hit.y) {
				this.hit = hit;
				return;
			}	
		}
	}
}