document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .slice(24)
  .map(x => x.split(/\D+/).map(x => parseInt(x, 10)))
  .filter(
    ([width, height, ...counts]) =>
      counts.reduce((s, x) => s + x) <=
      Math.floor(width / 3) * Math.floor(height / 3)
  ).length;
