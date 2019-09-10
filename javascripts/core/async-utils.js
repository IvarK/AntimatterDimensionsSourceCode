"use strict";

const Async = {
  runForTime(fun, maxIter, config) {
    const batchSize = config.batchSize || 1;
    const maxTime = config.maxTime;
    const t0 = Date.now();
    for (let remaining = maxIter; remaining > 0;) {
      for (let j = 0; j < Math.min(remaining, batchSize); ++j) {
        fun();
        --remaining;
      }
      if (Date.now() - t0 >= maxTime) return remaining;
    }
    return 0;
  },
  sleepPromise: ms => new Promise(resolve => setTimeout(resolve, ms)),
  async run(fun, maxIter, config) {
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
