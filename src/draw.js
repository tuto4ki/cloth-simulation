import { resizeCanvasToDisplaySize } from './common/utils.js';
import m4 from './common/matrix.js';

export default function drawScene(gl, positionLocation, indexBuffer, positionBuffer, vertices, matrixLocation) {
  resizeCanvasToDisplaySize(gl.canvas);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);


//////////////
// Задаём проекционную матрицу
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 2000;
  const projectionMatrix = m4.perspective(20 * Math.PI / 180, aspect, zNear, zFar);
  const radius = 1.5;
  
  // Вычисление матрицы камеры
  let cameraMatrix = m4.multiply(m4.xRotation(150 * Math.PI / 180), m4.yRotation(-30 * Math.PI / 180));
  cameraMatrix = m4.multiply(cameraMatrix, m4.zRotation(-15 * Math.PI / 180));
  cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);
  const viewMatrix = m4.inverse(cameraMatrix);
  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  let matrix = m4.translate(viewProjectionMatrix, 0, 0, 0);
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

//////////////
  

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  // отрисовка примитивов - линий
  gl.drawElements(gl.LINES, indexBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);

  //
  //gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  //gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  //gl.enableVertexAttribArray(colorLocation);
  //gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  //gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
/*
  for (let i = 0; i < sizeCloth; i++) {
    //gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, true, 0, 0);
    gl.drawArrays(gl.LINE_LOOP, i * 9, 9);
  }
  for (let i = 9; i < sizeCloth * 2; i++) {
    gl.drawArrays(gl.LINE_LOOP, i * 9, 9);
  }
  for (let i = sizeCloth * 6; i < sizeCloth * 2; i++) {
    gl.drawArrays(gl.LINE_LOOP, i, 9);
  }*/
}
