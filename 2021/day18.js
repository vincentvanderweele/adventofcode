input = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x);

parse = (s) => {
  let i = 0;
  let p = (parent) => {
    const self = { parent };
    if (s[i] === '[') {
      self.children = [0, 0].map(() => (i++, p(self)));
      i++;
    } else {
      self.value = parseInt(s[i++]);
    }
    return self;
  };
  return p();
};

add = (...children) => {
  self = { children };
  children.forEach((c) => {
    c.parent = self;
  });
  return self;
};

addTo = (n, i, x) => {
  let p = n;
  while (p.parent && p.parent.children[i] === p) p = p.parent;
  if (!p.parent) return;
  p = p.parent.children[i];
  while (p.children) p = p.children[1 - i];
  p.value += x;
};

findAtDepth = (n, d) =>
  !n.children
    ? undefined
    : d === 0
    ? n
    : n.children.reduce((r, c) => r ?? findAtDepth(c, d - 1), null);

replaceAtParent = (n, x) => {
  x.parent = n.parent;
  n.parent.children[n.parent.children.indexOf(n)] = x;
};

split = (n, p) => {
  if (n.children) return n.children.some((c) => split(c, n));

  if (n.value < 10) return false;

  s = {};
  s.children = [Math.floor(n.value / 2), Math.ceil(n.value / 2)].map(
    (value) => ({ parent: s, value })
  );
  replaceAtParent(n, s);
  return true;
};

explode = (n) => {
  toExplode = findAtDepth(n, 4);
  if (!toExplode) return false;

  toExplode.children.forEach((c, i) => addTo(toExplode, i, c.value));
  replaceAtParent(toExplode, { value: 0 });
  return true;
};

reduce = (n) => {
  while (true) {
    if (explode(n)) continue;
    if (!split(n)) break;
  }
  return n;
};

// problem  1
weights = [3, 2];
magnitude = (n) =>
  n.children?.reduce((s, c, i) => s + weights[i] * magnitude(c), 0) ?? n.value;

magnitude(input.map(parse).reduce((res, node) => reduce(add(res, node))));

// problem 2
Math.max(
  ...input.flatMap((x, i) =>
    input.map((y, j) =>
      i === j ? 0 : magnitude(reduce(add(...[x, y].map(parse))))
    )
  )
);
