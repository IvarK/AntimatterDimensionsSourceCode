"use strict";

const DeltaTimeState = {
  deltaTime: new TimeSpan(0),
  unscaledDeltaTime: new TimeSpan(0),
  update(deltaTime, gameDeltaTime) {
    this.unscaledDeltaTime = TimeSpan.fromMilliseconds(deltaTime);
    this.deltaTime = TimeSpan.fromMilliseconds(gameDeltaTime);
  }
};

const Time = {
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
    return this.fromMilliseconds(() => player.totalTimePlayed);
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
    return this.fromMilliseconds(() => player.realTimePlayed);
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
    return this.fromMilliseconds(() => player.thisInfinityTime);
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
    return this.fromMilliseconds(() => player.thisInfinityRealTime);
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
    return this.fromMilliseconds(() => player.bestInfinityTime);
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
  get bestInfinityRealTime() {
    return this.fromMilliseconds(() => player.bestInfinityRealTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestInfinityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.bestInfinityRealTime = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisEternity() {
    return this.fromMilliseconds(() => player.thisEternity);
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
    return this.fromMilliseconds(() => player.thisEternityRealTime);
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
    return this.fromMilliseconds(() => player.bestEternity);
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
    return this.fromMilliseconds(() => player.thisReality);
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
  get bestReality() {
    return this.fromMilliseconds(() => player.bestReality);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set bestReality(timespan) {
    this.toMilliseconds(timespan, value => player.bestReality = value);
  },

  /**
   * @returns {TimeSpan}
   */
  get thisRealityRealTime() {
    return this.fromMilliseconds(() => player.thisRealityRealTime);
  },
  /**
   * @param {TimeSpan} timespan
   */
  set thisRealityRealTime(timespan) {
    this.toMilliseconds(timespan, value => player.thisRealityRealTime = value);
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
