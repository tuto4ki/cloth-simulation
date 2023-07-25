const clothSimulationVertex = `
precision mediump float;

varying float v_color;

void main() {
   gl_FragColor = vec4(1, v_color, v_color, 1);
}`;

export default clothSimulationVertex;
