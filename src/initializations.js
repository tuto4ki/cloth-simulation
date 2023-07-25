import { STEP, SIZE_CLOTH } from './constants.js';
import Links from './links.js';
import Point from './point.js';

function initializationVertices () {
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

function initializationVerticesDraw () {
  const length = getSize();
  return new Array(length * 3);
}

function initializationIndices () {
  const length = getSize();
  return new Array(length);
}

function getLinks () {
  const links = [];
  const limit = SIZE_CLOTH - 1;
  const distance = 1 / STEP;
  const gipDistance = Math.sqrt(2 * distance * distance);
  for (let i = 0; i < limit; i++) {
    const from = i * SIZE_CLOTH;
    const to = from + SIZE_CLOTH;
    for (let j = 0; j < limit; j++) {
      links.push(new Links(j + from, j + to, distance));
      links.push(new Links(j + from, j + 1 + to, gipDistance));
      links.push(new Links(j + from, j + 1 + from, distance));
    }
  }
  const lastIndex = SIZE_CLOTH * limit;
  for (let i = 0; i < limit; i++) {
    links.push(new Links(lastIndex + i, lastIndex + i + 1, distance));
    links.push(new Links(limit + SIZE_CLOTH * i, limit + SIZE_CLOTH * (i + 1), distance));
  }
  return links;
}

function initializationAttached() {
  return [
    0,
    SIZE_CLOTH - 1,
    SIZE_CLOTH * (SIZE_CLOTH - 1),
    SIZE_CLOTH * SIZE_CLOTH - 1,
    Math.floor(SIZE_CLOTH * Math.floor(SIZE_CLOTH / 2) + SIZE_CLOTH / 2),
  ];
}

function initializationColor() {
  const size = SIZE_CLOTH - 1;
  const length = size * size * 6 + size * 4;
  return new Array(length).fill(.0);
}

function getSize() {
  const size = SIZE_CLOTH - 1;
  return size * size * 6 + size * 4;
}

export {
  initializationColor,
  initializationAttached,
  getLinks,
  initializationIndices,
  initializationVertices,
  initializationVerticesDraw,
};