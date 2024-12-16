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

function getGuardNextPosition({ position, direction }: Location) {
  const { x, y } = position;
  if (direction === 'N') return { x, y: y - 1 };
  if (direction === 'S') return { x, y: y + 1 };
  if (direction === 'W') return { x: x - 1, y };
  if (direction === 'E') return { x: x + 1, y };
  throw new Error('Invalid direction');
}

function turnRight(direction: Direction): Direction {
  if (direction === 'N') return 'E';
  if (direction === 'S') return 'W';
  if (direction === 'W') return 'N';
  if (direction === 'E') return 'S';
  throw new Error('Invalid direction');
}

function getCellValue(matrix: Matrix, { x, y }: Position) {
  return matrix[y][x];
}

function isOutOfBounds(matrix: Matrix, { x, y }: Position) {
  return x < 0 || x >= matrix[0].length || y < 0 || y >= matrix.length;
}

function countTrails(matrix: Matrix) {
  return matrix.reduce((a, r) => a + r.filter(c => c === 'X').length, 0);
}

//

const file = Bun.file('input.txt');
const text = await file.text();
const matrix = text.split('\n').map((r) => r.split(''));

let guard = findGuardLocation(matrix);
while (guard) {
  const { position } = guard;
  matrix[position.y][position.x] = 'X';
  const nextPosition = getGuardNextPosition(guard);
  
  if (isOutOfBounds(matrix, nextPosition)) {
    guard = undefined;
    break;
  }

  const value = getCellValue(matrix, nextPosition);
  if (value === '.' || value === 'X') {
    guard = { position: nextPosition, direction: guard.direction };
  } else if (value === '#') {
    guard = { position, direction: turnRight(guard.direction) };
  }
}

const result = countTrails(matrix);
Bun.write('output.txt', String(result));
