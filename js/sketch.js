const TRACK_SEGMENTS = 30;
const TRACK_WIDTH = 50;

const CAR_TURN_SPEED = 0.07;
const CAR_SPEED = 2.5;
const CAR_WIDTH = 10;
const CAR_LENGTH = 20;

let car;
let track;
function setup() {
    createCanvas(640, 480);
    track = new Track(TRACK_WIDTH, TRACK_SEGMENTS);
    car = new Car(
        track.start.x,
        track.start.y,
        CAR_WIDTH,
        CAR_LENGTH,
        CAR_TURN_SPEED,
        CAR_SPEED
    );
    calculateStartAngle();
}

function calculateStartAngle() {
    let north = createVector(0, -1);
    let firstTrackSegment = p5.Vector.sub(track.innerPoints[1], track.innerPoints[0]);
    car.angle = firstTrackSegment.angleBetween(north);
}

function draw() {
    if (keyIsDown(UP_ARROW)) {
        car.drive();
    }
    if (keyIsDown(LEFT_ARROW)) {
        car.turnLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        car.turnRight();
    }

    background(0);
    car.show();
    track.show();
    track.debug();
}
