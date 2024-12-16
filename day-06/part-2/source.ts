import * as Bun from 'bun';

//

type Matrix = string[][];
type Direction = 'N' | 'S' | 'W' | 'E';
type Position = { x: number; y: number; };
type Location = { position: Position; direction: Direction; };

function findGuardLocation(matrix: Matrix): Location | undefined {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const v = matrix[y][x];
      if (v === '^') return { position: { x, y }, direction: 'N' };
      if (v === 'v') return { position: { x, y }, direction: 'S' };
      if (v === '<') return { position: { x, y }, direction: 'W' };
      if (v === '>') return { position: { x, y }, direction: 'E' };
    }
  }
}

function getAheadPosition({ position: { x, y }, direction }: Location) {
  if (direction === 'N') return { x: x, y: y - 1 };
  if (direction === 'S') return { x: x, y: y + 1 };
  if (direction === 'W') return { x: x - 1, y: y };
  if (direction === 'E') return { x: x + 1, y: y };
  throw new Error('Invalid direction');
}

function isOutOfBounds(matrix: Matrix, { x, y }: Position) {
  return x < 0 || x >= matrix[0].length || y < 0 || y >= matrix.length;
}

function turnRight(direction: Direction): Direction {
  if (direction === 'N') return 'E';
  if (direction === 'S') return 'W';
  if (direction === 'W') return 'N';
  if (direction === 'E') return 'S';
  throw new Error('Invalid direction');
}

function doesLoopWithAdditionalObstacle(matrix: Matrix, position: Position, maxSteps: number) {
  matrix[position.y][position.x] = 'O';

  const guard = findGuardLocation(matrix);
  let steps = 0;

  while (guard && steps < maxSteps) {
    matrix[guard.position.y][guard.position.x] = 'X';

    const nextPosition = getAheadPosition(guard);

    if (isOutOfBounds(matrix, nextPosition)) break;

    const value = matrix[nextPosition.y][nextPosition.x];
    if (value === '.' || value === 'X') {
      guard.position = nextPosition;
      steps++;
    } else if (value === '#' || value === 'O') {
      guard.direction = turnRight(guard.direction);
    }
  }

  return steps >= maxSteps;
}

//

const file = Bun.file('input.txt');
const text = await file.text();

const matrix = text.split('\n').map((r) => r.split(''));
const maxSteps = matrix.flat().length;

let found = 0;
for (let y = 0; y < matrix.length; y++) {
  for (let x = 0; x < matrix[y].length; x++) {
    if (matrix[y][x] === '.') {
      const position = { x, y };
      const matrixCopy = structuredClone(matrix);
      const doesLoop = doesLoopWithAdditionalObstacle(matrixCopy, position, maxSteps);
      if (doesLoop) found++;
    }
  }
}

const result = found;
Bun.write('output.txt', String(result));
