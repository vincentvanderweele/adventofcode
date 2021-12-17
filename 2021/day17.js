[xMin, xMax, yMin, yMax] = document
  .querySelector('pre')
  .firstChild.textContent.trim()
  .slice('target area: '.length)
  .split(', ')
  .flatMap((x) =>
    x
      .slice(2)
      .split('..')
      .map((x) => parseInt(x))
  );

// problem 1
(yMin * (yMin + 1)) / 2;

// problem 2
reaches = (vx0, vy0) => {
  [vx, vy, x, y] = [vx0, vy0, 0, 0];
  while ((vx && x < xMin) || y > yMax) {
    x += vx;
    y += vy--;
    vx = Math.max(vx - 1, 0);
  }
  return x >= xMin && x <= xMax && y >= yMin;
};

[...Array(xMax + 1)]
  .flatMap((_, vx0) =>
    [...Array(-2 * yMin + 1)]
      .map((_, vy0) => vy0 + yMin)
      .map((vy0) => reaches(vx0, vy0))
  )
  .filter((x) => x).length;
