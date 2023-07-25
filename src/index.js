import Draw from './draw.js';
import SimulationVerlet from './simulation.js';


function main () {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('WebGL don`t work');
  }

  const gravityCheckbox = document.querySelector('#gravity');
  gravityCheckbox.checked = true;
  gravityCheckbox.addEventListener('change', (e) => {
    simulationVerlet.setGravitation(e.target.checked);
  });
  
  const draw = new Draw(gl);
  const simulationVerlet = new SimulationVerlet(gravityCheckbox.checked);

  animation();

  function animation(time) {
    simulationVerlet.animationFrame(time);
    draw.updateColor(simulationVerlet.links);
    draw.drawScene();
    window.requestAnimationFrame(animation);
  }
}

try {
  main();
} catch (error) {
  console.error(error);
}
