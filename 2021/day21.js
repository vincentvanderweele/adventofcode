readInput = () =>
  document
    .querySelector('pre')
    .firstChild.textContent.split('\n')
    .filter((x) => x)
    .map((x) => parseInt(x[x.length - 1]) - 1);

step = (positions, scores, roll, player) => {
  position = (positions[player] + roll) % 10;
  return [
    positions.map((p, i) => (player === i ? position : p)),
    scores.map((s, i) => (player === i ? s + position + 1 : s)),
    1 - player,
  ];
};

// problem 1
positions = readInput();
scores = [0, 0];
turn = 0;

while (scores.every((s) => s < 1000)) {
  roll = 9 * turn + 6;
  player = turn++ % 2;
  [positions, scores] = step(positions, scores, roll, player);
}
3 * turn * Math.min(...scores);

// problem 2
memo = {};
solve = ([positions, scores = [0, 0], player = 0]) => {
  if (scores.some((s) => s >= 21)) {
    return scores.map((s) => (s >= 21 ? 1 : 0));
  }

  const key = `${positions.join(',')},${scores.join(',')},${player}`;
  if (memo[key]) return memo[key];

  const result = [1, 2, 3]
    .flatMap((x) => [1, 2, 3].flatMap((y) => [1, 2, 3].map((z) => x + y + z)))
    .reduce(
      (sum, roll) =>
        solve(step(positions, scores, roll, player)).map((r, i) => r + sum[i]),
      [0, 0]
    );

  memo[key] = result;
  return result;
};

Math.max(...solve([readInput()]));
