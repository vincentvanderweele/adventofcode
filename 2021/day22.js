input = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .map((x) => ({
    command: x.split(' ')[0] === 'on' ? 1 : 0, // convert on/off to 1/0
    coordinates: x
      .split(' ')[1]
      .split(',')
      .map((x) =>
        x
          .slice(2)
          .split('..')
          // +i because intervals should be open on the right (go Dijkstra!)
          .map((x, i) => parseInt(x) + i)
      ),
  }));

sweep = (segments, index = 0) => {
  const stops = segments
    .flatMap(({ coordinates }) => coordinates[index])
    .sort((a, b) => a - b);

  return stops.slice(0, -1).reduce((sum, stop, i) => {
    const segmentsAtStop = segments.filter(
      ({ coordinates: c }) => c[index][0] <= stop && stop < c[index][1]
    );
    if (!segmentsAtStop.length) return sum;

    return (
      sum +
      (stops[i + 1] - stop) *
        (index === 2
          ? segmentsAtStop.pop().command
          : sweep(segmentsAtStop, index + 1))
    );
  }, 0);
};

// problem 1
sweep(
  input.filter((x) =>
    x.coordinates.flatMap((x) => x).every((x) => Math.abs(x) <= 50)
  )
);

// alternatively (what I actually did):
// lights = [...Array(1000000)];
// for ({ command, coordinates: c } of input.slice(0, 20)) {
//   for (x = c[0][0]; x < c[0][1]; x++)
//     for (y = c[1][0]; y < c[1][1]; y++)
//       for (z = c[2][0]; z < c[2][1]; z++)
//         lights[10000 * (x + 50) + 100 * (y + 50) + z + 50] = command;
// }
// lights.filter((x) => x).length;

// problem 2
sweep(input);
