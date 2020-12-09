data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)
  .map(x => parseInt(x))
  
// problem 1
w=25
t = data.filter((x, i) => 
  i >= w 
  && !data.slice(i-w, i)
     .reduce((s, y) => { 
       data.slice(i-w, i)
         .forEach(z => s.add(y+z));
       return s
     }, new Set())
     .has(x)
  )[0]

// problem 2
i=0, j=0, s=0
while(s !== t) s+=s<t?data[j++]:-data[i++]
r=data.slice(i, j).sort((a, b) => a-b)
r[0]+r[r.length-1]
