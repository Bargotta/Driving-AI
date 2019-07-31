const TRACK_SEGMENTS = 30;
const TRACK_WIDTH = 50;

const CAR_TURN_SPEED = 0.07;
const CAR_SPEED = 2.5;
const CAR_WIDTH = 10;
const CAR_LENGTH = 20;
const CAR_SENSOR_MAG = 50;
const CAR_FUEL = 300;

const DEBUG = false;
const TOTAL = 100;
const USER_IS_PLAYING = false;
const MUTATION_RATE = 0.1;

let cars = [];
let crashedCars = [];
let track;
let speedSlider;
let generation = 0;
function setup() {
    createCanvas(640, 480);
    tf.setBackend('cpu');
    speedSlider = createSlider(1, 10, 1);

    track = new Track(TRACK_WIDTH, TRACK_SEGMENTS);

    const population = USER_IS_PLAYING ? 1 : TOTAL;
    for (let i = 0; i < population; i++) {
        let car = new Car(
            track.start.x,
            track.start.y,
            CAR_WIDTH,
            CAR_LENGTH,
            CAR_TURN_SPEED,
            CAR_SPEED,
            CAR_SENSOR_MAG
        );
        cars.push(car);
    }
    calculateStartAngle();
}

function calculateStartAngle() {
    let north = createVector(0, -1);
    let firstTrackSegment = p5.Vector.sub(track.innerPoints[1], track.innerPoints[0]);
    for (let car of cars) {
        car.updateAngle(firstTrackSegment.angleBetween(north));
    }
}

function draw() {
    for (let n = 0; n < speedSlider.value(); n++) {
        let allCrashed = cars.length == 0;

        if (USER_IS_PLAYING && ! allCrashed) {
            let car = cars[0];
            if (keyIsDown(UP_ARROW)) {
                car.gas();
            }
            if (keyIsDown(LEFT_ARROW)) {
                car.turnLeft();
            }
            if (keyIsDown(RIGHT_ARROW)) {
                car.turnRight();
            }
        }


        if (! USER_IS_PLAYING && allCrashed) {
            nextGeneration();
        }

        for (let i = cars.length - 1; i >= 0; i--) {
            let car = cars[i];
            car.detectCollision(track);
            car.lookAt(track);
            car.updateFitness(track);

            if (car.crashed) {
                crashedCars.push(cars.splice(i, 1)[0]);
            }

        }

        if (! USER_IS_PLAYING) {
            for (let car of cars) {
                car.gas();
                car.drive();
            }
        }
    }

    background(0);
    track.show();
    if (DEBUG) {
        track.debug();
    }
    for (let car of cars) {
        car.show();
        if (DEBUG) car.debug();
    }
    if (! USER_IS_PLAYING) {
        textSize(17);
        fill(255);
        text("Generation: " + generation, 10, 25);
        text("Alive: " + cars.length + "/" + TOTAL, 10, 52);
        text("Speed: x" + speedSlider.value(), 10, 77);
    }
}
