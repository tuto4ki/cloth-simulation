import { STEP, SIZE_CLOTH, GRAVITY } from './constants.js';
import Links from './links.js';

export function initializationVertices () {
  const vertices = [];
  for (let i = 0; i < SIZE_CLOTH; i++) {
    const x = (i + 1) * 1 / STEP;
    for (let j = 0; j < SIZE_CLOTH; j++) {
      const z = (j + 1) * 1 / STEP;
      vertices.push(x, 0, z);
    }
  }

  return vertices;
}

export function initializationIndices () {
  const indices = [];
  for (let i = 0; i < SIZE_CLOTH; i++) {
    if (i % 2 === 0) {
      let j = 0; 
      while (j < SIZE_CLOTH) {
        indices.push(i * SIZE_CLOTH + j);
        j++;
      }
    } else {
      let j = SIZE_CLOTH - 1; 
      while (j >= 0) {
        indices.push(i * SIZE_CLOTH + j);
        j--;
      }
    }
  }
  
  for (let k = 0; k < SIZE_CLOTH - 1; k++) {
    const startIndex = SIZE_CLOTH * k;
    const endIndex = 1 + SIZE_CLOTH + startIndex;
    for (let i = 0; i < SIZE_CLOTH - 1; i++){
      indices.push(i + startIndex, i + endIndex);
    }
  }
  for (let i = 0; i < SIZE_CLOTH; i++) {
    indices.push(SIZE_CLOTH - 1, i);
  }
  return indices;
}

export function getLinks () {
  const links = [];
  for (let i = 0; i < SIZE_CLOTH - 1; i++) {
    const from = i * SIZE_CLOTH;
    const to = from + SIZE_CLOTH;
    for (let j = 0; j < SIZE_CLOTH - 1; j++) {
      links.push(new Links(j + from, j + to));
      links.push(new Links(j + from, j + 1 + to));
      links.push(new Links(j + from, j + 1 + from));
    }
  }
  return links;
}

export function initializationGravity() {
  return new Array(SIZE_CLOTH * 3).fill(GRAVITY);
}
