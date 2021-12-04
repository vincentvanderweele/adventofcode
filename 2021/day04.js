data = document.querySelector('pre').firstChild.textContent.split('\n\n');

numbers = data[0].split(',').map((x) => parseInt(x));
boards = data.slice(1).map((x) =>
  x
    .split('\n')
    .filter((x) => x)
    .map((y) =>
      y
        .trim()
        .split(/\s+/)
        .map((z) => parseInt(z))
    )
);

transpose = (b) =>
  b.reduce((r, x) => x.map((y, i) => [...(r[i] || []), y]), []);

rounds = boards
  .flatMap((board, boardIndex) => [
    ...board.map((row) => ({ boardIndex, row })),
    ...transpose(board).map((row) => ({ boardIndex, row })),
  ])
  .map(({ boardIndex, row }) => {
    set = new Set(row);
    for (round = 0; round < numbers.length; round++) {
      set.delete(numbers[round]);
      if (set.size === 0) break;
    }
    return { boardIndex, round };
  })
  .sort((x, y) => x.round - y.round);

computeScore = ({ boardIndex, round }) => {
  unmarked = new Set(boards[boardIndex].flatMap((x) => x));
  for (i = 0; i <= round; i++) unmarked.delete(numbers[i]);
  return [...unmarked].reduce((s, e) => s + e, 0) * numbers[round];
};

// problem 1
computeScore(rounds[0]);

// problem 2
losingBoards = new Set(boards.map((_, i) => i));
i = 0;
while (losingBoards.size > 0) losingBoards.delete(rounds[i++].boardIndex);
computeScore(rounds[i-1]);
