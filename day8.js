data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)
  
ops = data.map(x => {o: x.split(' ')[0], v: parseInt(x.split(' ')[1])})
  
// problem 1
seen=new Set(), a=0, i=0
while(!seen.has(i)) {
    seen.add(i)
    switch (ops[i].o) {
      case 'acc': a+=ops[i].v; i++; break;
      case 'jmp': i+=ops[i].v; break;
      default: i++;
    }
}
a

// problem 2
function solve(ops) {
	seen=new Set(), a=0, i=0
	while(!seen.has(i) && i < ops.length) {
    seen.add(i)
    switch (ops[i].o) {
    case 'acc': a+=ops[i].v; i++; break;
    case 'jmp': i+=ops[i].v; break;
    default: i++;
    }
	}
	return i === ops.length ? a : -1;
}
ops.map((x, i) => x.o === 'acc' 
    ? ops
    : ops.map((y, j) => i === j 
      ? ({ o: y.o === 'nop' ? 'jmp' : 'nop', v: y.v })
      : y))
  .map(solve)
  .filter(x => x !== -1)[0]
