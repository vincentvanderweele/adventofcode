input = `..#..#..
#.#...#.
..#.....
##....##
#..#.###
.#..#...
###..#..
....#..#`

function solve(input, rangeQ) {
  lines = input.split('\n')
  grid = lines
    .flatMap((y, j) => y.split('').map((x, i) => [i, j, x]))
    .filter(([x, y, v]) => v === '#')
    .reduce((r, [x, y]) => ({ ...r, [`${x},${y},0,0`]: '#'}), {})
  size = lines.length
  
  for (i = 1; i <= 6; i++) {
    nextGrid = {}

		qStart = rangeQ ? -i : 0
		qEnd = rangeQ ? i : 0

    for (x = -i; x < size + i; x++) {
      for (y = -i; y < size + i; y++) {
        for (z = -i; z <= i; z++) {
          for (q = qStart; q <= qEnd; q++) {
            c = [-1, 0, 1].flatMap(dx => [-1, 0, 1].flatMap(dy => [-1, 0, 1].flatMap(dz => [-1, 0, 1].map(dq =>
                (dx || dy || dz || dq) && grid[`${x+dx},${y+dy},${z+dz},${q+dq}`]))))
              .filter(x => x).length

          if (
            (grid[`${x},${y},${z},${q}`] && (c === 2 || c === 3))
            || (!grid[`${x},${y},${z},${q}`] && c === 3)) {
              nextGrid[`${x},${y},${z},${q}`] = '#';
          }
        }
      }
    }}

    grid = nextGrid
  }
  
  return Object.values(grid).filter(x => x === '#').length
}

// problem 1
solve(input, false)

// problem 2
solve(input, true)
