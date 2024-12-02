import * as Bun from 'bun';

const file = Bun.file('input.txt');
const text = await file.text();

const lines = text.split('\n');

const lists: [number[], number[]] = [[], []];
for (let i = 0; i < lines.length; i++) {
  const [left, right] = lines[i].split('   ').map(Number);
  lists[0].push(left), lists[1].push(right);
}

const rightDict: Record<number, number> = {};
for (let i = 0; i < lists[1].length; i++) {
  if (!rightDict[lists[1][i]])
    rightDict[lists[1][i]] = 0;
  rightDict[lists[1][i]]++;
}

let similarityScore = 0;
for (let i = 0; i < lists[0].length; i++) {
  const value = lists[0][i], count = rightDict[value] ?? 0;
  similarityScore += value * count;
}

const result = similarityScore;
Bun.write('output.txt', result.toString());
