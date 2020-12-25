data=document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)

a=parseInt(data[0])
b=parseInt(data[1])
p=20201227

x=1
y=1
while (x !== a) {
  x = (x * 7) % p
  y = (y * b) % p
}
y
