const DeltaTimeState = {
  deltaTime: new TimeSpan(0),
  unscaledDeltaTime: new TimeSpan(0),
  update(deltaTime, scale) {
    this.unscaledDeltaTime = TimeSpan.fromMilliseconds(deltaTime);
    this.deltaTime = TimeSpan.fromMilliseconds(deltaTime * scale);
  }
};

const Time = {
  /**
   * @param {Function} getValue
   * @returns {TimeSpan}
   */
  formMilliseconds(getValue) {
    return TimeSpan.fromMilliseconds(getValue());
  },
  /**
   * @param {TimeSpan} timespan
   * @param {Function} setValue
   */
  toMilliseconds(timespan, setValue) {
    Guard.isTimeSpan(timespan);
    setValue(timespan.totalMilliseconds);
  },

  /**
   * Frame delta time
   * @returns {TimeSpan}
   */
  get deltaTimeFull() {
    return DeltaTimeState.deltaTime;
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
    return DeltaTimeState.unscaledDeltaTime;
  },

  /**
   * @returns {TimeSpan}
   */
  get totalTimePlayed() {
    return this.formMilliseconds(() => player.totalTimePlayed);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set totalTimePlayed(timespan) {
    this.toMilliseconds(timespan, value => player.totalTimePlayed = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get realTimePlayed() {
    return this.formMilliseconds(() => player.realTimePlayed);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set realTimePlayed(timespan) {
    this.toMilliseconds(timespan, value => player.realTimePlayed = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisInfinity() {
    return this.formMilliseconds(() => player.thisInfinityTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisInfinity(timespan) {
    this.toMilliseconds(timespan, value => player.thisInfinityTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisInfinityRealTime() {
    return this.formMilliseconds(() => player.thisInfinityRealTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisInfinityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.thisInfinityRealTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestInfinity() {
    return this.formMilliseconds(() => player.bestInfinityTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestInfinity(timespan) {
    this.toMilliseconds(timespan, value => player.bestInfinityTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisEternity() {
    return this.formMilliseconds(() => player.thisEternity);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisEternity(timespan) {
    this.toMilliseconds(timespan, value => player.thisEternity = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisEternityRealTime() {
    return this.formMilliseconds(() => player.thisEternityRealTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisEternityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.thisEternityRealTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestEternity() {
    return this.formMilliseconds(() => player.bestEternity);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestEternity(timespan) {
    this.toMilliseconds(timespan, value => player.bestEternity = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisReality() {
    return this.formMilliseconds(() => player.thisReality);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisReality(timespan) {
    this.toMilliseconds(timespan, value => player.thisReality = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisRealityRealTime() {
    return this.formMilliseconds(() => player.thisRealityRealTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisRealityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.thisRealityRealTime = value);
  },
};