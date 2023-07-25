import { K_HOOK } from './constants.js';
export default class Links {
  constructor(p1, p2, distance) {
    this.p1 = p1;
    this.p2 = p2;
    this.distance = distance;
  }

  constraints(attachedVertices) {
    const { dx, dy, dz, deltaLength } = this.p1.getDistance(this.p2);
  
    const diff = K_HOOK * (deltaLength - this.distance) / deltaLength;
    let k = .5;
    if (attachedVertices.includes(this.p1.id) || attachedVertices.includes(this.p2.id)) {
      k = 1;
    }
    if (!attachedVertices.includes(this.p1.id)) {
      this.p1.x -= dx * k * diff;
      this.p1.y -= dy * k * diff;
      this.p1.z -= dz * k * diff;
    }
    if (!attachedVertices.includes(this.p2.id)) {
      this.p2.x += dx * k * diff;
      this.p2.y += dy * k * diff;
      this.p2.z += dz * k * diff;
    }
  }

  getDiffDistance() {
    const { deltaLength } = this.p1.getDistance(this.p2);
    return this.distance - deltaLength.toFixed(5);
  }
}
