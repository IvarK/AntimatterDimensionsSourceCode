const GameIntervals = (function() {
  const interval = (handler, timeout) => {
    let id;
    return {
      start() {
        id = setInterval(handler, typeof timeout === "function" ? timeout() : timeout);
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
      for (let interval of this.all()) {
        interval.start();
      }
    },
    stop() {
      for (let interval of this.all()) {
        interval.stop();
      }
    },
    gameLoop: interval(() => gameLoop(), () => player.options.updateRate),
    save: interval(() => save_game(), 30000)
  };
}());
