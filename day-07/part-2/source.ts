import * as Bun from 'bun';

//

const operators = ['+', '*', '||'];

function generateExpressions(
  numbers: number[],
  index = 0,
  expression: (string | number)[] = [],
): (string | number)[][] {
  if (index === numbers.length - 1)
    return [[...expression, numbers[index]]];

  return operators.flatMap((operator) => {
    const nextExpression = [...expression, numbers[index], operator];
    return generateExpressions(numbers, index + 1, nextExpression);
  });
}

function evaluateExpression(expression_: (string | number)[]) {
  let total = 0;
  let operator = '+';
  for (let i = 0; i < expression_.length; i++) {
    const item = expression_[i];
    if (typeof item === 'number') {
      if (operator === '+') total += item;
      if (operator === '*') total *= item;
      if (operator === '||') total = Number(String(total) + String(item));
    } else {
      operator = item;
    }
  }

  return total;
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

let total = 0;
for (let i = 0; i < equations.length; i++) {
  const { numbers, equals } = equations[i];

  console.log('Doing', i + 1, 'of', equations.length);

  const expressions = generateExpressions(numbers);
  const results = expressions.map(evaluateExpression);

  if (results.includes(equals)) total += equals;
}

const result = total;
Bun.write('output.txt', String(result));