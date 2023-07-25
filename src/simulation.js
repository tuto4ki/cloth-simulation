import {
  GRAVITY,
  UPDATE_DELTA_TIME,
  LOOP_ALGORITHM,
  PERIOD,
  AMPLITUDE,
} from './constants.js';
import {
  getLinks,
  initializationAttached,
  initializationVertices,
} from './initializations.js';

export class SimulationVerlet {
  constructor(isGravity) {
    this.isGravity = isGravity;
    this.vertices = initializationVertices();
    this.verticesPrev = initializationVertices();
    this.links = getLinks();
    this.attachedVertices = initializationAttached();
    this.indexFixed = this.attachedVertices[this.attachedVertices.length - 1];
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
  /*
  particleSystemVerlet(timeStep) {
    const f = this.isGravity && GRAVITY * timeStep * timeStep;
    const limit = this.vertices.length - 2;
    for (let i = 0; i < limit; i += 3) {
      if (!this.attachedVertices.includes(i / 3)) {
        const tempX = this.vertices[i];
        const tempY = this.vertices[i + 1];
        const tempZ = this.vertices[i + 2];
        this.vertices[i] += this.vertices[i] - this.verticesPrev[i];
        this.vertices[i + 1] += this.vertices[i + 1] - this.verticesPrev[i + 1] + f;
        this.vertices[i + 2] += this.vertices[i + 2] - this.verticesPrev[i + 2];
        this.verticesPrev[i] = tempX;
        this.verticesPrev[i + 1] = tempY;
        this.verticesPrev[i + 2] = tempZ;
      }
    }
  }
*/
  setGravitation(isGravity) {
    this.isGravity = isGravity;
  }

  satisfyConstraints() {
    for (let i = 0; i < LOOP_ALGORITHM; i++) {
      for(let j = 0; j < this.links.length; j++) {
        this.links[j].constraints(this.vertices, this.attachedVertices);
      }
    }
  }
}
