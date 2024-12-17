i = 0;
a = 51571418;
b = 0;
c = 0;
input = [2, 4, 1, 1, 7, 5, 0, 3, 1, 4, 4, 5, 5, 5, 3, 0];
output = [];

combo = x => (x < 4 ? x : [a, b, c][x - 4]);

ops = [
  x => {
    a = a >> combo(x);
    i += 2;
  },
  x => {
    b ^= x;
    i += 2;
  },
  x => {
    b = combo(x) % 8;
    i += 2;
  },
  x => {
    i = a === 0 ? i + 2 : x;
  },
  x => {
    b ^= c;
    i += 2;
  },
  x => {
    output.push(combo(x) % 8);
    i += 2;
  },
  x => {
    b = a >> combo(x);
    i += 2;
  },
  x => {
    c = a >> combo(x);
    i += 2;
  },
];


// Problem 1
while (i < input.length) {
  ops[input[i]](input[i + 1]);
}

x = output.join(',');

// Problem 2
as = [0];
for (let i of input.reverse()) {
  as = as.flatMap(a =>
    [...Array(8)]
      .map((_, j) => j)
      .filter(j => {
        const c = Math.floor((8 * a + j) / Math.pow(2, j^1)) % 8;
        return (j ^ 5 ^ c) % 8 === i;
      })
      .map(x => 8 * a + x)
  );
}
y = Math.min(...as);

[x, y];
