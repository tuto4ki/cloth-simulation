import { GRAVITY, UPDATE_DELTA_TIME } from './constants.js';

export default function animationFrame(attachedVertices) {
  const index = attachedVertices[attachedVertices.length - 1] * 3 + 1;

  return (fTimeStep, vertices, verticesPrev, links, attachedVertices, isGravity) => {
    if (fTimeStep) {
      vertices[index] = 0.09 * Math.sin(fTimeStep / 200);
      const gravity = isGravity ? GRAVITY : 0;
      ParticleSystemVerlet(vertices, verticesPrev, UPDATE_DELTA_TIME, attachedVertices, gravity);
      
      SatisfyConstraints(vertices, links, attachedVertices);
    }
    return { vertices, verticesPrev };
  };
}

function ParticleSystemVerlet(vertices, verticesPrev, fTimeStep, attachedVertices, gravity) {
  if (!fTimeStep) {
    return;
  }
  const f = gravity * fTimeStep * fTimeStep;
  for (let i = 0; i < vertices.length; i += 3) {
    if (!attachedVertices.includes(i / 3)) {
      const tempX = vertices[i];
      const tempY = vertices[i + 1];
      const tempZ = vertices[i + 2];
      vertices[i] += vertices[i] - verticesPrev[i];
      vertices[i + 1] += vertices[i + 1] - verticesPrev[i + 1] + f;
      vertices[i + 2] += tempZ - verticesPrev[i + 2];
      verticesPrev[i] = tempX;
      verticesPrev[i + 1] = tempY;
      verticesPrev[i + 2] = tempZ;
    }
  }
}

function SatisfyConstraints(vertices, links, attachedVertices) {
  for (let i = 0; i < 20; i++) {
    for(let j = 0; j < links.length; j++) {
      vertices = links[j].constraints(vertices, attachedVertices);
    }
  }
}
