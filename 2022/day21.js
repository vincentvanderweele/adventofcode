data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => {
    from = x.slice(0, 4);
    y = x.slice(6);
    value = parseInt(y);
    if (!isNaN(value)) return { from, value };
    return {
      from,
      dependencies: y.split(' ').filter((_, i) => i % 2 === 0),
      operator: y[5],
    };
  });

rules = data.reduce((result, rule) => {
  result[rule.from] = rule;
  return result;
}, {});

dependencies = data.reduce((result, { from, dependencies }) => {
  for (let d of dependencies ?? []) {
    result[d] ??= [];
    result[d].push(from);
  }
  return result;
}, {});

results = {};
queue = [];

for (let { from, value } of data.filter(x => x.value)) {
  results[from] = { value, xValue: 0 };
  queue.push(from);
}
results.humn = { value: 0, xValue: 1 };

compute = (operator, [{ value: l }, { value: r }]) => eval(`l ${operator} r`);
computeX = (operator, [{ value: l, xValue: lx }, { value: r, xValue: rx }]) => {
  if (!lx && !rx) return 0;

  switch (operator) {
    case '+':
      return lx || rx;
    case '-':
      return lx || -rx;
    case '*':
      return l * rx || r * lx;
    case '/':
      if (rx) throw new Error('This is tricky');
      return lx / r;
  }
};

while ((from = queue.shift())) {
  for (let to of dependencies[from] ?? []) {
    const rule = rules[to];

    const values = rule.dependencies.map(x => results[x]);
    if (!values.every(x => x)) continue;

    results[rule.from] = {
      value: compute(rule.operator, values),
      xValue: computeX(rule.operator, values),
    };
    queue.push(rule.from);
  }
}

// problem 1
results.root.value + results.root.xValue * rules.humn.value;

// problem 2
[left, right] = rules.root.dependencies.map(x => results[x]);
Math.round((right.value - left.value) / left.xValue);
