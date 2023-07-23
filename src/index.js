import { createProgram } from './common/utils.js';
import clothSimulationFragment from './shader/clothSimulationFragment.js';
import clothSimulationVertex from './shader/clothSimulationVertex.js';
import { getLinks, initializationAttached, initializationGravity, initializationIndices, initializationVertices } from './initializations.js';
import drawScene from './draw.js';
import animationFrame from './simulation.js';

function main () {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('WebGL don`t work');
  }
  
  
  const program = createProgram(gl, clothSimulationVertex, clothSimulationFragment);
  gl.useProgram(program);
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  gl.enableVertexAttribArray(positionLocation);
  
  
  let vertices = initializationVertices();
  let verticesPrev = [...vertices];
  let gravity = initializationGravity();
  const indices = initializationIndices();
  const links = getLinks();
  const attachedVertices = initializationAttached();

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  indexBuffer.numberOfItems = indices.length;
  
  const anim = animationFrame(vertices, verticesPrev, links, attachedVertices);
  function animation(t) {
    const res = anim(t, vertices, verticesPrev, links, attachedVertices);
    vertices = res.vertices;
    verticesPrev = res.verticesPrev;
    drawScene(gl, positionLocation, indexBuffer, positionBuffer, vertices, matrixLocation);
    window.requestAnimationFrame(animation);
  }
  animation();
}


try {
  main();
} catch (error) {
  console.error(error);
}
