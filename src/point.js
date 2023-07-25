export default class Point {
  constructor(x, y, z, id) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.verticesIndices = [];
    this.id = id;
  }
  addVertices(index) {
    this.verticesIndices.push(index);
  }
}