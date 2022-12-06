data = document.querySelector('pre').firstChild.data.split('');

solve = n => {
  for (i = 0; i < data.length; i++)
    if (new Set(data.slice(i, i + n)).size === n) return i + n;
};

// problem 1
solve(4);

// problem 2
solve(14);
