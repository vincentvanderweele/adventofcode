data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .flatMap((r, y) => r.split('').map((c, x) => ({ c, x, y })))
  .filter(({ c }) => c === '#')
  .map(({ x, y }) => [x, y]);

allNeighbors = [-1, 0, 1]
  .flatMap(dx => [-1, 0, 1].map(dy => [dx, dy]))
  .filter(([dx, dy]) => dx || dy);

directions = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

toMap = positions => {
  const map = positions.reduce((r, [x, y]) => {
    r[`${x},${y}`] = (r[`${x},${y}`] ?? 0) + 1;
    return r;
  }, {});

  const value = ([x, y]) => map[`${x},${y}`];

  const canMove = (position, direction) =>
    [-1, 0, 1]
      .map(d =>
        position.map((p, i) => p + direction[i] + (direction[i] ? 0 : d))
      )
      .every(p => !value(p));

  return { value, canMove };
};

solve = rounds => {
  elves = [...data];

  for (round = 0; round < rounds; round++) {
    elfMap = toMap(elves);

    const d0 = round % directions.length;
    const rotatedDirections = directions
      .slice(d0)
      .concat(directions.slice(0, d0));

    proposedPositions = elves.map(([x, y]) => {
      if (allNeighbors.every(([dx, dy]) => !elfMap.value([x + dx, y + dy]))) {
        // Perfect spot, don't move
        return [x, y];
      }

      const d = rotatedDirections.find(d => elfMap.canMove([x, y], d));
      // No move possible, so don't move
      if (!d) return [x, y];

      // Move in direction d
      return [x + d[0], y + d[1]];
    });

    // Problem 2: check if no elf wants to move
    if (
      elves
        .map((e, i) => [e, proposedPositions[i]])
        .every(([[x0, y0], [x1, y1]]) => x0 === x1 && y0 === y1)
    )
      return round + 1;

    movedMap = toMap(proposedPositions);

    // Update elves that are allowed to move
    elves = elves
      .map((x, i) => [x, proposedPositions[i]])
      .map(([oldPosition, newPosition]) =>
        movedMap.value(newPosition) === 1 ? newPosition : oldPosition
      );
  }

  // Problem 1: get rectangle area
  return (
    [0, 1]
      .map(i => elves.map(e => e[i]))
      .map(e => Math.max(...e) - Math.min(...e) + 1)
      .reduce((p, x) => p * x) - elves.length
  );
};

// Problem 1
solve(10);

// Problem 2
solve(10000);
