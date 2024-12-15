import * as Bun from 'bun';

const file = Bun.file('input.txt');
const text = await file.text();

const [rulesText, updatesText] = text.split('\n\n');
const rules = rulesText.split('\n').map((r) => r.split('|').map(Number));
const updates = updatesText.split('\n').map((u) => u.split(',').map(Number));

let total = 0;
for (const update of updates) {
	const relevantRules = rules //
  .filter((r) => r.every((n) => update.includes(n)));

	let valid = true;
	for (const rule of relevantRules) {
		const [before, after] = rule;
		const beforeIndex = update.indexOf(before);
		const afterIndex = update.indexOf(after);
		if (beforeIndex > afterIndex) valid = false;
	}

	if (valid) {
		const middleIndex = Math.floor(update.length / 2);
		total += update[middleIndex];
	}
}

const result = total;
Bun.write('output.txt', String(result));
