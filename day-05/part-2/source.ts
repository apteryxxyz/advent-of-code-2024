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

	if (!valid) {
		const fixedUpdate = update.toSorted((a, b) => {
			const rule = relevantRules //
				.find((r) => Bun.deepEquals(r, [a, b]));
			if (rule) {
				const beforeIndex = update.indexOf(a);
				const afterIndex = update.indexOf(b);
				if (beforeIndex > afterIndex) return -1;
				if (beforeIndex < afterIndex) return 1;
			}
			return 0;
		});

		console.log(update, fixedUpdate);

		const middleIndex = Math.floor(fixedUpdate.length / 2);
		total += fixedUpdate[middleIndex];
	}
}

const result = total;
Bun.write('output.txt', String(result));
