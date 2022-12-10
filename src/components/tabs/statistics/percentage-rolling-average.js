const MAX_DATA_POINTS = 10;

export class PercentageRollingAverage {
  constructor() {
    this.dataPoints = [];
  }

  add(dataPoint) {
    this.dataPoints.push(dataPoint);
    if (this.dataPoints.length > MAX_DATA_POINTS) {
      this.dataPoints.shift();
    }
  }

  get average() {
    const dataPoints = this.dataPoints.filter(p => p !== undefined);
    if (dataPoints.length === 0) {
      return [];
    }

    const average = [];
    const reference = dataPoints[0];
    for (let i = 0; i < reference.length; i++) {
      average[i] = dataPoints.map(p => p[i]).sum() / dataPoints.length;
    }

    return average;
  }

  clear() {
    this.dataPoints = [];
  }
}
