const GameIntervals = (function() {
  const interval = (handler, timeout) => {
    let id;
    return {
      start() {
        id = setInterval(handler, timeout);
      },
      stop() {
        clearInterval(id);
      }
    };
  };
  return {
    start() {
      for (let prop in this) {
        if (!this.hasOwnProperty(prop)) continue;
        safeCall(this[prop].start);
      }
    },
    stop() {
      for (let prop in this) {
        if (!this.hasOwnProperty(prop)) continue;
        safeCall(this[prop].stop);
      }
    },
    gameLoop: {
      id: undefined,
      start() {
        this.id = setInterval(gameLoop, player.options.updateRate);
      },
      stop() {
        clearInterval(this.id);
      },
      restart() {
        this.stop();
        this.start();
      }
    },
    save: interval(() => save_game(), 30000)
  };
}());