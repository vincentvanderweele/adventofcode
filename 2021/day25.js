input = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .map((x) => x.split(''));
n = [input[0].length, input.length];

right = (xy) =>
  xy
    .split(',')
    .map((c, i) => (parseInt(c) + 1 - i) % n[i])
    .join(',');
down = (xy) =>
  xy
    .split(',')
    .map((c, i) => (parseInt(c) + i) % n[i])
    .join(',');

board = input
  .flatMap((r, y) => r.map((c, x) => [`${x},${y}`, c]))
  .filter(([_, c]) => c !== '.')
  .reduce((r, [x, c]) => {
    r[x] = c;
    return r;
  }, {});

step = 0;
while (step < 10000) {
  toRight = Object.entries(board)
    .filter(([k, v]) => v === '>')
    .filter(([k]) => !board[right(k)]);
  for ([k] of toRight) {
    delete board[k];
    board[right(k)] = '>';
  }

  toDown = Object.entries(board)
    .filter(([k, v]) => v === 'v')
    .filter(([k]) => !board[down(k)]);
  for ([k] of toDown) {
    delete board[k];
    board[down(k)] = 'v';
  }

  steps = toRight.length + toDown.length;

  step++;

  if (!steps) break;
}
step;
