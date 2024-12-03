x = document.querySelector('pre').firstChild.data;

solve = x =>
  [...x.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)]
    .map(x =>
      x
        .slice(1)
        .map(x => parseInt(x, 10))
        .reduce((p, x) => p * x)
    )
    .reduce((s, x) => s + x);

// problem 1
a = solve(x);

// problem 2
x = `do()${x}`
  .split("don't()")
  .map(x => x.split('do()').slice(1))
  .join('');
b = solve(x);

[a, b];
