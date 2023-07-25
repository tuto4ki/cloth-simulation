const clothSimulationVertex = `
attribute vec4 a_position;
attribute float a_color;

uniform mat4 u_matrix;

varying float v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}`;

export default clothSimulationVertex;
