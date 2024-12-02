import * as Bun from 'bun';

const file = Bun.file('input.txt');
const text = await file.text();

const lines = text.split('\n');

const lists: [number[], number[]] = [[], []];
for (let i = 0; i < lines.length; i++) {
  const [left, right] = lines[i].split('   ').map(Number);
  lists[0].push(left), lists[1].push(right);
}

const sortedLists = lists.map(l => l.sort((a, b) => a - b));

let totalDifference = 0;
for (let i = 0; i < sortedLists[0].length; i++) {
  const leftValue = sortedLists[0][i];
  const rightValue = sortedLists[1][i];
  totalDifference += Math.abs(leftValue - rightValue);
}

const result = totalDifference;
Bun.write('output.txt', result.toString());
