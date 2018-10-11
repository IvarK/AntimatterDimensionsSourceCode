class TimeSpan {
  static fromYears(value) {
    return new TimeSpan(value * 31536e6);
  }

  static fromDays(value) {
    return new TimeSpan(value * 864e5);
  }

  static fromHours(value) {
    return new TimeSpan(value * 36e5);
  }

  static fromMinutes(value) {
    return new TimeSpan(value * 6e4);
  }

  static fromSeconds(value) {
    return new TimeSpan(value * 1e3);
  }

  static fromMilliseconds(value) {
    return new TimeSpan(value);
  }

  constructor(ms) {
    this._ms = ms;
  }

  get years() {
    return Math.floor(this.totalYears);
  }

  get days() {
    return Math.floor(this.totalDays % 365);
  }

  get hours() {
    return Math.floor(this.totalHours % 24);
  }

  get minutes() {
    return Math.floor(this.totalMinutes % 60);
  }

  get seconds() {
    return Math.floor(this.totalSeconds % 60);
  }

  get milliseconds() {
    return Math.floor(this.totalMilliseconds % 1e3);
  }

  get totalYears() {
    return this._ms / 31536e6;
  }

  get totalDays() {
    return this._ms / 864e5;
  }

  get totalHours() {
    return this._ms / 36e5;
  }

  get totalMinutes() {
    return this._ms / 6e4;
  }

  get totalSeconds() {
    return this._ms / 1e3;
  }

  get totalMilliseconds() {
    return this._ms;
  }
}

TimeSpan.zero = new TimeSpan(0);
TimeSpan.maxValue = new TimeSpan(Number.MAX_VALUE);
TimeSpan.minValue = new TimeSpan(Number.MIN_VALUE);