import * as Bun from 'bun';

const file = Bun.file('input.txt');
const text = await file.text();

const regex = /mul\(\d{1,3},\d{1,3}\)/g;
const instructions = text.match(regex) ?? [];

const multiples = instructions.map((i) => {
  const [a, b] = i.slice(4, -1).split(',').map(Number);
  return { a, b };
});

const summed = multiples.reduce((acc, { a, b }) => acc + a * b, 0);

const result = summed;
Bun.write('output.txt', result.toString());

