function solve(n) {
  data = [0,13,1,8,6,15]
  last=data.reduce((r, e, i)=>({ ...r, [e]: i }), {})
  next = 0
  for(i=data.length; i < n; i++) {
	  if (i % 500000 === 0) { console.log(i); }
  	answer = next
  	current = last[next] === undefined ? 0 : (i - last[next]);
  	last[next] = i;
  	next = current;
  }
  return answer
}

// problem 1
solve(2020)

// problem 2
solve(30000000)
