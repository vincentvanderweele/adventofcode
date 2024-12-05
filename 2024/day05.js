[rules, manuals] = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x)
  .map(x => x.split('\n').filter(x => x));

rules = rules.map(x => x.split('|').map(x => parseInt(x, 10)));
manuals = manuals.map(x => x.split(',').map(x => parseInt(x, 10)));

isValid = manual =>
  rules.every(([x, y]) => {
    indexX = manual.indexOf(x);
    indexY = manual.indexOf(y);

    return indexX < 0 || indexY < 0 || indexX < indexY;
  });

score = manuals =>
  manuals.map(x => x[Math.floor(x.length / 2)]).reduce((s, x) => s + x);

// problem 1
a = score(manuals.filter(isValid));

// problem 2
rulesSet = new Set(rules.map(([x, y]) => `${x},${y}`));

b = score(
  manuals
    .filter(m => !isValid(m))
    .map(x =>
      x.sort((x, y) =>
        rulesSet.has(`${x},${y}`) ? -1 : rulesSet.has(`${y},${x}`) ? 1 : 0
      )
    )
);

[a, b];
