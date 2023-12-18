data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' '))
  .map(([d, l, c]) => ({
    direction: d,
    count: parseInt(l, 10),
    color: c.slice(2, -1),
  }));

directions = {
  L: [-1, 0],
  U: [0, -1],
  R: [1, 0],
  D: [0, 1],
};

solve = instructions => {
  count = 0;

  segments = instructions.reduce(
    ({ current, segments }, { direction, count }) => {
      next = current.map((z, i) => z + directions[direction][i] * count);

      segments.push([current, next]);
      return {
        segments,
        current: next,
      };
    },
    { current: [0, 0], segments: [] }
  ).segments;

  events = segments
    .flatMap(segment => {
      let [[, y0], [, y1]] = segment;
      if (y0 === y1) return [{ y: y0, segment: segment, isHorizontal: true }];
      return [
        {
          y: Math.min(y0, y1),
          segment: segment,
          isHorizontal: false,
          isStart: true,
        },
        {
          y: Math.max(y0, y1),
          segment: segment,
          isHorizontal: false,
          isStart: false,
        },
      ];
    })
    .sort((a, b) => b.y - a.y);

  currentVerticals = new Set();
  while (events.length) {
    // find all events at the current y-coordinate
    currentEvents = [events.pop()];
    currentY = currentEvents[0].y;
    while (events.length && events[events.length - 1].y === currentY) {
      currentEvents.push(events.pop());
    }

    // remove ending verticals
    for (event of currentEvents.filter(x => !x.isHorizontal && !x.isStart))
      currentVerticals.delete(event.segment[0][0]);

    // find the size of this horizontal row
    rowEvents = [...currentVerticals].map(x => ({
      from: x,
      to: x,
      isSwitch: true,
    }));
    currentEvents
      .filter(e => e.isHorizontal)
      .map(e => {
        xStart = Math.min(e.segment[0][0], e.segment[1][0]);
        xEnd = Math.max(e.segment[0][0], e.segment[1][0]);

        ends = currentEvents.filter(
          x =>
            !x.isHorizontal &&
            (x.segment[0][0] === xStart || x.segment[0][0] === xEnd)
        );
        if (ends.length !== 2) throw 'Not 2';
        rowEvents.push({
          from: xStart,
          to: xEnd,
          isSwitch: ends[0].isStart !== ends[1].isStart,
        });
      });

    rowEvents.sort((a, b) => a.from - b.from);
    rowCount = 0;
    inside = false;
    from = 0;
    for (event of rowEvents) {
      if (inside) {
        rowCount += event.to - from + 1;
      } else {
        rowCount += event.to - event.from + 1;
      }
      from = event.to + 1;

      if (event.isSwitch) inside = !inside;
    }
    count += rowCount;

    // add starting verticals
    for (event of currentEvents.filter(x => !x.isHorizontal && x.isStart))
      currentVerticals.add(event.segment[0][0]);

    // compute the size until the next event row
    if (events.length) {
      nextY = events[events.length - 1].y;

      verticals = [...currentVerticals].sort((a, b) => a - b);

      rowCount = 0;
      for (i = 0; i < verticals.length / 2; i++) {
        rowCount += verticals[2 * i + 1] - verticals[2 * i] + 1;
      }
      count += rowCount * (nextY - currentY - 1);
    }
  }

  return count;
};

// problem 1
a = solve(data);

// problem 2
b = solve(
  data.map(x => ({
    direction: ['R', 'D', 'L', 'U'][parseInt(x.color.slice(5), 10)],
    count: parseInt(x.color.slice(0, 5), 16),
  }))
);

[a, b];
