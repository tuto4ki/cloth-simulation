import { K_HOOK } from './constants.js';
export default class Links {
  constructor (p1, p2, distance) {
    this.p1 = p1;
    this.p2 = p2;
    this.distance = distance;
  }

  constraints (vertices, attachedVertices) {
    const { dx, dy, dz, deltaLength } = vertices[this.p1].getDistance(vertices[this.p2]);
  
    const diff = K_HOOK * (deltaLength - this.distance) / deltaLength;
    let k = .5;
    if (attachedVertices.includes(this.p1) || attachedVertices.includes(this.p2)) {
      k = 1;
    }
    if (!attachedVertices.includes(this.p1)) {
      vertices[this.p1].x -= dx * k * diff;
      vertices[this.p1].y -= dy * k * diff;
      vertices[this.p1].z -= dz * k * diff;
    }
    if (!attachedVertices.includes(this.p2)) {
      vertices[this.p2].x += dx * k * diff;
      vertices[this.p2].y += dy * k * diff;
      vertices[this.p2].z += dz * k * diff;
    }
    return vertices;
  }

  getDiffDistance (vertices) {
    const { deltaLength } = vertices[this.p1].getDistance(vertices[this.p2]);
    return this.distance - deltaLength.toFixed(5);
  }
}