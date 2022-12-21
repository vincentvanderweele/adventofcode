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

// Input data dictionary for faster look-up
rules = data.reduce((result, rule) => {
  result[rule.from] = rule;
  return result;
}, {});

// Reverse dictionary: for each monkey, store which monkies depend on it
dependencies = data.reduce((result, { from, dependencies }) => {
  for (let d of dependencies ?? []) {
    result[d] ??= [];
    result[d].push(from);
  }
  return result;
}, {});

results = {};
queue = [];

// Set monkeys that have a simple value
for (let { from, value } of data.filter(x => x.value)) {
  results[from] = { value, xValue: 0 };
  queue.push(from);
}
results.humn = { value: 0, xValue: 1 };

compute = (operator, [{ value: l }, { value: r }]) => eval(`l ${operator} r`);
computeX = (operator, [{ value: l, xValue: lx }, { value: r, xValue: rx }]) => {
  // Solve the x-component of (ax+b) OP (cx+d)

  if (!lx && !rx) return 0;
  
  switch (operator) {
    case '+':
      return lx + rx;
    case '-':
      return lx - rx;
    case '*':
      // Because of the input data, either a or c is 0, so we don't need to consider quadratic terms
      if (lx && rx) throw new Error('This is tricky');
      return l * rx + r * lx;
    case '/':
      // Because of the input data, rx is always 0, so we don't need to consider 1/x terms
      if (rx) throw new Error('This is tricky');
      return lx / r;
  }
};

// For each resolved value, find the next monkeys whose value we know and compute those
while ((from = queue.shift())) {
  for (let to of dependencies[from] ?? []) {
    const rule = rules[to];

    const values = rule.dependencies.map(x => results[x]);
    // Not all dependencies known yet (this doesn't happen in practise with the given input data)
    if (!values.every(x => x)) continue;

    results[rule.from] = {
      value: compute(rule.operator, values),
      xValue: computeX(rule.operator, values),
    };

    // Store this monkey as resolved
    queue.push(rule.from);
  }
}

// problem 1
results.root.value + results.root.xValue * rules.humn.value;

// problem 2
[left, right] = rules.root.dependencies.map(x => results[x]);
// Solve ax+b = cx+d for x
Math.round((right.value - left.value) / (left.xValue - right.xValue));
