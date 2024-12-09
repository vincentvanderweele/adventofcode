input = document
  .querySelector('pre')
  .firstChild.data.split('')
  .map(x => parseInt(x, 10))
  .filter(x => !isNaN(x));

blocks = input.map((x, i) => ({
  isFile: i % 2 === 0,
  value: i / 2,
  length: x,
  remaining: x,
}));

// Problem 1
i = 0;
j = input.length - 1;
k = 0;
a = 0;
while (i <= j) {
  bi = blocks[i];
  bj = blocks[j];

  if (bi.remaining === 0) {
    i++;
    continue;
  }

  if (bi.isFile) {
    a += bi.value * k++;
    bi.remaining--;
    continue;
  }

  if (bj.remaining === 0) {
    j -= 2;
    continue;
  }

  a += bj.value * k++;
  bi.remaining--;
  bj.remaining--;
}
a;

// Problem 2
for (j = input.length - 1; j > 0; j--) {
  bj = blocks[j];
  if (!bj.isFile) continue;

  for (i = 0; i < j; i++) {
    bi = blocks[i];

    if (bi.isFile || bi.length < bj.length) continue;

    blocks[j] = { isFile: false, length: bj.length };

    if (bi.length === bj.length) {
      blocks[i] = bj;
    } else {
      blocks.splice(i, 1, bj, {
        isFile: false,
        length: bi.length - bj.length,
      });
      j++;
    }
    break;
  }
}

b = 0;
k = 0;
for (let block of blocks) {
  if (block.isFile) {
    for (i = 0; i < block.length; i++) {
      b += block.value * k++;
    }
  } else {
    k += block.length;
  }
}
b;

[a, b];
