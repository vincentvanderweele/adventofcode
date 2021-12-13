data = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .map((x) => x.split('-'));

adjacencyLists = data
  .flatMap(([a, b]) => [
    [a, b],
    [b, a],
  ])
  .filter(([a, b]) => a !== 'end' && b !== 'start')
  .reduce((r, [a, b]) => ({ ...r, [a]: [...(r[a] ?? []), b] }), {});

solve = (node, allowDouble, visited = new Set()) => {
  if (node === 'end') return 1;

  let isDouble = node === node.toLowerCase() && visited.has(node);
  if (isDouble && !allowDouble) return 0;

  visited.add(node);
  result = adjacencyLists[node].reduce(
    (s, x) => s + solve(x, allowDouble && !isDouble, visited),
    0
  );
  if (!isDouble) visited.delete(node);
  return result;
};

// problem 1
solve('start', false);

// problem 2
solve('start', true);