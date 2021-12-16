input = document
  .querySelector('pre')
  .firstChild.textContent.trim()
  .split('')
  .map((x) => `000${parseInt(x, 16).toString(2)}`.slice(-4))
  .join('');

parse = (bits) => {
  const version = parseInt(bits.slice(0, 3), 2);
  const type = parseInt(bits.slice(3, 6), 2);

  // constant
  if (type === 4) {
    let end = 6;
    let valueBits = '';

    do {
      end += 5;
      valueBits += bits.slice(end - 4, end);
    } while (bits[end - 5] === '1');

    return [{ version, type, value: parseInt(valueBits, 2) }, bits.slice(end)];
  }

  // operator
  let remainingBits = bits;
  let maxSubPackets = Number.MAX_SAFE_INTEGER;
  let minRemainingBits = 0;

  if (bits[6] === '0') {
    remainingBits = bits.slice(22);
    minRemainingBits = remainingBits.length - parseInt(bits.slice(7, 22), 2);
  } else {
    remainingBits = bits.slice(18);
    maxSubPackets = parseInt(bits.slice(7, 18), 2);
  }

  const packets = [];
  while (
    packets.length < maxSubPackets &&
    remainingBits.length > minRemainingBits
  ) {
    const parsed = parse(remainingBits);
    packets.push(parsed[0]);
    remainingBits = parsed[1];
  }

  return [{ version, type, packets }, remainingBits];
};

[packet, _] = parse(input);

// problem 1
sumVersions = (p) =>
  p.version + (p.packets ?? []).reduce((s, x) => s + sumVersions(x), 0);
sumVersions(packet);

// problem 2
calculate = (p) => {
  switch (p.type) {
    case 0:
      return p.packets.reduce((r, x) => r + calculate(x), 0);
    case 1:
      return p.packets.reduce((r, x) => r * calculate(x), 1);
    case 2:
      return p.packets.reduce(
        (r, x) => Math.min(r, calculate(x)),
        Number.POSITIVE_INFINITY
      );
    case 3:
      return p.packets.reduce(
        (r, x) => Math.max(r, calculate(x)),
        Number.NEGATIVE_INFINITY
      );
    case 4:
      return p.value;
    case 5:
      return calculate(p.packets[0]) > calculate(p.packets[1]) ? 1 : 0;
    case 6:
      return calculate(p.packets[0]) < calculate(p.packets[1]) ? 1 : 0;
    case 7:
      return calculate(p.packets[0]) === calculate(p.packets[1]) ? 1 : 0;
  }
};

calculate(packet);
