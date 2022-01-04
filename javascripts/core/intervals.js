export const GameIntervals = (function() {
  const interval = (handler, timeout) => {
    let id = -1;
    return {
      start() {
        // This starts the interval if it isn't already started,
        // and throws an error if it is.
        if (this.isStarted) {
          throw new Error("An already started interval cannot be started again.");
        } else {
          id = setInterval(handler, typeof timeout === "function" ? timeout() : timeout);
        }
      },
      get isStarted() {
        return id !== -1;
      },
      stop() {
        // This stops the interval if it isn't already stopped,
        // and does nothing if it is already stopped.
        clearInterval(id);
        id = -1;
      },
      restart() {
        this.stop();
        this.start();
      }
    };
  };
  return {
    // Not a getter because getter will cause stack overflow
    all() {
      return Object.values(GameIntervals)
        .filter(i => i.hasOwnProperty("start") && i.hasOwnProperty("stop"));
    },
    start() {
      // eslint-disable-next-line no-shadow
      for (const interval of this.all()) {
        interval.start();
      }
    },
    stop() {
      // eslint-disable-next-line no-shadow
      for (const interval of this.all()) {
        interval.stop();
      }
    },
    restart() {
      // eslint-disable-next-line no-shadow
      for (const interval of this.all()) {
        interval.restart();
      }
    },
    gameLoop: interval(() => gameLoop(), () => player.options.updateRate),
    save: interval(() => GameStorage.save(), () =>
      (player.options.autosaveInterval - Math.clampMin(0, Date.now() - GameStorage.lastSaveTime))
    ),
    checkCloudSave: interval(() => {
      if (player.options.cloudEnabled && Cloud.loggedIn) Cloud.saveCheck();
    }, 300000),
    submitKongStats: interval(() => {
      kong.submitStats("Log10 of total antimatter", player.records.totalAntimatter.e);
      kong.submitStats("Log10 of Infinity Points", player.infinityPoints.e);
      kong.submitStats("Log10 of Eternity Points", player.eternityPoints.e);
      kong.submitStats("NormalChallenge 9 time record (ms)", Math.floor(player.challenge.normal.bestTimes[8]));
      kong.submitStats("Fastest Infinity time (ms)", Math.floor(player.records.bestInfinity.time));
      // FIXME: Infinitified is now Decimal so decide what happens here!
      // kong.submitStats('Infinitied', Currency.infinitiesTotal);
      // FIXME: Eternity count is now a Decimal.
      // kong.submitStats("Eternities", Currency.eternities);
      kong.submitStats("Achievements", Achievements.effectiveCount +
        SecretAchievements.all.countWhere(a => a.isUnlocked));
    }, 60000),
    randomSecretAchievement: interval(() => {
      if (Math.random() < 0.00001) SecretAchievement(18).unlock();
    }, 1000),
    checkForUpdates: interval(() => {
      if (isLocalEnvironment()) return;
      fetch("version.txt")
        .then(response => response.json())
        .then(json => {
          if (json.version > player.version) {
            Modal.message.show(json.message, updateRefresh);
          }
        });
    }, 60000)
  };
}());
