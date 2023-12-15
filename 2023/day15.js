data = document.querySelector('pre').firstChild.data.split('\n')[0].split(',');

hash = x => x.split('').reduce((h, x) => (17 * (h + x.charCodeAt(0))) % 256, 0);

// problem 1
a = data.map(hash).reduce((s, x) => s + x);

// problem 2
b = data
  .reduce(
    (boxes, x) => {
      let [label, focalLength] = x.split(/[-=]/);
      boxIndex = hash(label);
      box = boxes[boxIndex];
      slotIndex = box.findIndex(x => x.label === label);

      if (x.includes('=')) {
        if (slotIndex >= 0) {
          box[slotIndex].focalLength = focalLength;
        } else {
          box.push({ label, focalLength });
        }
      } else if (slotIndex >= 0) {
        boxes[boxIndex] = [
          ...box.slice(0, slotIndex),
          ...box.slice(slotIndex + 1),
        ];
      }

      return boxes;
    },
    [...Array(256)].map(() => [])
  )
  .reduce(
    (sum, box, boxIndex) =>
      sum +
      (boxIndex + 1) *
        box.reduce(
          (sum, slot, slotIndex) =>
            sum + (slotIndex + 1) * parseInt(slot.focalLength, 10),
          0
        ),
    0
  );

[a, b];
