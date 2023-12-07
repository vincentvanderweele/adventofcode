data = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x);

seeds = data
  .shift()
  .match(/\d+/g)
  .map(x => parseInt(x, 10));
maps = data.map(x =>
  x
    .split('\n')
    .filter(x => x)
    .slice(1)
    .map(x => x.match(/\d+/g).map(x => parseInt(x, 10)))
);

// problem 1
a = Math.min(
  ...seeds.map(s =>
    maps.reduce((x, ms) => {
      m = ms.find(([, s, r]) => s <= x && s + r > x);
      return m ? m[0] + x - m[1] : x;
    }, s)
  )
);

// problem 2

// Sort order of events
types = { mapEnd: 0, rangeEnd: 1, rangeStart: 2, mapStart: 3 };

b = Math.min(
  ...maps
    .reduce(
      (ranges, maps, i) => {
        // Use a sweep line algorithm. Gather all events.
        events = ranges
          .flatMap(({ s, e }) => [
            { type: 'rangeStart', value: s },
            { type: 'rangeEnd', value: e },
          ])
          .concat(
            maps.flatMap(([d, s, r]) => [
              { type: 'mapStart', value: s, diff: d - s },
              { type: 'mapEnd', value: s + r, diff: d - s },
            ])
          )
          .sort((a, b) =>
            a.value !== b.value
              ? a.value - b.value
              : types[a.type] - types[b.type]
          );

        let currentDiff = 0;
        let currentStart = undefined;
        let nextRanges = [];
        addRange = event =>
          nextRanges.push({ s: currentStart, e: event.value + currentDiff });

        for (let event of events) {
          switch (event.type) {
            case 'rangeStart':
              currentStart = event.value + currentDiff;
              break;
            case 'rangeEnd':
              addRange(event);
              currentStart = undefined;
              break;
            case 'mapStart':
              if (currentStart !== undefined) {
                addRange(event);
                currentStart = event.value + event.diff;
              }
              currentDiff = event.diff;
              break;
            case 'mapEnd':
              if (currentStart !== undefined) {
                addRange(event);
                currentStart = event.value;
              }
              currentDiff = 0;
              break;
          }
        }
        return nextRanges.filter(x => x.e - x.s > 0);
      },
      [...Array(seeds.length / 2)].map((_, i) => ({
        s: seeds[2 * i],
        e: seeds[2 * i] + seeds[2 * i + 1],
      }))
    )
    .map(x => x.s)
);

[a, b];
