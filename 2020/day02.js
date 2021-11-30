data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)
  .map(x => {
    parts = x.split(' ');
    return { 
      min: parts[0].split('-')[0],
      max: parts[0].split('-')[1],
      letter: parts[1][0],
      text: parts[2],
    };
   });

// problem 1
solution1 = data.filter(x => {
  count = x.text.split('').filter(y => y === x.letter).length;
  return x.min <= count && count <= x.max;
})
console.log(solution1.length)

// problem 2
solution2 = data.filter(x => {
  a = x.text.charAt(x.min-1) === x.letter;
  b = x.text.charAt(x.max-1) === x.letter;
  return (a || b) && !(a && b);
})
console.log(solution2.length)
