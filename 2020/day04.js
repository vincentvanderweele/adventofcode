data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n\n')
  .filter(x => x)
  .map(x => x.replaceAll('\n', ' ').split(' '));
  
// problem 1
fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
data
  .map(x => x.map(y => y.split(':')[0]))
  .filter(x => fields.every(y => x.includes(y)))
  .length;
  
// problem 2
fields = [
  { k: 'byr', v: x => x && x.length === 4 && parseInt(x) >= 1920 && parseInt(x) <= 2002 },
  { k: 'iyr', v: x => x && x.length === 4 && parseInt(x) >= 2010 && parseInt(x) <= 2020 },
  { k: 'eyr', v: x => x && x.length === 4 && parseInt(x) >= 2020 && parseInt(x) <= 2030 },
  { k: 'hgt', v: x => {
    if (!x) return false;
    cm = x.match(/^(\d+)cm$/);
    cm = cm && parseInt(cm[1]);
    inch = x.match(/^(\d+)in$/);
    inch = inch && parseInt(inch);
    return (cm >= 150 && cm <= 193) || (inch >= 59 && inch <= 76);
  }},
  { k: 'hcl', v: x => /^#[0-9a-f]{6}$/.test(x) },
  { k: 'ecl', v: x => /^amb|blu|brn|gry|grn|hzl|oth$/.test(x) },
  { k: 'pid', v: x => /^\d{9}$/.test(x) },
];
data
  .map(x => x.reduce((r, y) => { [k, v] = y.split(':'); r[k] = v; return r } }, {}))
  .filter(x => fields.every(y => y.v(x[y.k])))
  .length;
