data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)
  .map(x => x.split(''))
  
dirs = [-1, 0, 1].flatMap(x => [-1, 0, 1].map(y => ({ x, y })))
  .filter(({ x, y }) => x || y)

// problem 1
sentinel = [
  Array(data[0].length + 2).fill('.'),
  ...data.map(x => ['.', ...x, '.']),
  Array(data[0].length + 2).fill('.')]

loop=sentinel
while(true){
  next=loop.map((row, i) => row.map((ch, j) => {
    if (ch === '.') return '.';
    c = dirs.filter(({x, y}) => loop[x+i][y+j] === '#').length
    return c >= 4 ? 'L' : c ? ch : '#';
  }))
  
  if (next.every((row, i) => row.every((ch, j) => ch === loop[i][j]))) break;
  
  loop=next
}
loop.map(x => x.filter(y => y === '#').length).reduce((r, e) => r+e, 0)

// problem 2
function seat(d, i, j, x, y) {
    for(k=1;;k++) {
        try {
            ch=d[i + x*k][j + y*k]
            if (!ch || ch === 'L') return 0;
            if (ch === '#') return 1;
        } catch {
            return 0;
        }
    }
}

loop=data
while(true){
  next=loop.map((row, i) => row.map((ch, j) => {
    if (ch === '.') return '.';
    c = dirs.reduce((r, { x, y }) => r + seat(loop, i, j, x, y), 0)
    return c >= 5 ? 'L' : c ? ch : '#';
  }))
  
  if (next.every((row, i) => row.every((ch, j) => ch === loop[i][j]))) break;
  
  loop=next
}
loop.map(x => x.filter(y => y === '#').length).reduce((r, e) => r+e, 0)
