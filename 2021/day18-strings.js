input = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x);

explodeRegex = [/^(.*[^\d])(\d+)(.*)$/, /^([^\d]*)(\d+)(.*)$/];
splitRegex = /\d\d/;

reduce = (s) => {
  explode = () => {
    // find node at depth 5
    open = 0;
    for (i = 0; i < s.length; i++) {
      if (s[i] === '[') open++;
      if (s[i] === ']') open--;
      if (open === 5) break;
    }
    if (i === s.length) return false;
    for (j = i; j < s.length; j++) if (s[j] === ']') break;

    // parse node and split off string before and after
    values = s
      .substring(i + 1, j)
      .split(',')
      .map((x) => parseInt(x));
    parts = [s.slice(0, i), s.slice(j + 1)];

    // add node values to previous and next
    for (k = 0; k < 2; k++) {
      e = parts[k].match(explodeRegex[k]);
      if (e)
        parts[k] = parts[k].replace(
          explodeRegex[k],
          `$1${values[k] + parseInt(e[2])}$3`
        );
    }

    // replace node by 0
    s = `${parts[0]}0${parts[1]}`;
    
    return true;
  };

  split = () => {
    m = s.match(splitRegex);
    if (!m) return false;
    s = s.replace(
      splitRegex,
      `[${[Math.floor, Math.ceil].map((f) => f(parseInt(m[0]) / 2)).join(',')}]`
    );
    return true;
  };

  while (true) {
    if (explode()) continue;
    if (!split()) break;
  }
  return s;
};

factor = { '[': 3, ',': 2 / 3, ']': 1 / 2 };
magnitude = (s) =>
  s
    .split('')
    .reduce(
      ([s, f], c) =>
        '[,]'.includes(c) ? [s, f * factor[c]] : [s + f * parseInt(c), f],
      [0, 1]
    )[0];

// problem 1
magnitude(input.reduce((r, x) => reduce(`[${r},${x}]`)));

// problem 2
Math.max(
  ...input.flatMap((x, i) =>
    input.map((y, j) => (i === j ? 0 : magnitude(reduce(`[${x},${y}]`))))
  )
);
