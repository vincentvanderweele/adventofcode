commands = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x);

parse = (subtree = { _files: [] }) => {
  while (command = commands.shift()) {
    if (command === '$ ls' || command.startsWith('dir')) continue;
    if (command.startsWith('$ cd')) {
      let dir = command.split(' ')[2];
      if (dir === '..') return subtree;
      subtree[dir] = parse(subtree[dir]);
    } else {
      let [size, name] = command.split(' ');
      subtree._files.push({ name, size: parseInt(size) });
    }
  }
  return subtree;
};

dirSizes = tree => {
  subSizes = Object.entries(tree)
    .filter(([dir]) => dir !== '_files')
    .map(([, subtree]) => dirSizes(subtree));
  return [
    [...tree._files.map(x => x.size), ...subSizes.map(x => x[0])].reduce(
      (s, x) => s + x,
      0
    ),
    ...subSizes.flat(),
  ];
};

sizes = dirSizes(parse());

// problem 1
sizes.filter(x => x <= 100000).reduce((s, x) => s + x, 0);

// problem 2
Math.min(...sizes.filter(x => x >= sizes[0] - 40000000));
