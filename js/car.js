class Car {
	constructor(x, y, w, h, turnSpeed, maxSpeed) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.turnSpeed = turnSpeed;
		this.maxSpeed = maxSpeed;
		this.angle = 0;
		this.dead = false;
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		if (this.dead) {
			fill(255, 0, 0);
		} else {
			fill(255);
		}
		rect(-this.w / 2, -this.h / 2, this.w, this.h);
		pop();
	}

	drive() {
		this.x += this.maxSpeed * sin(this.angle);
		this.y -= this.maxSpeed * cos(this.angle);
	}

	turnLeft() {
		this.angle -= this.turnSpeed;
	}

	turnRight() {
		this.angle += this.turnSpeed;
	}
}
