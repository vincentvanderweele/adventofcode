data = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x)
  .map(x =>
    x
      .split('\n')
      .filter(x => x)
      .map(x => x.split(''))
  );

findColumn = (b, except) => {
  outerCol: for (let i = 0; i < b[0].length - 1; i++) {
    if (i + 1 === except) continue;
    for (let c = 0; i - c >= 0 && i + c + 1 < b[0].length; c++) {
      if (!b.every(row => row[i - c] === row[i + c + 1])) continue outerCol;
    }
    return i + 1;
  }
};

findRow = (b, except) => {
  outerRow: for (let i = 0; i < b.length - 1; i++) {
    if (i + 1 === except) continue;
    for (let r = 0; i - r >= 0 && i + r + 1 < b.length; r++) {
      if (!b[i - r].every((x, j) => x === b[i + r + 1][j])) continue outerRow;
    }
    return i + 1;
  }
};

// problem 1
a = data.map(b => findColumn(b) ?? 100 * findRow(b)).reduce((s, x) => s + x);

// problem 2
b = data
  .map(b => {
    originalColumn = findColumn(b);
    originalRow = findRow(b);

    for (let i = 0; i < b.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        b[i][j] = b[i][j] === '#' ? '.' : '#';
        result = findColumn(b, originalColumn) ?? 100 * findRow(b, originalRow);
        if (!isNaN(result)) return result;
        b[i][j] = b[i][j] === '#' ? '.' : '#';
      }
    }
  })
  .reduce((s, x) => s + x);

[a, b];
