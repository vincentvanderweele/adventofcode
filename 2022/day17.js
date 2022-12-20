moves = document.querySelector('pre').firstChild.data.slice(0, -1);
doubleMoves = `${moves}${moves}`;

blocks = [
  {
    width: 4,
    rows: [0b11110000],
  },
  {
    width: 3,
    rows: [0b01000000, 0b11100000, 0b01000000],
  },
  {
    width: 3,
    rows: [0b11100000, 0b00100000, 0b00100000],
  },
  {
    width: 1,
    rows: [0b10000000, 0b10000000, 0b10000000, 0b10000000],
  },
  {
    width: 2,
    rows: [0b11000000, 0b11000000],
  },
];

// This grid uses bitmasks to represent each row and only keeps the
// last 100 rows in active memory. The block size is there to limit
// data allocation.
// It turned out none of that is necessary...
newGrid = () => {
  const blockSize = 100000;

  const grid = {
    data: Array(blockSize + 100),
    height: 0,
    offset: 0,
    addBlock: (block, x, y) => {
      grid.height = Math.max(grid.height, y + block.rows.length - 1);

      for (let i = 0; i < block.rows[i]; i++)
        grid.data[y + i - grid.offset] |= block.rows[i] >> x;

      if (grid.height - grid.offset > blockSize + 90) {
        grid.data = grid.data.slice(blockSize).concat(Array(blockSize));
        grid.offset += blockSize;
      }
    },
    isOccupied: (block, x, y) =>
      y <= grid.height &&
      block.rows.some((row, i) => grid.data[y + i - grid.offset] & (row >> x)),
  };

  return grid;
};

// There are always 4 horizontal moves and 3 vertical moves before reaching
// the top of the tower. So make those 4 horizontal moves in one go and
// simply start 3 rows lower.
// It turned out this optimization was not necessary at all.
getX = (i, width) => {
  const segment = doubleMoves.slice(i, i + 4);

  switch (segment) {
    case '<<<<':
    case '<<><':
    case '<><<':
    case '><<<':
      return 0;
    case '<<<>':
      return 1;
    case '<<>>':
    case '<><>':
    case '<>><':
    case '><<>':
    case '><><':
      return 2;
    case '<>>>':
    case '><>>':
    case '>><>':
      return width === 4 ? 3 : 4;
    case '>><<':
      return width === 4 ? 1 : 2;
    case '>>><':
      return width === 1 ? 4 : 6 - width;
    case '>>>>':
      return 7 - width;
  }
};

solve = n => {
  grid = newGrid();
  i = 0;
  for (let round = 0; round < n; round++) {
    const block = blocks[round % blocks.length];

    let y = grid.height + 1;
    let x = getX(i, block.width);

    i = (i + 4) % moves.length;

    while (y > 1 && !grid.isOccupied(block, x, y - 1)) {
      y--;

      const m = moves[i];
      i = (i + 1) % moves.length;

      if (m === '<' && x > 0 && !grid.isOccupied(block, x - 1, y)) x--;
      else if (
        m === '>' &&
        x < 7 - block.width &&
        !grid.isOccupied(block, x + 1, y)
      )
        x++;
    }

    grid.addBlock(block, x, y);
  }
  return grid.height;
};

// problem 1
solve(2022);

// problem 2
// I derived these values by adding logging to the solve method.
// Not interested in writing an algorithm to compute them...

// First round for which `grid.data[grid.height] === 0x11111110`
round0 = 377;

// Difference between first and second round for which
// `grid.data[grid.height] === 0x11111110` and the values
// for `block` and `i` are the same.
dRound = 1715;

// Difference in height between `round0` and `round0 + dRound`
dHeight = 2616;

N = 1000000000000;
Math.floor((N - round0) / dRound) * dHeight +
  solve(round0 + ((N - round0) % dRound));
