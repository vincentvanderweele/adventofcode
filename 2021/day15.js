risks = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .flatMap((x) => x.split('').map((y) => parseInt(y)));

neighbors = (xy, n) =>
  [
    xy >= n && xy - n,
    xy / n + 1 < n && xy + n,
    xy % n > 0 && xy - 1,
    (xy % n) + 1 < n && xy + 1,
  ].filter((x) => x);

dijkstra = (n, getRisk) => {
  scores = [...Array(n * n)].map((_) => Number.POSITIVE_INFINITY);
  queue = [[0, 0]];

  while (scores[n * n - 1] === Number.POSITIVE_INFINITY) {
    do {
      [coordinate, score] = queue.pop();
    } while (scores[coordinate] < Number.POSITIVE_INFINITY);
    scores[coordinate] = score;
    neighbors(coordinate, n).forEach((neighbor) =>
      queue.push([neighbor, score + getRisk(neighbor)])
    );
    queue.sort((x, y) => y[1] - x[1]);
  }
  return scores[n * n - 1];
};

// problem 1
dijkstra(Math.sqrt(risks.length), (xy) => risks[xy]);

// problem 2
m = Math.sqrt(risks.length);
n = 5 * m;
getRisk = (xy) => {
  baseRisk = risks[m * (Math.floor(xy / n) % m) + (xy % m)];
  risk =
    baseRisk + Math.floor((xy % n) / m) + Math.floor(Math.floor(xy / n) / m);
  return ((risk - 1) % 9) + 1;
};
dijkstra(n, getRisk);
