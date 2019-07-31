function nextGeneration() {
  generation++;
  noiseSeed(Math.random() * 10000);
  track = new Track(TRACK_WIDTH, TRACK_SEGMENTS);

  calculateFitness();
  for (let i = 0; i < TOTAL; i++) {
    cars[i] = pickOne();
  }

  for (let i = 0; i < TOTAL; i++) {
    crashedCars[i].dispose();
  }
  crashedCars = [];
  calculateStartAngle();
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - crashedCars[index].fitness;
    index++;
  }
  index--;
  let car = crashedCars[index];
  let child = new Car(
    track.start.x,
    track.start.y,
    CAR_WIDTH,
    CAR_LENGTH,
    CAR_TURN_SPEED,
    CAR_SPEED,
    CAR_SENSOR_MAG,
    car.driver
  );
  child.mutate();
  return child;
}

function calculateFitness() {
  let sum = 0;
  for (let car of crashedCars) {
    sum += car.fitness;
  }

  for (let car of crashedCars) {
    car.fitness = car.fitness / sum;
  }
}