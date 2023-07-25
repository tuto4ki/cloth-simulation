function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  gl.deleteShader(shader);
  throw new Error('Shader not created');
}

function createProgram(gl, clothSimulationVertex, clothSimulationFragment) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, clothSimulationVertex);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, clothSimulationFragment);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  gl.deleteProgram(program);
  throw new Error('Program not created');
}

function resizeCanvasToDisplaySize(canvas, multiplier = 1) {
  const width  = canvas.clientWidth  * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width ||  canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;
    return true;
  }
  return false;
}

export { createProgram, resizeCanvasToDisplaySize };
