input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(',').map(x => parseInt(x, 10)))
  .map(([x, y]) => ({ x, y }));

chunk = (a, s) =>
  [...Array(a.length / s)].map((_, i) =>
    [...Array(s)].map((_, j) => a[s * i + j])
  );

// Slice polygon into rectangles. Input contains no duplicate x-coordinates
// so we can cut some corners (chunking the sorted x-array works).
getRectangles = points => {
  verticalLines = chunk(
    points.sort((a, b) => a.x - b.x),
    2
  );

  return verticalLines.slice(1).reduce(
    ({ rectangles, currentX, currentY }, [{ x, y: y0 }, { y: y1 }]) => {
      rectangles.push({
        xMin: currentX,
        xMax: x,
        yRanges: chunk(
          currentY.sort((a, b) => a - b),
          2
        ).map(([yMin, yMax]) => ({ yMin, yMax })),
      });

      for (y of [y0, y1]) {
        if (currentY.includes(y)) currentY = currentY.filter(z => z !== y);
        else currentY.push(y);
      }

      return { rectangles, currentX: x, currentY };
    },
    {
      rectangles: [],
      currentX: verticalLines[0][0].x,
      currentY: verticalLines[0].map(z => z.y).sort((a, b) => a - b),
    }
  ).rectangles;
};

inputByArea = input
  .flatMap(({ x: x0, y: y0 }, i) =>
    input.slice(i + 1).map(({ x: x1, y: y1 }) => {
      [xMin, xMax] = [x0, x1].sort((a, b) => a - b);
      [yMin, yMax] = [y0, y1].sort((a, b) => a - b);
      return {
        xMin,
        xMax,
        yMin,
        yMax,
        area: (xMax - xMin + 1) * (yMax - yMin + 1),
      };
    })
  )
  .sort((a, b) => b.area - a.area);

a = inputByArea[0].area;

rectangles = getRectangles(input);

// Loop over all candidates in ascending area order and see if the
// current area can be fully covered by rectangles
for (let { xMin, xMax, yMin, yMax, area } of inputByArea) {
  ri = rectangles.findIndex(r => r.xMin === xMin);

  x = xMin;

  while (x < xMax) {
    // Check that this rectangle slice includes the area slice
    if (rectangles[ri].yRanges.some(r => r.yMin <= yMin && r.yMax >= yMax)) {
      x = rectangles[ri].xMax;
      ri++;
    } else {
      break;
    }
  }

  // The whole area was includes by rectangle slices
  if (x >= xMax) {
    b = area;
    break;
  }
}

[a, b];
