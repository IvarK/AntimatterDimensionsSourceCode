"use strict";

/**
 * Async is used for making a big pile of computation into a manageable
 * set of batches that don't lock up the UI.
 * run() is the nominal entry point.
 */
const Async = {
  _enabled: true,
  get enabled() {
    return this._enabled;
  },
  set enabled(val) {
    this._enabled = val;
  },
  runForTime(fun, maxIter, config) {
    const batchSize = config.batchSize || 1;
    const maxTime = config.maxTime;
    const t0 = Date.now();
    for (let remaining = maxIter; remaining > 0;) {
      for (let j = 0; j < Math.min(remaining, batchSize); ++j) {
        fun(remaining);
        --remaining;
      }
      if (Date.now() - t0 >= maxTime) return remaining;
    }
    return 0;
  },
  sleepPromise: ms => new Promise(resolve => setTimeout(resolve, ms)),
  /**
   * Asynchronously run the specified function maxIter times, letting the event
   * loop run periodically. The function is run in chunks of config.batchSize;
   * when the elapsed time reaches a specified amount, execution will pause for
   * config.sleepTime
   * @param {function} fun Function to run (e.g. do some computation)
   * @param {number} maxIter Total number of times to run the function
   * @param {Object} config Options for how to do the calculation
   * @param {Number} config.maxTime Max time, ms, over which to run continuously
   * @param {Number} [config.batchSize] Number of times to run fun between time checks. Since Date.now() takes
   *    non-zero time to execute, you don't necessarily want to check every iteration
   * @param {Number} [config.sleepTime] Amount of time to suspend between computing
   * @param {function(Number)} [config.asyncEntry] IF CALCULATION ISN'T DONE IN ONE BATCH, then this
   *    gets called before the first sleep. Use this to set up a progress bar, for example. The function will
   *    get passed the number of iterations run so far.
   * @param {function(Number)} [config.asyncProgress] Called after the second and subsequent batches, with the
   *    total number of iterations done thus far
   * @param {function} [config.asyncExit] If more than one batch was done, this will be called. For example, can
   *    be used to hide a progress bar.
   * @param {function} [config.then] Run after everything is done
   * @returns {Promise|undefined}
   */
  run(fun, maxIter, config) {
    if (this.enabled) {
      // Disable async if we're already doing async
      this.enabled = false;
      const runResult = this._run(fun, maxIter, config);
      return config.then ? runResult.then(() => {
        config.then();
        this.enabled = true;
      }) : runResult;
    }
    for (let i = 0; i < maxIter; ++i) {
      fun(i);
    }
    if (config.then) config.then();
  },
  /**
   * @private
   */
  async _run(fun, maxIter, config) {
    let remaining = this.runForTime(fun, maxIter, config);
    const sleepTime = config.sleepTime || 1;
    if (!remaining) return;
    if (config.asyncEntry) config.asyncEntry(maxIter - remaining);
    do {
      await this.sleepPromise(sleepTime);
      remaining = this.runForTime(fun, remaining, config);
      if (config.asyncProgress) config.asyncProgress(maxIter - remaining);
    } while (remaining > 0);
    if (config.asyncExit) config.asyncExit()
  }
};
