data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter((x) => x)
  .map((x) => {
    parts = x.split(' ');
    return { command: parts[0], size: parseInt(parts[1]) };
  });

// problem 1
data
  .reduce(
    ([x, y], { command, size }) => [
      x + (command === 'forward' ? size : 0),
      y + (command === 'down' ? size : command === 'up' ? -size : 0),
    ],
    [0, 0]
  )
  .reduce((p, e) => p * e, 1);

// problem 2
data
  .reduce(
    ([x, y, aim], { command, size }) =>
      command === 'forward'
        ? [x + size, y + size * aim, aim]
        : [x, y, aim + (command === 'down' ? size : -size)],
    [0, 0, 0]
  )
  .slice(0, 2)
  .reduce((p, e) => p * e, 1);
