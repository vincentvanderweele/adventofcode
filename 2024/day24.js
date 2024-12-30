[rawValues, rawRules] = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x);

values = rawValues
  .split('\n')
  .map(x => x.split(': '))
  .reduce((r, [k, v]) => ((r[k] = parseInt(v)), r), {});
rules = rawRules
  .split('\n')
  .filter(x => x)
  .map(x => x.split(' '))
  .map(([lhs, op, rhs, _, res]) => ({ lhs, op, rhs, res }));

ruleMap = rules.reduce((m, r) => ((m[r.res] = r), m), {});

ops = {
  AND: (l, r) => l & r,
  OR: (l, r) => l | r,
  XOR: (l, r) => l ^ r,
};
compute = ({ lhs, op, rhs, res }) =>
  (values[res] ??= ops[op](
    values[lhs] ?? compute(ruleMap[lhs]),
    values[rhs] ?? compute(ruleMap[rhs])
  ));

for (rule of rules) compute(rule);

// Problem 1
a = parseInt(
  Object.entries(values)
    .filter(([k]) => k[0] === 'z')
    .sort(([ka], [kb]) => kb.localeCompare(ka))
    .map(([, v]) => v)
    .join(''),
  2
);

// Problem 2
ruleStrings = rules.reduce(
  (r, { lhs, op, rhs, res }) => (
    (r[`${lhs} ${op} ${rhs}`] = r[`${rhs} ${op} ${lhs}`] = res), r
  ),
  {}
);

carry = ruleStrings['x00 AND y00'];

result = [];

for (let i = 1; i < 45; i++) {
  ii = `0${i}`.slice(-2);

  wires = [];
  rules = [
    () => (wires[0] = ruleStrings[`x${ii} AND y${ii}`]),
    () => (wires[1] = ruleStrings[`x${ii} XOR y${ii}`]),
    () => (wires[2] = ruleStrings[`${carry} AND ${wires[1]}`]),
    () => (wires[3] = ruleStrings[`${wires[0]} OR ${wires[2]}`]),
    () => (wires[4] = ruleStrings[`${carry} XOR ${wires[1]}`]),
  ];

  rules.forEach(f => f());

  swap = (i, j) => {
    result.push(wires[i], wires[j]);
    [wires[i], wires[j]] = [wires[j], wires[i]];
    rules.filter((_, x) => x !== i && x !== j).forEach(f => f());
  };

  if (!wires[4]) {
    swap(0, 1);
  } else if (wires[4][0] !== 'z') {
    swap(
      4,
      wires.findIndex(x => x[0] === 'z')
    );
  }

  carry = wires[3];
}

b = result.sort().join(',');

[a, b];
