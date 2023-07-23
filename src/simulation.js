import { STEP } from './constants.js';

export default function animationFrame(vertices, verticesPrev, links, attachedVertices) {
  const index = attachedVertices[attachedVertices.length - 1] * 3 + 1;

  return (fTimeStep, vertices, verticesPrev, links, attachedVertices) => {
    if (fTimeStep) {
      //vertices[index-1] = 0.1 * Math.sin(fTimeStep / 500);
      vertices[index] = 0.1 * Math.sin(fTimeStep / 500);
      //vertices[index+1] = 0.1 * Math.sin(fTimeStep / 500);
      ParticleSystemVerlet(vertices, verticesPrev, .016, attachedVertices);
      
      SatisfyConstraints(vertices, links, attachedVertices);
    }
    return { vertices, verticesPrev };
  };
}

function ParticleSystemVerlet(vertices, verticesPrev, fTimeStep, attachedVertices) {
  if (!fTimeStep) {
    return;
  }
  const numVertices = vertices.length;
  for (let i = 0; i < numVertices; i += 3) {
    if (!attachedVertices.includes(i / 3)) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const z = vertices[i + 2];
      const tempX = x;
      const tempY = y;
      const tempZ = z;
      const oldX = verticesPrev[i];
      const oldY = verticesPrev[i + 1];
      const oldZ = verticesPrev[i + 2];
      const a = .01;
      //vertices[i] += x - oldX + a * fTimeStep * fTimeStep;
      vertices[i + 1] += y - oldY + a * fTimeStep * fTimeStep;
      //vertices[i + 2] += z - oldZ + a * fTimeStep * fTimeStep;
      //verticesPrev[i] = tempX;
      verticesPrev[i + 1] = tempY;
      //verticesPrev[i + 2] = tempZ;
    }
  }
}

function SatisfyConstraints(vertices, links, attachedVertices) {
  for(let i = 0; i < 5; i++) {
    
    for(let j = 3; j < links.length; j++) {
      const indexPoint1 = links[j].p1 * 3;
      const indexPoint2 = links[j].p2 * 3;

      const dx = vertices[indexPoint1] - vertices[indexPoint2];
      const dy = vertices[indexPoint1 + 1] - vertices[indexPoint2 + 1];
      const dz = vertices[indexPoint1 + 2] - vertices[indexPoint2 + 2];
      const deltaLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      const diff = (deltaLength - links[j].distance) / deltaLength;
      let k = 0.5;
      if (attachedVertices.includes(links[j].p1) || attachedVertices.includes(links[j].p2)) {
        k = 1.0;
      } else {
        k = 0.5;
      }
      if (!attachedVertices.includes(links[j].p1)) {
        vertices[indexPoint1] -= dx * k * diff;
        vertices[indexPoint1 + 1] -= dy * k * diff;
        vertices[indexPoint1 + 2] -= dz * k * diff;
      }
      if (!attachedVertices.includes(links[j].p2)) {
        vertices[indexPoint2] += dx * k * diff;
        vertices[indexPoint2 + 1] += dy * k * diff;
        vertices[indexPoint2 + 2] += dz * k * diff;
      }
    }
    
  }
}
