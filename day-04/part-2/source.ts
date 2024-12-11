import * as Bun from 'bun';

//

type Matrix = string[][];
type Position = { x: number, y: number };

function searchAround(matrix: Matrix, position: Position) {
  const letter = matrix[position.y][position.x];
  if (letter !== 'A') return false;

  const possiblePaths = [
    // top left to bottom right
    [{ x: position.x - 1, y: position.y - 1 }, { x: position.x + 1, y: position.y + 1 }],
    // top right to bottom left
    [{ x: position.x + 1, y: position.y - 1 }, { x: position.x - 1, y: position.y + 1 }],
  ];

  return possiblePaths.every(([from, to]) => searchFromTo(matrix, from, to));
}

function searchFromTo(matrix: Matrix, from: Position, to: Position, visited = false) {
  const fromLetter = matrix[from.y]?.[from.x];
  const toLetter = matrix[to.y]?.[to.x];
  if (!fromLetter || !toLetter) return false;

  if (fromLetter === 'M' && toLetter === 'S') return true;
  if (fromLetter === 'S' && toLetter === 'M') return true;
  
  if (visited) return false;
  // try inverse
  return searchFromTo(matrix, to, from, true);
}

//

const file = Bun.file('input.txt');
const text = await file.text();

const matrix = text.split('\n').map(r => r.split(''));

let foundCount = 0;
for (let y = 0; y < matrix.length; y++) {
  for (let x = 0; x < matrix[0].length; x++) {
    if (searchAround(matrix, { x, y })) foundCount++;
  }
}

const result = foundCount;
Bun.write('output.txt', result.toString());
