import * as Bun from 'bun';

const file = Bun.file('input.txt');
const text = await file.text();

const regex = /mul\(\d{1,3},\d{1,3}\)|don\'t\(\)|do\(\)/g;
const instructions = text.match(regex) ?? [];

let enabled = true;
const multiples = [];
for (let i = 0; i < instructions.length; i++) {
  const instruction = instructions[i];
  if (instruction === 'don\'t()') {
    enabled = false;
  } else if (instruction === 'do()') {
    enabled = true;
  } else if (enabled) {
    const [a, b] = instruction.slice(4, -1).split(',').map(Number);
    multiples.push({ a, b });
  }
}

const summed = multiples.reduce((acc, { a, b }) => acc + a * b, 0);

const result = summed;
Bun.write('output.txt', result.toString());