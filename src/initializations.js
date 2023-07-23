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
  const limit = SIZE_CLOTH - 1;
  for (let i = 0; i < limit; i++) {
    const from = i * SIZE_CLOTH;
    const to = from + SIZE_CLOTH;
    
    for (let j = 0; j < limit; j++) {
      indices.push(j + from, j + to);
      indices.push(j + from, j + 1 + to);
      indices.push(j + from, j + 1 + from);
    }
  }
  const lastIndex = SIZE_CLOTH * limit;
  for (let i = 0; i < limit; i++) {
    indices.push(lastIndex + i, lastIndex + i + 1);
    indices.push(limit + SIZE_CLOTH * i, limit + SIZE_CLOTH * (i + 1));
  }
  return indices;
}

export function getLinks () {
  const links = [];
  for (let i = 0; i < SIZE_CLOTH - 1; i++) {
    const from = i * SIZE_CLOTH;
    const to = from + SIZE_CLOTH;
    for (let j = 0; j < SIZE_CLOTH - 1; j++) {
      const distance = 1 / STEP;
      const gipDistance = Math.sqrt(2 * distance * distance);
      links.push(new Links(j + from, j + to, distance));
      links.push(new Links(j + from, j + 1 + to, gipDistance));
      links.push(new Links(j + from, j + 1 + from, distance));
    }
  }
  return links;
}

export function initializationGravity() {
  return new Array(SIZE_CLOTH * 3).fill(GRAVITY);
}

export function initializationAttached() {
  return [
    0,
    SIZE_CLOTH - 1,
    SIZE_CLOTH * (SIZE_CLOTH - 1),
    SIZE_CLOTH * SIZE_CLOTH - 1,
    Math.floor(SIZE_CLOTH * Math.floor(SIZE_CLOTH / 2) + SIZE_CLOTH / 2),
  ];

}