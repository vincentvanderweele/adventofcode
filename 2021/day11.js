data = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .flatMap((x) => x.split('').map((y) => parseInt(y)));

// Exclude neighbors that fall outside the grid by calculating in
// base 11 and checking for 'a' for overflows/underflows.
neighbors = (i) =>
  [-1, 0, 1]
    .flatMap((dy) => [-1, 0, 1].map((dx) => 11 * dy + dx))
    .map((d) => (d + parseInt(i, 11)).toString(11))
    .filter((s) => !s.includes('a') && s != i)
    .map((s) => parseInt(s));

solve = (n, energies) =>
  [...Array(n)].map((_, step) => {
    energies.forEach((_, i) => energies[i]++);

    flashed = new Set();

    do {
      toFlash = energies
        .map((energy, i) => [energy, i])
        .filter(([energy, i]) => energy > 9 && !flashed.has(i))
        .map(([_, i]) => i);

      toFlash.forEach((i) => flashed.add(i));
      toFlash.flatMap(neighbors).forEach((i) => energies[i]++);
    } while (toFlash.length > 0);

    energies.forEach((energy, i) => (energies[i] = energy > 9 ? 0 : energy));

    return flashed.size;
  });

// problem 1
solve(100, [...data]).reduce((s, e) => s + e, 0);

// problem 2
solve(400, [...data]).findIndex((x) => x === 100) + 1;
