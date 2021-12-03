data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter((x) => x);

// problem 1
data
  // count occurences of '0' and '1' by index
  .reduce(
    (counts, x) => counts.map((c, i) => c + parseInt(x.charAt(i))),
    [...Array(data[0].length)].map((_) => 0)
  )
  // construct gamma and epsilon from binary representation
  .reduce(
    ([gamma, epsilon], b) =>
      [
        2 * gamma + (b > data.length / 2 ? 1 : 0),
        2 * epsilon + (b < data.length / 2 ? 1 : 0),
      ][(0, 0)]
  )
  // multiply
  .reduce((p, e) => p * e, 1);

// problem 2
solve = (pick) =>
  data[0]
    .split('')
    // loop over each input bit (using length of data[0])
    .reduce(
      (filtered, _, i) =>
        // stop filtering when the result is found
        filtered.length === 1
          ? filtered
          : // pick the partition based on the given function
            pick(
              // partition filtered inputs by their bit value at position i
              filtered.reduce(
                ([zero, one], current) =>
                  current.charAt(i) === '0'
                    ? [[...zero, current], one]
                    : [zero, [...one, current]],
                [[], []]
              )
            ),
      data
    )[0];

[
  // oxygen generator rating
  ([zero, one]) => (zero.length > one.length ? zero : one),
  // CO2 scrubber rating
  ([zero, one]) => (zero.length <= one.length ? zero : one),
]
  // find bit strings
  .map((pick) => solve(pick))
  // convert to decimal numbers
  .map((x) => parseInt(x, 2))
  // multiply
  .reduce((p, e) => p * e, 1);
