import * as Bun from 'bun';

const file = Bun.file('input.txt');
const text = await file.text();

const reports = text.split('\n').map((l) => l.split(' ').map(Number));

const safeReports = reports.filter(report => {
  if (isReportSafe(report)) return true;
  for (let i = 0; i < report.length; i++) {
    const modifiedReport = report.slice(0, i).concat(report.slice(i + 1));
    if (isReportSafe(modifiedReport)) return true;
  }
});

const result = safeReports.length;
Bun.write('output.txt', result.toString());

//

function isReportSafe(report: number[]) {
  let dir: 'incr' | 'decr' | null = null;
  let prevLevel = report[0];

  for (let i = 1; i < report.length; i++) {
    const currLevel = report[i];

    if (prevLevel === currLevel) return false;
    if (!dir) dir = prevLevel < currLevel ? 'incr' : 'decr';
    if (dir === 'incr' && currLevel < prevLevel) return false;
    if (dir === 'decr' && currLevel > prevLevel) return false;
    if (Math.abs(prevLevel - currLevel) > 3) return false;

    prevLevel = currLevel;
  }

  return true;
}
