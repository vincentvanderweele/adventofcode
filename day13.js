target=1008713
data='13,x,x,41,x,x,x,x,x,x,x,x,x,467,x,x,x,x,x,x,x,x,x,x,x,19,x,x,x,x,17,x,x,x,x,x,x,x,x,x,x,x,29,x,353,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,23'

// problem 1
data
  .split(',')
  .map(x=>parseInt(x))
  .filter(x=>!isNaN(x))
  .map(x=>x-target%x)[2]*467

// problem 2
data
  .split(',')
  .map((x, i) => ({o: i, v: parseInt(x)}))
  .filter(({v})=>!isNaN(v))
  .reduce(({ o, v }, x) => {
    while((o+x.o)%x.v) {o+=v}
    return { o, v: v*x.v }
  }).o
