class Sensor {
	constructor(start, angle, mag) {
		this.start = start;
		this.sensorAngle = angle;
		this.carAngle = 0;
		this.mag = mag;
	}

	show() {
		stroke(0, 255, 255, 100);
		let dir = createVector(0, -1).rotate(this.sensorAngle).rotate(this.carAngle);
		let end = p5.Vector.add(this.start, p5.Vector.mult(dir, this.mag)); 
		line(this.start.x, this.start.y, end.x, end.y);
	}

	update(x, y, h, carAngle) {
		this.start.x = x + h * sin(carAngle);
		this.start.y = y - h * cos(carAngle);
		this.carAngle = carAngle;
	}
}