/**
 * Async is used for making a big pile of computation into a manageable
 * set of batches that don't lock up the UI.
 * run() is the nominal entry point.
 */
window.Async = {
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
    if (!config.progress) config.progress = {};
    // We need to use config.progress variables because something else could change them
    // (e.g. someone speeding up offline progress)
    config.progress.maxIter = maxIter;
    config.progress.remaining = this.runForTime(fun, config.progress.maxIter, config);
    const sleepTime = config.sleepTime || 1;
    if (!config.progress.remaining) return;
    if (config.asyncEntry) config.asyncEntry(config.progress.maxIter - config.progress.remaining);
    do {
      await this.sleepPromise(sleepTime);
      config.progress.remaining = this.runForTime(fun, config.progress.remaining, config);
      if (config.asyncProgress) config.asyncProgress(config.progress.maxIter - config.progress.remaining);
    } while (config.progress.remaining > 0);
    if (config.asyncExit) config.asyncExit();
  }
};
