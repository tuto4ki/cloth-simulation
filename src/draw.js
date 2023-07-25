import { resizeCanvasToDisplaySize } from './common/utilsWG.js';
import m4 from './common/matrix.js';
import { degToRad } from './common/utils.js';import { createProgram } from './common/utilsWG.js';
import clothSimulationFragment from './shader/clothSimulationFragment.js';
import clothSimulationVertex from './shader/clothSimulationVertex.js';
import {
  getLinks,
  initializationAttached,
  initializationIndices,
  initializationVertices,
  initializationColor,
  initializationVerticesDraw,
} from './initializations.js';
import animationFrame from './simulation.js';

export class Draw {

  constructor(gl, isGravityCheckbox) {
    this.gl = gl;
    this.isGravity = isGravityCheckbox;

    const program = createProgram(this.gl, clothSimulationVertex, clothSimulationFragment);
    this.gl.useProgram(program);
    this.positionLocation = this.gl.getAttribLocation(program, 'a_position');
    this.matrixLocation = this.gl.getUniformLocation(program, 'u_matrix');
    this.colorLocation = this.gl.getAttribLocation(program, 'a_color');
  
    this.vertices = initializationVertices(); ///
    this.verticesPrev = [...this.vertices]; ///
    this.verticesDraw = initializationVerticesDraw();
    this.color = initializationColor();
    this.indices = initializationIndices();
    this.links = getLinks(); ///
    this.attachedVertices = initializationAttached(); ///

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.verticesDraw), this.gl.STATIC_DRAW);

    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
    this.indexBuffer.numberOfItems = this.indices.length;

    this.colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.color), this.gl.STATIC_DRAW);
  
    //this.animation();
    //this.func();
  }

  animation (time) {
    animationFrame(time, this.vertices, this.verticesPrev, this.links, this.attachedVertices, this.isGravity);

    this.updateColor();//this.vertices, this.links, this.color, this.indices, this.verticesDraw);
    console.log(this.verticesDraw, this.indices, this.color);
    this.drawScene();//this.gl, this.positionLocation, this.indexBuffer, this.positionBuffer, this.verticesDraw, this.matrixLocation, this.color, this.colorBuffer, this.colorLocation, this.indices);
    //window.requestAnimationFrame((time) => this.animation(time));
  }

  drawScene() {
    resizeCanvasToDisplaySize(this.gl.canvas);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const matrix = getMatrixView(aspect);
    this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

    this.gl.enableVertexAttribArray(this.colorLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.color), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.colorLocation, 1, this.gl.FLOAT, false, 0, 0);

    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

    this.gl.drawElements(this.gl.LINES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
  }
  updateColor() {//vertices, links, color, indices, verticesDraw) {
    let max = 0;
    let min = 0;
    let distance = 0;
    for (let i = 0, index = 0, j = 0; i < this.links.length; i++) {
      distance = this.links[i].getDiffDistance(this.vertices);
      max = Math.max(max, distance);
      min = Math.min(min, distance);
  
      const indexFrom = this.links[i].p1 * 3;
      this.verticesDraw[index] = this.vertices[indexFrom];
      this.verticesDraw[index + 1] = this.vertices[indexFrom + 1];
      this.verticesDraw[index + 2] = this.vertices[indexFrom + 2];
      this.indices[j] = j;
      this.color[j] = distance;
      index += 3;
      j++;
    
      const indexTo = this.links[i].p2 * 3;
      this.verticesDraw[index] = this.vertices[indexTo];
      this.verticesDraw[index + 1] = this.vertices[indexTo + 1];
      this.verticesDraw[index + 2] = this.vertices[indexTo + 2];
      this.indices[j] = j;
      this.color[j] = distance;
      index += 3;
      j++;
    }
    const period = (max - min);
    for (let i = 0; i < this.color.length; i++) {
      this.color[i] = Math.abs(min - this.color[i]) / period;
    }
    //return { vertices, links, color, indices, verticesDraw };
  }
}


export function drawScene(
  gl,
  positionLocation,
  indexBuffer,
  positionBuffer,
  vertices,
  matrixLocation,
  color,
  colorBuffer,
  colorLocation,
  indices,
) {
  resizeCanvasToDisplaySize(gl.canvas);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const matrix = getMatrixView(aspect);
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorLocation, 1, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function getMatrixView(aspect) {
  const projectionMatrix = m4.perspective(degToRad(20), aspect, 1, 5);

  const matrixRotationX = m4.xRotation(degToRad(150));
  const matrixRotationY = m4.yRotation(degToRad(-30));
  const matrixRotationZ = m4.zRotation(degToRad(-25));
  let cameraMatrix = m4.multiply(matrixRotationX, matrixRotationY);
  cameraMatrix = m4.multiply(cameraMatrix, matrixRotationZ);
  cameraMatrix = m4.translate(cameraMatrix, 0, 0, 2.5);
  const viewMatrix = m4.inverse(cameraMatrix);

  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  const matrix = m4.translate(viewProjectionMatrix, 0, 0.2, 0);
  return matrix;
}

export function updateColor(vertices, links, color, indices, verticesDraw) {
  let max = 0;
  let min = 0;
  let distance = 0;
  for (let i = 0, index = 0, j = 0; i < links.length; i++) {
    distance = links[i].getDiffDistance(vertices);
    max = Math.max(max, distance);
    min = Math.min(min, distance);

    const indexFrom = links[i].p1 * 3;
    verticesDraw[index] = vertices[indexFrom];
    verticesDraw[index + 1] = vertices[indexFrom + 1];
    verticesDraw[index + 2] = vertices[indexFrom + 2];
    indices[j] = j;
    color[j] = distance;
    index += 3;
    j++;
  
    const indexTo = links[i].p2 * 3;
    verticesDraw[index] = vertices[indexTo];
    verticesDraw[index + 1] = vertices[indexTo + 1];
    verticesDraw[index + 2] = vertices[indexTo + 2];
    indices[j] = j;
    color[j] = distance;
    index += 3;
    j++;
  }
  const period = (max - min);
  for (let i = 0; i < color.length; i++) {
    color[i] = Math.abs(min - color[i]) / period;
  }
  return { vertices, links, color, indices, verticesDraw };
}

function setVerticesDraw(verticesDraw) {

}
