export const DeltaTimeState = {
  deltaTime: new TimeSpan(0),
  unscaledDeltaTime: new TimeSpan(0),
  update(deltaTime, gameDeltaTime) {
    this.unscaledDeltaTime = TimeSpan.fromMilliseconds(deltaTime);
    this.deltaTime = TimeSpan.fromMilliseconds(gameDeltaTime);
  }
};

export const Time = {
  /**
   * @param {Function} getValue
   * @returns {TimeSpan}
   */
  fromMilliseconds(getValue) {
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
   * Returns a string indicating the current date and time of day, as indicated by a Date.now() timestamp. After
   * regex formatting, this gives a string resembling "[month] [day] [year] HH:MM:SS"
   * @param {number} timestamp
   * @returns {string}
   */
  toDateTimeString(timestamp) {
    return new Date(timestamp).toString().replace(/^.{4}(.*:..:..).*$/u, "$1");
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
   * Frame delta time, but without EC12 or black hole effects
   * @returns {TimeSpan}
   */
  get unscaledDeltaTime() {
    return DeltaTimeState.unscaledDeltaTime;
  },

  /**
   * @returns {TimeSpan}
   */
  get totalTimePlayed() {
    return this.fromMilliseconds(() => player.records.totalTimePlayed);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set totalTimePlayed(timespan) {
    this.toMilliseconds(timespan, value => player.records.totalTimePlayed = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get timeSinceBlackHole() {
    return this.fromMilliseconds(() => {
      const diff = player.records.totalTimePlayed - player.records.timePlayedAtBHUnlock;
      return Math.max(0, diff);
    });
  },

  /**
   * @returns {TimeSpan}
   */
  get realTimeDoomed() {
    return this.fromMilliseconds(() => player.records.realTimeDoomed);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set realTimeDoomed(timespan) {
    this.toMilliseconds(timespan, value => player.records.realTimeDoomed = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get realTimePlayed() {
    return this.fromMilliseconds(() => player.records.realTimePlayed);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set realTimePlayed(timespan) {
    this.toMilliseconds(timespan, value => player.records.realTimePlayed = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisInfinity() {
    return this.fromMilliseconds(() => player.records.thisInfinity.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisInfinity(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisInfinity.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisInfinityRealTime() {
    return this.fromMilliseconds(() => player.records.thisInfinity.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisInfinityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisInfinity.realTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestInfinity() {
    return this.fromMilliseconds(() => player.records.bestInfinity.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestInfinity(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestInfinity.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestInfinityRealTime() {
    return this.fromMilliseconds(() => player.records.bestInfinity.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestInfinityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestInfinity.realTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisEternity() {
    return this.fromMilliseconds(() => player.records.thisEternity.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisEternity(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisEternity.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisEternityRealTime() {
    return this.fromMilliseconds(() => player.records.thisEternity.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisEternityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisEternity.realTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestEternity() {
    return this.fromMilliseconds(() => player.records.bestEternity.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestEternity(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestEternity.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestEternityRealTime() {
    return this.fromMilliseconds(() => player.records.bestEternity.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestEternityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestEternity.realTime = value);
  },


  /**
   * @returns {TimeSpan}
   */
  get thisReality() {
    return this.fromMilliseconds(() => player.records.thisReality.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisReality(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisReality.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisRealityRealTime() {
    return this.fromMilliseconds(() => player.records.thisReality.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisRealityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.thisReality.realTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestReality() {
    return this.fromMilliseconds(() => player.records.bestReality.time);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestReality(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestReality.time = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get bestRealityRealTime() {
    return this.fromMilliseconds(() => player.records.bestReality.realTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestRealityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.records.bestReality.realTime = value);
  },

  /**
   * @return {TimeSpan}
   */
  get worstChallenge() {
    return this.fromMilliseconds(() => GameCache.worstChallengeTime.value);
  },

  /**
   * @return {TimeSpan}
   */
  get challengeSum() {
    return this.fromMilliseconds(() => GameCache.challengeTimeSum.value);
  },

  /**
   * @return {TimeSpan}
   */
  get infinityChallengeSum() {
    return this.fromMilliseconds(() => GameCache.infinityChallengeTimeSum.value);
  }
};
