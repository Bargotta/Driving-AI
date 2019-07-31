class Car {
	constructor(x, y, w, h, turnSpeed, maxSpeed, sensorMag) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.turnSpeed = turnSpeed;
		this.maxSpeed = maxSpeed;
		this.sensorMag = sensorMag;
		this.angle = 0; // angle of car from north
		this.dead = false;
		this.sensors = [];

		this.createSensors();
	}

	createSensors() {
		for (let a = -HALF_PI; a <= HALF_PI; a += PI / 6) {
			let v = createVector(this.x, this.y - this.h / 2);
			let dir = createVector(0, -1).rotate(a);
			this.sensors.push(new Sensor(v, a, this.sensorMag));
		}
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		fill(255);
		rect(-this.w / 2, -this.h / 2, this.w, this.h);
		pop();
	}

	debug() {
		for (let s of this.sensors) {
			s.show();
		}
	}

	detectCollision(track) {
		for (let b of track.boundaries) {
			// TODO: Take into account the car rotation when detecting collision
			let collision = collideLineRect(
				b.v1.x,
				b.v1.y,
				b.v2.x,
				b.v2.y,
				this.x - this.w / 2,
				this.y - this.h / 2,
				this.w,
				this.h
			);
			if (collision) {
				this.dead = true;
				return;
			}
		}
	}

	drive() {
		this.x += this.maxSpeed * sin(this.angle);
		this.y -= this.maxSpeed * cos(this.angle);
		this.updateSensors();
	}

	turnLeft() {
		this.angle -= this.turnSpeed;
		this.updateSensors();
	}

	turnRight() {
		this.angle += this.turnSpeed;
		this.updateSensors();
	}

	updateAngle(angle) {
		this.angle = angle;
		this.updateSensors();
	}

	updateSensors() {
		for (let s of this.sensors) {
			s.update(this.x, this.y, this.h / 2, this.angle);
		}
	}
}
