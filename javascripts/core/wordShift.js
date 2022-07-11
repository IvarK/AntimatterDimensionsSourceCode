function predictableRandom(x) {
  let start = Math.pow(x % 97, 4.3) * 232344573;
  const a = 15485863;
  const b = 521791;
  start = (start * a) % b;
  for (let i = 0; i < (x * x) % 90 + 90; i++) {
    start = (start * a) % b;
  }
  return start / b;
}

function randomSymbol() {
  return String.fromCharCode(Math.floor(Math.random() * 50) + 192);
}

export default {
  wordCycle(list, noBuffer = false) {
    const len = list.length;
    const tick = Math.floor(Date.now() / 250) % (len * 5);
    const largeTick = Math.floor(tick / 5);
    let v = list[largeTick];
    if (tick % 5 < 1 || tick % 5 > 3) {
      v = this.randomCrossWords(v);
    }
    if (noBuffer) return v;

    const maxWordLen = Math.max(...list.map(x => x.length));
    const bufferSpace = (maxWordLen - v.length) / 2;

    // Buffer the result with ALT+255 on either side to prevent the ui from twitching.
    // Spaces do not work due to being automatically collapsed, and css fixing this causes other issues.
    return " ".repeat(Math.ceil(bufferSpace)) + v + " ".repeat(Math.floor(bufferSpace));
  },
  randomCrossWords(str) {
    const x = str.split("");
    for (let i = 0; i < x.length / 1.7; i++) {
      const randomIndex = Math.floor(predictableRandom(Math.floor(Date.now() / 500) % 964372 + i) * x.length);
      x[randomIndex] = randomSymbol();
    }
    return x.join("");
  }
};
