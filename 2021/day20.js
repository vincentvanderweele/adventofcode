[[enhancement], image] = document
  .querySelector('pre')
  .firstChild.textContent.split('\n\n')
  .map((x) =>
    x
      .split('\n')
      .filter((x) => x)
      .map((x) => x.split('').map((x) => (x === '#' ? 1 : 0)))
  );

pixels = new Set(
  image
    .flatMap((r, y) => r.map((p, x) => [p, x, y]))
    .filter(([p]) => p)
    .map(([, x, y]) => `${x},${y}`)
);

neighbors = (xy) => {
  [x, y] = xy.split(',').map((z) => parseInt(z));
  return [-1, 0, 1].flatMap((dy) =>
    [-1, 0, 1].map((dx) => `${x + dx},${y + dy}`)
  );
};

// enhancement[0] === 1 and enhancement[511] === 0, so the infinite grid
// switches between all 0 to all 1 in every step. This function computes
// all pixels that are not the majority value, from the previous set of
// pixels. Parameter i (0 or 1) is the target value for the new pixels.
step = (pixels, i) =>
  new Set(
    [...new Set([...pixels].flatMap(neighbors))].filter(
      (p) =>
        enhancement[
          parseInt(
            neighbors(p)
              .map((n) => (pixels.has(n) ? 1 - i : i))
              .join(''),
            2
          )
        ] === i
    )
  );

solve = (n) => [...Array(n)].reduce((p, _, i) => step(p, i % 2), pixels).size;

// problem 1
solve(2);

// problem 2
solve(50);
