// problem 1
target=1008713
data='13,x,x,41,x,x,x,x,x,x,x,x,x,467,x,x,x,x,x,x,x,x,x,x,x,19,x,x,x,x,17,x,x,x,x,x,x,x,x,x,x,x,29,x,353,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,23'
  .split(',')
  .map(x=>parseInt(x))
  .filter(x=>!isNaN(x))
data.map(x=>x-target%x)[2]*data[2]

// problem 2
data='13,x,x,41,x,x,x,x,x,x,x,x,x,467,x,x,x,x,x,x,x,x,x,x,x,19,x,x,x,x,17,x,x,x,x,x,x,x,x,x,x,x,29,x,353,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,23'
  .split(',')
  .map((x, i) => ({o: i, v: parseInt(x)}))
  .filter(({v})=>!isNaN(v))
data.reduce(({ o, v }, x) => {
	i=o
	while((i+x.o)%x.v) {i+=v}
	return { o: i, v: v*x.v }
})[o]
