class Car {
	constructor(x, y, w, h, turnSpeed, maxSpeed, sensorMag, driver) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.turnSpeed = turnSpeed;
		this.maxSpeed = maxSpeed;
		this.sensorMag = sensorMag;
		this.angle = 0; // angle of car from north
		this.crashed = false;
		this.fuel = CAR_FUEL;
		this.fitness = 0;

		this.sensors = [];
		this.createSensors();

		if (driver) {
			this.driver = driver.copy();
		} else {
			this.driver = new NeuralNetwork(7, 7, 3);
		}
	}

	createSensors() {
		for (let a = -HALF_PI; a <= HALF_PI; a += PI / 6) {
			let v = createVector(this.x, this.y - this.h / 2);
			let dir = createVector(0, -1).rotate(a);
			this.sensors.push(new Sensor(v, a, this.sensorMag));
		}
	}

	dispose() {
		this.driver.dispose();
	}

	mutate() {
		this.driver.mutate(MUTATION_RATE);
	} 

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		fill(255, 50);
		rect(-this.w / 2, -this.h / 2, this.w, this.h);
		pop();
	}

	drive() {
		if (this.fuel <= 0) {
			this.crashed = true;
		}

		let inputs = [];
		for (let s of this.sensors) {
			inputs.push(s.distRatio());
		}
		let output = this.driver.predict(inputs);
		if (output[0] > output[1] && output[0] > output[2]) {
			this.turnLeft();
		} else if (output[1] > output[0] && output[1] > output[2]) {
			this.turnRight();
		}

		this.fuel--;
	}

	debug() {
		for (let s of this.sensors) {
			s.show();
		}
	}

	lookAt(track) {
		for (let s of this.sensors) {
			s.locate(track);
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
				this.crashed = true;
				return;
			}
		}
	}

	updateFitness(track) {
		let p1 = track.innerPoints[this.fitness];
		let p2 = track.outerPoints[this.fitness];
		let checkpoint = collideLineRect(
			p1.x,
			p1.y,
			p2.x,
			p2.y,
			this.x - this.w / 2,
			this.y - this.h / 2,
			this.w,
			this.h
		);
		if (checkpoint) {
			this.fitness++;
			this.fuel = CAR_FUEL;
		}
	}

	gas() {
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
