// This was a weird puzzle. The biggest challenge was figuring out what was asked.
//
// Observation 1:
// After each input read, the code block is more or less the same. The only difference
// are 2 constants (which I'll call b and c lateron) and whether or not z is divided by 26.
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
// The state space is actually really small. We can model the problem as a list of stacks of c[j]
// choices.
// - If z = z / 26 for this block, we pop the last element from each stack.
// - If | c[j] + b[i] | >= 9, we don't have a choice at all and just push c[i] to the stack.
// - If | c[j] + b[i] | < 9, we can choose whether to match a[i] and a[j] or not, so the stack splits in two
//   - push c[i] to the stack and mark the constraint a[i] - a[j] !== c[j] + b[i]
//   - don't push anything and mark the constraint a[i] - a[j] === c[j] + b[i]
// A valid state is one that ends with an empty stack.

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

inputs = [...input.matchAll(new RegExp(block, 'g'))]
  .map((m) => m.slice(1).map((x) => parseInt(x)))
  .map(([pop, b, c]) => ({ pop: pop === 26, b, c }));

constraints = inputs
  .reduce(
    (stacks, { pop, b, c }, index) =>
      stacks.flatMap(({ stack, constraints }) => {
        if (!stack.length) return { stack: [{ index, c }], constraints: [] };

        let { index: lastIndex, c: lastC } = stack[stack.length - 1];
        if (pop) stack.pop();

        result = [{ stack: [...stack, { index, c }], constraints }];
        if (Math.abs(b + lastC) < 9) {
          result.push({
            stack,
            constraints: [...constraints, [lastIndex, index, b + lastC]],
          });
        }
        return result;
      }),
    [{ stack: [], constraints: [] }]
  )
  .find(({ stack }) => stack.length === 0).constraints;

// problem 1
constraints
  .reduce(
    (r, [high, low, diff]) => {
      r[high] = 9 - Math.max(diff, 0);
      r[low] = 9 + Math.min(diff, 0);
      return r;
    },
    [...Array(14)]
  )
  .join('');

// problem 2
constraints
  .reduce(
    (r, [high, low, diff]) => {
      r[high] = 1 - Math.min(diff, 0);
      r[low] = 1 + Math.max(diff, 0);
      return r;
    },
    [...Array(14)]
  )
  .join('');
