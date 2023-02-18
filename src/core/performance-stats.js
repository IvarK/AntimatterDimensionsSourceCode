export const PerformanceStats = {
  container: document.getElementById("performance-stats"),
  samplePeriod: 10 * 1000,
  isOn: false,
  currentBlocks: [],
  stats: {},
  turnOn() {
    this.isOn = true;
    this.container.style.display = "flex";
  },
  turnOff() {
    this.isOn = false;
    this.container.style.display = "none";
    this.stats = {};
  },
  toggle() {
    if (this.isOn) this.turnOff();
    else this.turnOn();
  },
  start(blockName) {
    if (!this.isOn) return;
    const blockRoot = this.currentBlocks.length > 0 ? this.currentBlocks.last().childBlocks : this.stats;
    let block = blockRoot[blockName];
    if (block === undefined) {
      block = {
        records: [],
        childBlocks: {}
      };
      blockRoot[blockName] = block;
    }
    this.currentBlocks.push(block);
    const record = {};
    block.records.push(record);
    record.timestamp = performance.now();
  },
  end() {
    if (!this.isOn) return;
    const now = performance.now();
    const block = this.currentBlocks.pop();
    const record = block.records.last();
    record.duration = now - record.timestamp;
  },
  render() {
    if (!this.isOn) return;
    let indentLevel = -1;
    let text = "";
    const samplePeriod = this.samplePeriod;
    let fps;
    function render(rootBlock) {
      indentLevel++;
      for (const blockName in rootBlock) {
        if (!Object.prototype.hasOwnProperty.call(rootBlock, blockName)) continue;
        const block = rootBlock[blockName];
        const records = block.records;
        while (records.length > 1 && records.last().timestamp - records.first().timestamp > samplePeriod) {
          records.shift();
        }
        text += `${"-".repeat(indentLevel)}${blockName}: `;
        if (records.length > 0) {
          let sum = 0;
          let max = Number.MIN_VALUE;
          let min = Number.MAX_VALUE;
          for (const record of records) {
            const duration = record.duration;
            sum += duration;
            if (duration > max) max = duration;
            if (duration < min) min = duration;
          }
          const average = sum / records.length;
          if (fps === undefined) {
            // We are at root frame block
            fps = 1000 / average;
            text = `FPS: ${Math.floor(fps)}<br>${text}`;
          }
          text += `${average.toFixed(3)}/${min.toFixed(3)}/${max.toFixed(3)}`;
        }
        text += "<br>";
        render(block.childBlocks);
      }
      indentLevel--;
    }
    render(this.stats);
    this.container.innerHTML = text;
  }
};
