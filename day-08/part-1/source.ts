import * as Bun from 'bun';

//

type Matrix<T> = T[][];
type Position = { x: number; y: number };

function findAntennas(grid: Matrix<string>) {
  const antennas = new Map<string, Position[]>();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const value = grid[y][x];
      if (value !== '.') {
        if (!antennas.has(value)) antennas.set(value, []);
        antennas.get(value)?.push({ x, y });
      }
    }
  }
  return antennas;
}

function isInBounds(grid: Matrix<string>, position: Position) {
  return position.y >= 0 && position.y < grid.length && position.x >= 0 && position.x < grid[position.y].length;
}

function resolveNodes(positions: Position[]) {
  const pairs: [Position, Position][] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      pairs.push([positions[i], positions[j]]);
    }
  }
  
  const nodes: Position[] = [];
  for (const [a, b] of pairs) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    
    nodes.push({ x: a.x - dx, y: a.y - dy });
    nodes.push({ x: b.x + dx, y: b.y + dy });
  }

  return nodes;
}

//

const file = Bun.file('input.txt');
const text = await file.text();

const antennasGrid = text.split('\n').map((l) => l.split(''));
const antennas = findAntennas(antennasGrid);

const nodesGrid = antennasGrid.map((l) => l.map(() => '.'));
const nodes = antennas.values().toArray().flatMap(resolveNodes);
for (const n of nodes) if (isInBounds(nodesGrid, n)) nodesGrid[n.y][n.x] = '#';

let total = 0;
for (let y = 0; y < nodesGrid.length; y++) {
  for (let x = 0; x < nodesGrid[y].length; x++) {
    if (nodesGrid[y][x] === '#') total++;
  }
}

const result = total;
Bun.write('output.txt', String(result));