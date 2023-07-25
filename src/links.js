import { K_HOOK } from './constants.js';
export default class Links {
  constructor (p1, p2, distance) {
    this.p1 = p1;
    this.p2 = p2;
    this.distance = distance;
  }

  constraints (vertices, attachedVertices) {
    const dx = vertices[this.p1].x - vertices[this.p2].x;
    const dy = vertices[this.p1].y - vertices[this.p2].y;
    const dz = vertices[this.p1].z - vertices[this.p2].z;
    const deltaLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
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
    const dx = vertices[this.p1].x - vertices[this.p2].x;
    const dy = vertices[this.p1].y - vertices[this.p2].y;
    const dz = vertices[this.p1].z - vertices[this.p2].z;
    const deltaLength = Math.sqrt(dx * dx + dy * dy + dz * dz).toFixed(5);
    
    return this.distance - deltaLength;
  }
/*
  constraints (vertices, attachedVertices) {
    const indexPoint1X = this.p1 * 3;
    const indexPoint1Y = indexPoint1X + 1;
    const indexPoint1Z = indexPoint1X + 2;
    const indexPoint2X = this.p2 * 3;
    const indexPoint2Y = indexPoint2X + 1;
    const indexPoint2Z = indexPoint2X + 2;

    const dx = vertices[indexPoint1X] - vertices[indexPoint2X];
    const dy = vertices[indexPoint1Y] - vertices[indexPoint2Y];
    const dz = vertices[indexPoint1Z] - vertices[indexPoint2Z];
    const deltaLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    const diff = K_HOOK * (deltaLength - this.distance) / deltaLength;
    let k = .5;
    if (attachedVertices.includes(this.p1) || attachedVertices.includes(this.p2)) {
      k = 1;
    }
    if (!attachedVertices.includes(this.p1)) {
      vertices[indexPoint1X] -= dx * k * diff;
      vertices[indexPoint1Y] -= dy * k * diff;
      vertices[indexPoint1Z] -= dz * k * diff;
    }
    if (!attachedVertices.includes(this.p2)) {
      vertices[indexPoint2X] += dx * k * diff;
      vertices[indexPoint2Y] += dy * k * diff;
      vertices[indexPoint2Z] += dz * k * diff;
    }
    return vertices;
  }

  getDiffDistance (vertices) {
    const indexPoint1X = this.p1 * 3;
    const indexPoint1Y = indexPoint1X + 1;
    const indexPoint1Z = indexPoint1X + 2;
    const indexPoint2X = this.p2 * 3;
    const indexPoint2Y = indexPoint2X + 1;
    const indexPoint2Z = indexPoint2X + 2;

    const dx = vertices[indexPoint1X] - vertices[indexPoint2X];
    const dy = vertices[indexPoint1Y] - vertices[indexPoint2Y];
    const dz = vertices[indexPoint1Z] - vertices[indexPoint2Z];
    const deltaLength = Math.sqrt(dx * dx + dy * dy + dz * dz).toFixed(5);
    
    return this.distance - deltaLength;
  }
  */
}