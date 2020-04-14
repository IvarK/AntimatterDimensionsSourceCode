"use strict";

const GameIntervals = (function() {
  const interval = (handler, timeout) => {
    let id = -1;
    return {
      start() {
        id = setInterval(handler, typeof timeout === "function" ? timeout() : timeout);
      },
      get isStarted() {
        return id !== -1;
      },
      stop() {
        clearInterval(id);
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
      for (const interval of this.all()) {
        interval.start();
      }
    },
    stop() {
      for (const interval of this.all()) {
        interval.stop();
      }
    },
    gameLoop: interval(() => gameLoop(), () => player.options.updateRate),
    save: interval(() => GameStorage.save(), 30000),
    checkCloudSave: interval(() => {
      if (playFabId !== -1 && player.options.cloud) playFabSaveCheck();
    }, 300000),
    submitKongStats: interval(() => {
      kong.submitStats("Log10 of total antimatter", player.totalAntimatter.e);
      kong.submitStats("Log10 of Infinity Points", player.infinityPoints.e);
      kong.submitStats("Log10 of Eternity Points", player.eternityPoints.e);
      kong.submitStats("NormalChallenge 9 time record (ms)", Math.floor(player.challenge.normal.bestTimes[8]));
      kong.submitStats("Fastest Infinity time (ms)", Math.floor(player.bestInfinityTime));
      // FIXME: Infinitified is now Decimal so decide what happens here!
      // kong.submitStats('Infinitied', Player.totalInfinitied);
      // FIXME: Eternity count is now a Decimal.
      // kong.submitStats("Eternities", player.eternities);
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
