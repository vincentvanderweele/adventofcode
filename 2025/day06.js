input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x);

n = input.length - 1;

ops = input[n].split(/ +/);
numbers = [['', '', '', '']];
for (i = 0; i < input[0].length; i++) {
  if ([0, 1, 2, 3].every(j => input[j][i] === ' ')) {
    numbers.push(['', '', '', '']);
  } else {
    for (j = 0; j < n; j++) numbers[numbers.length - 1][j] += input[j][i];
  }
}

solve = ns =>
  ns
    .map((x, i) =>
      x
        .map(x => parseInt(x, 10))
        .reduce((r, x) => (ops[i] === '+' ? r + x : r * x))
    )
    .reduce((s, x) => s + x);

a = solve(numbers);

transpose = b =>
  b
    .map(x => x.split(''))
    .reduce((r, x) => x.map((y, i) => [...(r[i] || []), y]), [])
    .map(x => x.join(''));

b = solve(numbers.map(transpose));

[a, b];
