input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('] ').flatMap(x => x.split(' {')))
  .map(([l, t, j]) => ({
    light: parseInt(
      l
        .slice(1)
        .split('')
        .map(x => (x === '#' ? 1 : 0))
        .reverse()
        .join(''),
      2
    ),
    toggles: t.split(' ').map(x =>
      x
        .slice(1, -1)
        .split(',')
        .map(x => parseInt(x, 10))
    ),
    joltages: j
      .slice(0, -1)
      .split(',')
      .map(x => parseInt(x, 10)),
  }));

a = input
  .map(({ light, toggles }) => {
    ts = toggles.map(toggle => toggle.reduce((s, t) => s + (1 << t), 0));

    n = 0;
    lights = new Set([0]);
    while (!lights.has(light)) {
      lights = new Set(ts.flatMap(t => [...lights].map(l => l ^ t)));
      n++;
    }
    return n;
  })
  .reduce((s, x) => s + x);

// Part 2 madness starts here

solve = (joltages, toggles, cost = 0) => {
  if (joltages.every(x => x === 0)) return cost;
  if (joltages.some(x => x < 0)) return Infinity;
  if (toggles.length === 0) return Infinity;

  const counts = joltages.map(() => 0);
  for (const toggle of toggles) for (const t of toggle) counts[t]++;

  const minCount = Math.min(...counts.filter(x => x > 0));

  if (minCount <= 4) {
    const t = counts.findIndex(x => x === minCount);
    const joltagePresses = joltages[t];

    const selectedToggles = toggles.filter(toggle => toggle.includes(t));

    const maxPresses = selectedToggles.map(toggle =>
      Math.min(...toggle.map(t => joltages[t]))
    );
    const maxTotalPresses = maxPresses.reduce((s, x) => s + x);

    const remainingPresses = maxTotalPresses - maxPresses[0];

    if (joltagePresses > maxTotalPresses) return Infinity;

    let min = Infinity;
    for (
      let i = Math.max(0, joltagePresses - remainingPresses);
      i <= maxPresses[0] && i <= joltagePresses;
      i++
    ) {
      const nextJoltages = [...joltages];
      for (const t of selectedToggles[0]) nextJoltages[t] -= i;
      const result = solve(
        nextJoltages,
        toggles.filter(x => x !== selectedToggles[0]),
        cost + i
      );
      if (result < min) min = result;
    }
    return min;
  } else {
    console.log(`Lowest count is ${minCount}!!!`);
    return -1;
  }
};

solve2 = (joltages, toggles, cost = 0) => {
  const { joltage, remainingToggles } = findMaxOverlap(joltages, toggles);

  const maxPresses = remainingToggles.map(toggle =>
    Math.min(...toggle.map(t => joltages[t]))
  );

  if (remainingToggles.length === 1) {
    const [toggle1] = remainingToggles;

    const nextJoltages = [...joltages];
    for (const t of remainingToggles[0]) nextJoltages[t] -= joltage;
    return solve(
      nextJoltages,
      toggles.filter(x => x !== toggle1),
      cost + joltage
    );
  } else if (remainingToggles.length === 2) {
    const [toggle1, toggle2] = remainingToggles;

    let min = Infinity;
    for (
      let i = Math.max(0, joltage - maxPresses[1]);
      i <= maxPresses[0] && i <= joltage;
      i++
    ) {
      const nextJoltages = [...joltages];

      for (const t of toggle1) nextJoltages[t] -= i;
      for (const t of toggle2) nextJoltages[t] -= joltage - i;

      const result = solve(
        nextJoltages,
        toggles.filter(x => x !== toggle1 && x !== toggle2),
        cost + joltage
      );
      if (result < min) min = result;
    }
    return min;
  } else if (remainingToggles.length === 3) {
    const [toggle1, toggle2, toggle3] = remainingToggles;

    let min = Infinity;
    for (
      let i = Math.max(0, joltage - maxPresses[1] - maxPresses[2]);
      i <= maxPresses[0] && i <= joltage;
      i++
    ) {
      for (
        let j = Math.max(0, joltage - i - maxPresses[2]);
        j <= maxPresses[1] && i + j <= joltage;
        j++
      ) {
        const nextJoltages = [...joltages];

        for (const t of toggle1) nextJoltages[t] -= i;
        for (const t of toggle2) nextJoltages[t] -= j;
        for (const t of toggle3) nextJoltages[t] -= joltage - i - j;

        const result = solve(
          nextJoltages,
          toggles.filter(x => x !== toggle1 && x !== toggle2 && x !== toggle3),
          cost + joltage
        );
        if (result < min) min = result;
      }
    }
    return min;
  } else {
    console.log(`Got ${remainingToggles.length} remainingToggles`);
    return -1;
  }
};

findMaxOverlap = (joltages, toggles) => {
  const sets = joltages.map(() => new Set());

  for (let i = 0; i < toggles.length; i++) {
    for (const t of toggles[i]) {
      sets[t].add(i);
    }
  }

  let min = Infinity;
  let joltage = 0;
  let remainingToggles = [];

  for (let i = 0; i < sets.length; i++) {
    for (let j = 0; j < sets.length; j++) {
      if (i !== j && sets[i].isSubsetOf(sets[j])) {
        const remaining = sets[j].difference(sets[i]);

        if (remaining.size < min) {
          min = remaining.size;
          joltage = joltages[j] - joltages[i];
          remainingToggles = [...remaining].map(x => toggles[x]);
        }
      }
    }
  }

  return min < Infinity ? { joltage, remainingToggles } : undefined;
};

b = input
  .map(({ toggles, joltages }, i) => {
    console.log(`Solving ${i}`);

    const result = solve(joltages, toggles);
    return result < 0 ? solve2(joltages, toggles) : result;
  })
  .reduce((s, x) => s + x);

[a, b];
