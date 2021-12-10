data = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .map((x) => x.split(''));

open = '([{<';
close = ')]}>';

// compute invalid inputs (for problem 1) and remaining stacks (for problem 2)
// the problems use different rows, so we can compute both in one go
stacksAndInvalidInputs = data.map((x) => {
  stack = [];
  for (c of x) {
    if (open.includes(c)) {
      stack.push(open.indexOf(c));
    } else if (stack.pop() !== close.indexOf(c)) {
      return close.indexOf(c);
    }
  }
  return stack;
});

// problem 1
score = [3, 57, 1197, 25137];
stacksAndInvalidInputs
  .filter((x) => !Array.isArray(x))
  .reduce((s, e) => s + score[e], 0);

// problem 2
filtered = stacksAndInvalidInputs.filter((x) => x.length > 0);
filtered
  .map((x) => x.reverse().reduce((s, e) => 5 * s + e + 1, 0))
  .sort((x, y) => x - y)[(filtered.length - 1) / 2];
