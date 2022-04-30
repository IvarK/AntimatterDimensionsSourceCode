
export default {
  wordCycle(list) {
    const len = list.length;
    const tick = Math.floor(Date.now() / 200) % (len * 5);
    const largeTick = Math.floor(tick / 5);
    let v = list[largeTick];
    if (tick % 5 < 1 || tick % 5 > 3) {
      v = this.randomCrossWords(v);
    }
    return v;
  },
  randomCrossWords(str) {
    const x = str.split("");
    for (let i = 0; i < x.length / 1.7; i++) {
      const randomIndex = Math.floor(this.predictableRandom(Math.floor(Date.now() / 500) % 964372 + i) * x.length);
      x[randomIndex] = this.randomSymbol;
    }
    return x.join("");
  },
  predictableRandom(x) {
    let start = Math.pow(x % 97, 4.3) * 232344573;
    const a = 15485863;
    const b = 521791;
    start = (start * a) % b;
    for (let i = 0; i < (x * x) % 90 + 90; i++) {
      start = (start * a) % b;
    }
    return start / b;
  },
  get randomSymbol() {
    return String.fromCharCode(Math.floor(Math.random() * 50) + 192);
  }
};
