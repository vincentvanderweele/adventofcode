data = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .map(
    (x) =>
      (parts = x
        .split(' | ')
        .map((y) => y.split(' ').map((z) => z.split('').sort().join(''))))
  );

// problem 1
data
  .map(
    ([_, output]) =>
      output.filter((x) => [2, 3, 4, 7].includes(x.length)).length
  )
  .reduce((s, e) => s + e, 0);

// problem 2
contains = (x, y) => y.split('').every((c) => x.includes(c));

data
  .map(([input, output]) => {
    mapping = [];
    // unique number of segments
    mapping[1] = input.find((x) => x.length === 2);
    mapping[4] = input.find((x) => x.length === 4);
    mapping[7] = input.find((x) => x.length === 3);
    mapping[8] = input.find((x) => x.length === 7);

    // 0, 6, and 9 can be distinguished based on whether they include 1 (0, 9) or 4 (9)
    _069 = input.filter((x) => x.length === 6);
    mapping[6] = _069.find((x) => !contains(x, mapping[1]));
    mapping[9] = _069.find((x) => contains(x, mapping[4]));
    mapping[0] = _069.find((x) => x !== mapping[6] && x !== mapping[9]);

    // 2, 3, and 5 can be distinguished based on whether they include 1 (3) or are included in 6 (5)
    _235 = input.filter((x) => x.length === 5);
    mapping[3] = _235.find((x) => contains(x, mapping[1]));
    mapping[5] = _235.find((x) => contains(mapping[6], x));
    mapping[2] = _235.find((x) => x !== mapping[3] && x !== mapping[5]);

    // convert digits to decimal number
    return output.reduce((r, s) => 10 * r + mapping.indexOf(s), 0);
  })
  .reduce((s, e) => s + e, 0);
