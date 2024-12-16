import * as Bun from 'bun';

//

function generateCombinations(
  numbers: number[],
  operators: string[],
  index = 0,
  items: (string | number)[] = [],
): (string | number)[][] {
  if (index === numbers.length - 1)
    return [[...items, numbers[index]]];

  return operators.flatMap((operator) => {
    const nextItems = [...items, numbers[index], operator];
    return generateCombinations(numbers, operators, index + 1, nextItems);
  });
}

//

const file = Bun.file('input.txt');
const text = await file.text();
const lines = text.split('\n');

const equations = lines.map((line) => {
  const [left, right] = line.split(': ');
  return {
    numbers: right.split(' ').map(Number),
    equals: Number(left),
  };
});

const operators = ['+', '*'];

let total = 0;
for (let i = 0; i < equations.length; i++) {
  const { numbers, equals } = equations[i];

  const expressions = generateCombinations(numbers, operators);

  const results = expressions.map((items) => {
    let total = 0;
    let operator = '+';
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (typeof item === 'number') {
        if (operator === '+') total += item;
        if (operator === '*') total *= item;
      } else {
        operator = item;
      }
    }
    return total;
  });

  if (results.includes(equals)) total += equals;
}

const result = total;
Bun.write('output.txt', String(result));