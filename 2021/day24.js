// This was a weird puzzle. The biggest challenge was figuring out what was asked.
//
// Observation 1:
// After each input read, the code block is more or less the same. The only difference
// are 2 constants (which I'll call b and c lateron) and whether or not z is divided by 26,
// which I'll call push (not divided by 26) and pop (divided by 26) lateron.
//
// Observation 2:
// The code block after each input block can be simplified to this:
//
//     x = z % 26;
//     z = z / 26;                  // this line is only in half the blocks
//     if (a[i] !== x + b[i]) {
//       z = 26 * z + a[i] + c[i];
//     }
//
// Observation 3:
// Because a[i] + c[i] < 26 holds for all a[i] and c[i], we are effectively building a number
// in base 26. x = z % 26, so x is always the least significant digit of this number, which is
// a[j] + c[j] for some j < i.
//
// Observation 4:
// Therefore, the if becomes
//
//    if (a[i] !== a[j] + c[j] + b[i])
//
// which might not be possible for all combinations of c[j] and b[i]. | a[i] - a[j] | < 9, so
// if | c[j] + b[i] | >= 9, the if branch will always be executed.
//
// Observation 5:
// c[i] > 0 for all i and b[i] >= 10 for all i where we push. So we don't even have to do any math,
// we just need to make sure that a[i] === a[j] + c[j] + b[i] holds for all i where we pop.
// We can do this by pushing (i, c[i]) pairs to a stack on push and adding (i, j, b[i], c[j])
// constraints to a list on pop.

input = document.querySelector('pre').firstChild.textContent;

block = `inp w
mul x 0
add x z
mod x 26
div z (\\d+)
add x (-?\\d+)
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y (-?\\d+)
mul y x
add z y`;

constraints = [...input.matchAll(new RegExp(block, 'g'))]
  .map((m) => m.slice(1).map((x) => parseInt(x)))
  .map(([push, b, c]) => ({ push: push === 1, b, c }))
  .reduce(
    ({ stack, constraints }, { push, b, c }, i) => ({
      constraints: push
        ? constraints
        : [...constraints, { ...stack.pop(), low: i, b }],
      stack: push ? [...stack, { high: i, c }] : stack,
    }),
    { stack: [], constraints: [] }
  ).constraints;

// turn constraints of type `a[low] = a[high] + b[low] + c[high]` into a solution
toSolution = (selectMostSignificantDigit) =>
  constraints
    .reduce((r, { high, low, b, c }) => {
      r[high] = selectMostSignificantDigit(b + c);
      r[low] = r[high] + b + c;
      return r;
    }, Array(14))
    .join('');

// problem 1
toSolution((diff) => 9 - Math.max(diff, 0));

// problem 2
toSolution((diff) => 1 - Math.min(diff, 0));
