import LocalStorageUtil from 'util/local-storage-util';

const COLORS = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink'];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor(key) {
  const saved = LocalStorageUtil.getFieldForComponent('colors', key);
  if (saved) {
    return saved;
  }

  const idx = getRandomInt(0, COLORS.length);
  const color = COLORS[idx];
  LocalStorageUtil.saveFieldForComponent('colors', key, color);
  return color;
}

export {
  randomColor
}
