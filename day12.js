data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)
  .map(x => ({ a: x.substring(0, 1), v: parseInt(x.substring(1)) }))
  
// problem 1
dirs=[[1, 0], [0, 1], [-1, 0], [0, -1]]
res=data.reduce(({ x, y, d }, {a, v}) => {
  switch (a) {
    case 'N': y+=v; break;
    case 'E': x+=v; break;
    case 'S': y-=v; break;
    case 'W': x-=v; break;
    case 'F': x+= v*dirs[d][0]; y+=v*dirs[d][1]; break;
    case 'L': d=(d + v%90) % dirs.length; break;
    case 'R': d=(d - (v%90) + dirs.length) % dirs.length; break;
  }
  return {x, y, d}
}, { x: 0, y: 0, d: 0 })
Math.abs(res.x)+Math.abs(res.y)

// problem 2
function rotateL(x, y, a) {
    for (i = 0; i < a; i += 90) {
      [x, y] = [-y, x]
    }
    return [x, y]
}
res=data.reduce(({ x, y, wx, wy }, {a, v}) => {
    switch (a) {
    case 'N': wy+=v; break;
    case 'E': wx+=v; break;
    case 'S': wy-=v; break;
    case 'W': wx-=v; break;
    case 'F': x+=v*wx;y+=v*wy; break;
    case 'L': [wx, wy]=rotateL(wx, wy, v); break;
    case 'R': [wx, wy]=rotateL(wx, wy, 360-v); break;
    }
    return {x, y, wx, wy}
}, { x: 0, y: 0, wx: 10, wy: 1 })
Math.abs(res.x)+Math.abs(res.y)
