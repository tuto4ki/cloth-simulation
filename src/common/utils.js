import m4 from './matrix.js';

function degToRad(degree){
  return degree * Math.PI / 180;
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

export { getMatrixView };