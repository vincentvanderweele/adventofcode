data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => parseInt(x));

solve = (rounds = 1, multiplier = 1) => {
  const indexedData = data.map((value, index) => ({
    value: value * multiplier,
    index,
  }));

  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < indexedData.length; i++) {
      const currentIndex = indexedData.findIndex(({ index }) => index === i);
      const [current] = indexedData.splice(currentIndex, 1);

      const newIndex = (currentIndex + current.value) % indexedData.length;
      indexedData.splice(newIndex, 0, current);
    }
  }

  const zeroIndex = indexedData.findIndex(({ value }) => value === 0);
  return [1000, 2000, 3000]
    .map(index => indexedData[(index + zeroIndex) % indexedData.length].value)
    .reduce((s, x) => s + x);
};

// problem 1
solve();

// problem 2
solve(10, 811589153);
