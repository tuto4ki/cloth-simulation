import { createProgram } from './common/utilsWG.js';
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
import { Draw, updateColor, drawScene } from './draw.js';
import animationFrame from './simulation.js';

function main () {
  const canvas = document.querySelector('#canvas');
  const gravityCheckbox = document.querySelector('#gravity');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('WebGL don`t work');
  }
  
  gravityCheckbox.checked = true;
  /*
  const draw = new Draw(gl, gravityCheckbox.checked);
  draw.animation();
  */
  const program = createProgram(gl, clothSimulationVertex, clothSimulationFragment);
  gl.useProgram(program);
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  const colorLocation = gl.getAttribLocation(program, 'a_color');
  
  let vertices = initializationVertices();
  let verticesPrev = [...vertices];
  let verticesDraw = initializationVerticesDraw();
  let color = initializationColor();
  const indices = initializationIndices();
  const links = getLinks();
  const attachedVertices = initializationAttached();

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesDraw), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  indexBuffer.numberOfItems = indices.length;

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
  
  const anim = animationFrame(attachedVertices);

  function animation(t) {
    anim(t, vertices, verticesPrev, links, attachedVertices, gravityCheckbox.checked);
    updateColor(vertices, links, color, indices, verticesDraw);
    drawScene(gl, positionLocation, indexBuffer, positionBuffer, verticesDraw, matrixLocation, color, colorBuffer, colorLocation, indices);
    window.requestAnimationFrame(animation);
  }
  animation();
  
}


try {
  main();
} catch (error) {
  console.error(error);
}
