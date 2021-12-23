solve = (rooms) => {
  const hallway = [...Array(11)];
  const n = rooms[0].length;

  const moves = [true, false].flatMap((toHallway) =>
    rooms.flatMap((_, r) =>
      [0, 1, 3, 5, 7, 9, 10].map((h) => ({ toHallway, r, h }))
    )
  );

  const isDone = () =>
    rooms.every((r, i) => r.length === n && r.every((x) => x === i));

  const range = (s, e) => [...Array(e - s)].map((_, i) => s + i);

  const canMove = ({ toHallway, r, h }) => {
    // there is an amphipod to move and it is allowed to move
    if (
      toHallway
        ? !rooms[r].length || rooms[r].every((a) => a === r)
        : hallway[h] !== r || rooms[r].some((a) => a !== r)
    )
      return false;

    // the target spot is free
    if (toHallway ? hallway[h] !== undefined : rooms[r].length === n)
      return false;

    // no one is blocking the way
    return (
      h < 2 * r + 2 ? range(h + 1, 2 * r + 2) : range(2 * r + 2, h)
    ).every((x) => hallway[x] === undefined);
  };

  const cost = ({ toHallway, r, h }) => {
    const c = Math.pow(10, toHallway ? rooms[r][0] : hallway[h]);
    const steps =
      Math.abs(2 * r + 2 - h) + n - rooms[r].length + (toHallway ? 1 : 0);
    return c * steps;
  };

  const doMove = ({ toHallway, r, h }) => {
    if (toHallway) return (hallway[h] = rooms[r].shift());
    rooms[r].unshift(hallway[h]);
    hallway[h] = undefined;
  };

  const undoMove = ({ toHallway, r, h }) =>
    doMove({ toHallway: !toHallway, r, h });

  let min = Number.POSITIVE_INFINITY;
  findMin = (totalCost, depth) => {
    if (totalCost >= min) return;
    if (isDone()) min = totalCost;

    const allowedMoves = moves.filter(canMove);

    // prefer moves that go to a room
    const movesToTry = allowedMoves.every((m) => m.toHallway)
      ? allowedMoves
      : [allowedMoves.find((m) => !m.toHallway)];

    let i = 0;
    for (const move of movesToTry) {
      if (depth <= 1) {
        console.log(
          `${depth === 1 ? '  ' : ''}Trying ${++i} out of ${
            movesToTry.length
          }. Current min: ${min}`
        );
      }

      const moveCost = cost(move);
      doMove(move);
      findMin(totalCost + moveCost, depth + 1);
      undoMove(move);
      if (totalCost >= min) break;
    }
  };

  findMin(0, 0);

  return min;
};

// problem 1
solve([
  [2, 1],
  [1, 2],
  [0, 3],
  [3, 0],
]);

// problem 2
solve([
  [2, 3, 3, 1],
  [1, 2, 1, 2],
  [0, 1, 0, 3],
  [3, 0, 2, 0],
]);
