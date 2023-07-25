import { resizeCanvasToDisplaySize } from './common/utilsWG.js';
import m4 from './common/matrix.js';
import { degToRad } from './common/utils.js';
import { createProgram } from './common/utilsWG.js';
import clothSimulationFragment from './shader/clothSimulationFragment.js';
import clothSimulationVertex from './shader/clothSimulationVertex.js';
import { STEP, SIZE_CLOTH } from './constants.js';

export class Draw {

  constructor(gl) {
    this.gl = gl;

    const program = createProgram(this.gl, clothSimulationVertex, clothSimulationFragment);
    this.gl.useProgram(program);
    this.positionLocation = this.gl.getAttribLocation(program, 'a_position');
    this.matrixLocation = this.gl.getUniformLocation(program, 'u_matrix');
    this.colorLocation = this.gl.getAttribLocation(program, 'a_color');
  
    this.verticesDraw = this.initializationVerticesDraw();
    this.color = this.initializationColor();
    this.indices = this.initializationIndices();

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.verticesDraw), this.gl.STATIC_DRAW);

    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

    this.colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.color), this.gl.STATIC_DRAW);
  }

  initializationVerticesDraw () {
    const length = this.getSize();
    return new Array(length * 3);
  }
  
  initializationIndices () {
    const length = this.getSize();
    return new Array(length);
  }

  initializationColor() {
    const size = SIZE_CLOTH - 1;
    const length = size * size * 6 + size * 4;
    return new Array(length).fill(.0);
  }
  
  getSize() {
    const size = SIZE_CLOTH - 1;
    return size * size * 6 + size * 4;
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
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.verticesDraw), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

    this.gl.drawElements(this.gl.LINES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
  }

  updateColor(vertices, links) {
    let max = 0;
    let min = 0;
    let distance = 0;
    for (let i = 0, index = 0, j = 0; i < links.length; i++) {
      distance = links[i].getDiffDistance(vertices);
      max = Math.max(max, distance);
      min = Math.min(min, distance);
  
      const indexFrom = links[i].p1;
      this.verticesDraw[index] = vertices[indexFrom].x;
      this.verticesDraw[index + 1] = vertices[indexFrom].y;
      this.verticesDraw[index + 2] = vertices[indexFrom].z;
      this.indices[j] = j;
      this.color[j] = distance;
      index += 3;
      j++;
    
      const indexTo = links[i].p2;
      this.verticesDraw[index] = vertices[indexTo].x;
      this.verticesDraw[index + 1] = vertices[indexTo].y;
      this.verticesDraw[index + 2] = vertices[indexTo].z;
      this.indices[j] = j;
      this.color[j] = distance;
      index += 3;
      j++;
    }
    const period = (max - min);
    for (let i = 0; i < this.color.length; i++) {
      this.color[i] = Math.abs(min - this.color[i]) / period;
    }
  }
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
