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
		let end = this.end();
		line(this.start.x, this.start.y, end.x, end.y);

		if (this.hit) {
			fill(0, 255, 255);
			circle(this.hit.x, this.hit.y, 5);
		}
	}

	end() {
		let dir = createVector(0, -1).rotate(this.sensorAngle).rotate(this.carAngle);
		return p5.Vector.add(this.start, p5.Vector.mult(dir, this.mag));
	}

	update(x, y, h, carAngle) {
		this.start.x = x + h * sin(carAngle);
		this.start.y = y - h * cos(carAngle);
		this.carAngle = carAngle;
	}

	distRatio() {
		if (! this.hit) return 1;
		
		let dist = createVector(this.hit.x, this.hit.y).sub(this.start).mag();
		return dist / this.mag;
	}

	locate(track) {
		this.hit = null;
		for (let b of track.boundaries) {
			let end = this.end();
			let hit = collideLineLine(b.v1.x, b.v1.y, b.v2.x, b.v2.y, this.start.x, this.start.y, end.x, end.y, true);
			if (hit.x && hit.y) {
				this.hit = hit;
				return;
			}	
		}
	}
}