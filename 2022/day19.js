costs = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x =>
    x
      .split('.')
      .filter(x => x)
      .map(x =>
        x
          .match(/\d+ [a-z]+/g)
          .reduce(
            (r, x) => ({ ...r, [x.split(' ')[1]]: parseInt(x.split(' ')[0]) }),
            {}
          )
      )
      .map(x => ['ore', 'clay', 'obsidian', 'geode'].map(y => x[y] ?? 0))
  );

// Heuristic to estimate how many geodes we can still generate from this subtree.
// It's main purpose is to cut branches that are only generating clay.
maxGeodes = (time, resources, producers, costs) => {
  let [ore, clay, obsidean, geode] = resources;
  let [dOre, dClay, dObsidean, dGeode] = producers;
  const [, [clayOreCost], [, obsideanClayCost], [, , geodeObsideanCost]] =
    costs;

  for (let i = 0; i < time; i++) {
    ore += dOre;
    clay += dClay;
    obsidean += dObsidean;
    geode += dGeode;

    dOre++;
    if (ore >= clayOreCost) {
      ore -= clayOreCost;
      dClay++;
    }
    if (clay >= obsideanClayCost) {
      clay -= obsideanClayCost;
      dObsidean++;
    }
    if (obsidean >= geodeObsideanCost) {
      obsidean -= geodeObsideanCost;
      dGeode++;
    }
  }

  return geode;
};

solve = (costs, n) => {
  max = 0;
  // It never pays off to generate more resources than what's
  // needed for the most expensive purchase.
  maxCosts = [...Array(costs.length)].map((_, i) =>
    Math.max(...costs.map(cost => cost[i]))
  );

  solveInternal = (time, resources, producers) => {
    if (time === 0) return resources[3];

    // Cut this branch because it cannot be optimal
    if (resources[3] + maxGeodes(time, resources, producers, costs) < max)
      return 0;

    // For each buy, figure out after many rounds we can afford it.
    const roundsToBuy = costs
      .map((cost, producer) => ({ cost, producer }))
      // Don't buy more producers if we already produce at max rate
      .filter(
        ({ producer }) =>
          maxCosts[producer] === 0 || producers[producer] < maxCosts[producer]
      )
      // Filter out buys for which we're not producing the required resources
      .filter(({ cost }) => cost.every((x, i) => x === 0 || producers[i] > 0))
      // How many rounds does it take before we can afford this
      .map(({ cost, producer }) => ({
        cost,
        producer,
        rounds:
          Math.max(
            ...cost.map((x, i) =>
              x <= resources[i]
                ? 0
                : Math.ceil((x - resources[i]) / producers[i])
            )
          ) + 1, // +1 because producing takes one more round
      }))
      // Filter out buys that we cannot make in time anymore
      .filter(({ rounds }) => time - rounds >= 0)
      // Prioritise getting geode generators, because those subtrees
      // are more likely to contain the obtimal result.
      .reverse();

    const result = Math.max(
      ...roundsToBuy.map(({ cost, producer, rounds }) =>
        solveInternal(
          time - rounds,
          resources.map((x, i) => x + producers[i] * rounds - cost[i]),
          producers.map((x, i) => (i === producer ? x + 1 : x)),
          costs
        )
      )
    );
    if (result > max) max = result;
    return result;
  };

  return solveInternal(n, [0, 0, 0, 0], [1, 0, 0, 0]);
};

// problem 1
costs.map((c, i) => (i + 1) * solve(c, 24)).reduce((s, x) => s + x);

// problem 2
costs
  .slice(0, 3)
  .map(c => solve(c, 32))
  .reduce((p, x) => p * x, 1);
