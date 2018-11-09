const DeltaTimeInfo = {
  deltaTime: new TimeSpan(0),
  unscaledDeltaTime: new TimeSpan(0),
  update(deltaTime, scale) {
    this.unscaledDeltaTime = TimeSpan.fromMilliseconds(deltaTime);
    this.deltaTime = TimeSpan.fromMilliseconds(deltaTime * scale);
  }
};

const Time = {
  /**
   * @param {Function} getter
   * @returns {TimeSpan}
   */
  getMilliseconds(getter) {
    return TimeSpan.fromMilliseconds(getter());
  },
  /**
   * @param {TimeSpan} timespan
   * @param {Function} setter
   */
  setMilliseconds(timespan, setter) {
    Guard.isTimeSpan(timespan);
    setter(timespan.totalMilliseconds);
  },

  /**
   * Frame delta time
   * @returns {TimeSpan}
   */
  get deltaTimeFull() {
    return DeltaTimeInfo.deltaTime;
  },
  /**
   * Frame delta time in seconds
   * @returns {number}
   */
  get deltaTime() {
    return this.deltaTimeFull.totalSeconds;
  },
  /**
   * Frame delta time in ms
   * @returns {number}
   */
  get deltaTimeMs() {
    return this.deltaTimeFull.totalMilliseconds;
  },
  /**
   * Frame delta time, but without EC12 or wormhole effects
   * @returns {TimeSpan}
   */
  get unscaledDeltaTime() {
    return DeltaTimeInfo.unscaledDeltaTime;
  },

  /**
   * @returns {TimeSpan}
   */
  get totalTimePlayed() {
    return this.getMilliseconds(() => player.totalTimePlayed);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set totalTimePlayed(timespan) {
    this.setMilliseconds(timespan, value => player.totalTimePlayed = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get realTimePlayed() {
    return this.getMilliseconds(() => player.realTimePlayed);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set realTimePlayed(timespan) {
    this.setMilliseconds(timespan, value => player.realTimePlayed = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisInfinity() {
    return this.getMilliseconds(() => player.thisInfinityTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisInfinity(timespan) {
    this.setMilliseconds(timespan, value => player.thisInfinityTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestInfinity() {
    return this.getMilliseconds(() => player.bestInfinityTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestInfinity(timespan) {
    this.setMilliseconds(timespan, value => player.bestInfinityTime = value);
  },
};