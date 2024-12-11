import * as Bun from 'bun';

//

const word = 'XMAS';
const wordLetters = word.split('');

type Matrix = string[][];
type Position = { x: number, y: number };
const directions  = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
type Direction = typeof directions[number];

function searchAround(matrix: Matrix, position: Position) {
  return directions.reduce<number>((acc, direction) => {
    return acc + (searchInDirection(matrix, position, direction) ? 1 : 0);
  }, 0);
}

function searchInDirection(matrix: Matrix, position: Position, direction: Direction, wordIndex = 0) {
  // found the word
  if (wordIndex === wordLetters.length) return true;
  // out of bounds
  if (position.x < 0 || position.x >= matrix[0].length || position.y < 0 || position.y >= matrix.length) return false;
  // not the right letter
  if (matrix[position.y][position.x] !== wordLetters[wordIndex]) return false;

  const nextPosition = movePointer({ ...position }, direction);
  return searchInDirection(matrix, nextPosition, direction, wordIndex + 1);
}   

function movePointer(position: Position, direction: Direction) {
  switch (direction) {
    case 'N':
      position.y -= 1;
      break;
    case 'NE':
      position.x += 1;
      position.y -= 1;
      break;
    case 'E':
      position.x += 1;
      break;
    case 'SE':
      position.x += 1;
      position.y += 1;
      break;
    case 'S':
      position.y += 1;
      break;
    case 'SW':
      position.x -= 1;
      position.y += 1;
      break;
    case 'W':
      position.x -= 1;
      break;
    case 'NW':
      position.x -= 1;
      position.y -= 1;
      break;
  }
  return position;
}

//

const file = Bun.file('input.txt');
const text = await file.text();

const matrix = text.split('\n').map(r => r.split(''));

let foundCount = 0;
for (let y = 0; y < matrix.length; y++) {
  for (let x = 0; x < matrix[0].length; x++) {
    foundCount += searchAround(matrix, { x, y });
  }
}

const result = foundCount;
Bun.write('output.txt', result.toString());

