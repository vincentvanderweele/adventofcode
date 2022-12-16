data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' '))
  .map(parts => ({
    name: parts[1],
    flow: parseInt(parts[4].slice(5)),
    tunnels: parts.slice(9).map(x => x.slice(0, 2)),
  }))
  .sort((a, b) => b.flow - a.flow);

steps = data.flatMap(({ name, tunnels }) =>
  tunnels.map(tunnel => ({ from: name, to: tunnel }))
);

// Build full graph with distances between each pair of nodes
dist = Object.fromEntries(data.map(x => [`${x.name},${x.name}`, 0]));
while (Object.keys(dist).length < data.length * data.length) {
  keys = Object.keys(dist);

  for (key of keys) {
    let [start, hop] = key.split(',');
    nextSteps = steps.filter(({ from }) => from === hop);
    for (nextStep of nextSteps) {
      newKey = `${start},${nextStep.to}`;
      if (!dist[newKey]) dist[newKey] = dist[key] + 1;
    }
  }
}

// Only keep nodes where flow is positive
graph = data
  .filter(({ flow }) => flow > 0)
  .map(({ name, flow }) => ({
    name,
    flow,
    dist: data
      .filter(x => x.flow > 0 && x.name !== name)
      .map(x => [x.name, dist[`${name},${x.name}`] + 1]),
  }));

start = {
  dist: graph.map(({ name }) => [name, dist[`AA,${name}`] + 1]),
};

solve = (
  currentArray,
  remainingArray,
  visited,
  scoreSoFar,
  topLevel = false
) => {
  if (remainingArray.every(x => x === 0)) return scoreSoFar;

  const index = remainingArray.indexOf(Math.max(...remainingArray));
  const current = currentArray[index];
  const remaining = remainingArray[index];

  const newCurrentArray = [...currentArray];
  const newRemainingArray = [...remainingArray];

  const nextOptions = current.dist.filter(([name]) => !visited.has(name));

  if (nextOptions.length === 0) return scoreSoFar;

  const scores = nextOptions.map(([next, dist], i, a) => {
    if (topLevel) console.log(`Evaluating ${i} of ${a.length}`);

    const newRemaining = Math.max(0, remaining - dist);
    const node = graph.find(x => x.name === next);
    const newVisited = new Set([...visited, node.name]);
    const newScoreSoFar = scoreSoFar + newRemaining * node.flow;

    newCurrentArray[index] = node;
    newRemainingArray[index] = newRemaining;

    return solve(newCurrentArray, newRemainingArray, newVisited, newScoreSoFar);
  });

  const maxScore = Math.max(...scores);
  if (maxScore > max) max = maxScore;
  return maxScore;
};

// problem 1
solve([start], [30], new Set(), 0);

// problem 2
solve([start, start], [26, 26], new Set(), 0, true);
