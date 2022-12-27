sum = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x =>
    x
      .split('')
      .reduce(
        (r, x) => 5 * r + (x === '-' ? -1 : x === '=' ? -2 : parseInt(x)),
        0
      )
  )
  .reduce((s, x) => s + x);

result = [];
while (sum !== 0) {
  r = sum % 5;
  if (r >= 3) {
    r = r === 3 ? '=' : '-';
    sum += 5;
  }
  result.unshift(r);
  sum = Math.floor(sum / 5);
}

result.join('');
