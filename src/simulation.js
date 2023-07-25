import {
  GRAVITY,
  UPDATE_DELTA_TIME,
  LOOP_ALGORITHM,
  PERIOD,
  AMPLITUDE,
  SIZE_CLOTH,
  STEP,
} from './constants.js';
import Point from './point.js';
import Links from './links.js';

export default class SimulationVerlet {
  constructor(isGravity) {
    this.isGravity = isGravity;
    this.vertices = [];
    this.verticesPrev = [];
    this.initializationVertices();
    this.links = [];
    this.initializationLinks();
    this.attachedVertices = this.initializationAttached();
    this.indexFixed = this.attachedVertices[this.attachedVertices.length - 1];
  }

  initializationVertices() {
    for (let i = 0; i < SIZE_CLOTH; i++) {
      const x = (i + 1) * 1 / STEP;
      for (let j = 0; j < SIZE_CLOTH; j++) {
        const z = (j + 1) * 1 / STEP;
        const id = this.vertices.length;
        this.vertices.push(new Point(x, 0, z, id));
        this.verticesPrev.push(new Point(x, 0, z, id));
      }
    }
  }

  initializationLinks() {
    const limit = SIZE_CLOTH - 1;
    const distance = 1 / STEP;
    const gipDistance = Math.sqrt(2 * distance * distance);
    for (let i = 0; i < limit; i++) {
      const from = i * SIZE_CLOTH;
      const to = from + SIZE_CLOTH;
      for (let j = 0; j < limit; j++) {
        this.links.push(
          new Links(
            this.vertices[j + from],
            this.vertices[j + to],
            distance
          ),
          new Links(
            this.vertices[j + from],
            this.vertices[j + 1 + to],
            gipDistance
          ),
          new Links(
            this.vertices[j + from],
            this.vertices[j + 1 + from],
            distance
          )
        );
      }
    }
    const lastIndex = SIZE_CLOTH * limit;
    for (let i = 0; i < limit; i++) {
      this.links.push(
        new Links(
          this.vertices[lastIndex + i],
          this.vertices[lastIndex + i + 1],
          distance
        ),
        new Links(
          this.vertices[limit + SIZE_CLOTH * i],
          this.vertices[limit + SIZE_CLOTH * (i + 1)],
          distance
        )
      );
    }
  }

  initializationAttached() {
    return [
      0,
      SIZE_CLOTH - 1,
      SIZE_CLOTH * (SIZE_CLOTH - 1),
      SIZE_CLOTH * SIZE_CLOTH - 1,
      Math.floor(SIZE_CLOTH * Math.floor(SIZE_CLOTH / 2) + SIZE_CLOTH / 2),
    ];
  }

  animationFrame(time = 0) {
    this.vertices[this.indexFixed].y = AMPLITUDE * Math.sin(time / PERIOD);
    this.particleSystemVerlet(UPDATE_DELTA_TIME);
    this.satisfyConstraints();
  }

  particleSystemVerlet(timeStep) {
    const f = this.isGravity && GRAVITY * timeStep * timeStep;
    for (let i = 0; i < this.vertices.length; i++) {
      if (!this.attachedVertices.includes(i)) {
        const tempX = this.vertices[i].x;
        const tempY = this.vertices[i].y;
        const tempZ = this.vertices[i].z;
        this.vertices[i].x += this.vertices[i].x - this.verticesPrev[i].x;
        this.vertices[i].y += this.vertices[i].y - this.verticesPrev[i].y + f;
        this.vertices[i].z += this.vertices[i].z - this.verticesPrev[i].z;
        this.verticesPrev[i].x = tempX;
        this.verticesPrev[i].y = tempY;
        this.verticesPrev[i].z = tempZ;
      }
    }
  }

  setGravitation(isGravity) {
    this.isGravity = isGravity;
  }

  satisfyConstraints() {
    for (let i = 0; i < LOOP_ALGORITHM; i++) {
      for(let j = 0; j < this.links.length; j++) {
        this.links[j].constraints(this.attachedVertices);
      }
    }
  }
}
