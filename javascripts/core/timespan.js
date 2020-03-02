"use strict";

class TimeSpan {
  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromYears(value) {
    return new TimeSpan(value * 31536e6);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromDays(value) {
    return new TimeSpan(value * 864e5);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromHours(value) {
    return new TimeSpan(value * 36e5);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMinutes(value) {
    return new TimeSpan(value * 6e4);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromSeconds(value) {
    return new TimeSpan(value * 1e3);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMilliseconds(value) {
    return new TimeSpan(value);
  }

  /**
   * @param {Number} ms
   */
  constructor(ms) {
    Guard.isNumber(ms, "Value 'ms' must be a number");
    this._ms = ms;
  }

  /**
   * @param {TimeSpan} other
   */
  copyFrom(other) {
    Guard.isTimeSpan(other);
    this._ms = other._ms;
  }

  /**
   * @param {Number} ms
   */
  setFrom(ms) {
    Guard.isNumber(ms);
    this._ms = ms;
  }

  /**
   * @returns {Number}
   */
  get years() {
    return Math.floor(this.totalYears);
  }

  /**
   * @returns {Number}
   */
  get days() {
    return Math.floor(this.totalDays % 365);
  }

  /**
   * @returns {Number}
   */
  get hours() {
    return Math.floor(this.totalHours % 24);
  }

  /**
   * @returns {Number}
   */
  get minutes() {
    return Math.floor(this.totalMinutes % 60);
  }

  /**
   * @returns {Number}
   */
  get seconds() {
    return Math.floor(this.totalSeconds % 60);
  }

  /**
   * @returns {Number}
   */
  get milliseconds() {
    return Math.floor(this.totalMilliseconds % 1e3);
  }

  /**
   * @returns {Number}
   */
  get totalYears() {
    return this._ms / 31536e6;
  }

  /**
   * @returns {Number}
   */
  get totalDays() {
    return this._ms / 864e5;
  }

  /**
   * @returns {Number}
   */
  get totalHours() {
    return this._ms / 36e5;
  }

  /**
   * @returns {Number}
   */
  get totalMinutes() {
    return this._ms / 6e4;
  }

  /**
   * @returns {Number}
   */
  get totalSeconds() {
    return this._ms / 1e3;
  }

  /**
   * @returns {Number}
   */
  get totalMilliseconds() {
    return this._ms;
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  plus(other) {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms + other._ms);
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  minus(other) {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms - other._ms);
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  times(other) {
    Guard.isNumber(other);
    return new TimeSpan(this._ms * other);
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  dividedBy(other) {
    Guard.isNumber(other);
    return new TimeSpan(this._ms / other);
  }

  /**
   * @returns {String}
   */
  toString() {
    if (this.years > 1e6) {
      return `${format(this.totalYears, 3, 0)} years`;
    }
    if (this.totalSeconds > 10) {
      return this.toStringNoDecimals();
    }
    return `${this.totalSeconds.toFixed(3)} seconds`;
  }

  /**
   * @returns {String}
   */
  toStringNoDecimals() {
    const parts = [];
    function addCheckedComponent(value, name) {
      if (value === 0) {
        return;
      }
      addComponent(value, name);
    }
    function addComponent(value, name) {
      parts.push(value === 1 ? `${formatInt(value)} ${name}` : `${formatInt(value)} ${name}s`);
    }
    addCheckedComponent(this.years, "year");
    addCheckedComponent(this.days, "day");
    addCheckedComponent(this.hours, "hour");
    addCheckedComponent(this.minutes, "minute");
    addCheckedComponent(this.seconds, "second");
    // Join with commas and 'and' in the end.
    if (parts.length === 0) return "0 seconds";
    return [parts.slice(0, -1).join(", "), parts.slice(-1)[0]].join(parts.length < 2 ? "" : " and ");
  }

  /**
   * @param {boolean} useHMS If true, will display times as HH:MM:SS in between a minute and 100 hours.
   * @returns {String}
   */
  toStringShort(useHMS = true) {
    const totalSeconds = this.totalSeconds;
    if (totalSeconds <= 1) {
      return `${format(1000 * totalSeconds)} ms`;
    }
    if (totalSeconds <= 10) {
      return `${format(totalSeconds, 0, 3)} seconds`;
    }
    if (totalSeconds <= 60) {
      return `${format(totalSeconds, 0, 2)} seconds`;
    }
    if (this.totalHours < 100) {
      if (useHMS && !Notations.current.isPainful) {
        return `${formatHMS(Math.floor(this.totalHours))}:${formatHMS(this.minutes)}:${formatHMS(this.seconds)}`;
      }
      if (this.totalMinutes < 60) {
        return `${format(this.totalMinutes, 0, 2)} minutes`;
      }
      if (this.totalHours < 24) {
        return `${format(this.totalHours, 0, 2)} hours`;
      }
    }
    if (this.totalDays < 500) {
      return `${format(this.totalDays, 0, 2)} days`;
    }
    return `${format(this.totalYears, 3, 2)} years`;

    function formatHMS(value) {
      const s = value.toString();
      return s.length === 1 ? `0${s}` : s;
    }
  }

  static get zero() {
    return new TimeSpan(0);
  }

  static get maxValue() {
    return new TimeSpan(Number.MAX_VALUE);
  }

  static get minValue() {
    return new TimeSpan(Number.MIN_VALUE);
  }
}

const Guard = {
  isDefined(value, message) {
    if (value !== undefined) return;
    if (message) throw message;
    throw "Value is defined";
  },
  isNumber(value, message) {
    if (typeof value === "number") return;
    if (message) throw message;
    throw "Value is not a number";
  },
  isTimeSpan(value, message) {
    if (value instanceof TimeSpan) return;
    if (message) throw message;
    throw "Value is not a TimeSpan";
  }
};
