export default class Point {
  constructor(x, y, z, id) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = id;
  }

  getDistance(pointTo) {
    const dx = this.x - pointTo.x;
    const dy = this.y - pointTo.y;
    const dz = this.z - pointTo.z;
    const deltaLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return { dx, dy, dz, deltaLength };
  }
}