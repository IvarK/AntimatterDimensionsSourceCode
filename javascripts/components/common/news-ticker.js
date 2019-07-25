"use strict";

Vue.component("news-ticker", {
  computed: {
    isHidden() {
      return ui.view.newsHidden;
    }
  },
  watch: {
    isHidden() {
      this.restart();
    }
  },
  mounted() {
    document.addEventListener("visibilitychange", () => this.restart.bind(this));
    this.restart();
  },
  beforeDestroy() {
    this.clearTimeouts();
  },
  methods: {
    restart() {
      // TODO: Proper delay before ui is initialized
      if (!GameUI.initialized) {
        setTimeout(this.restart.bind(this), 100);
        return;
      }
      this.clearTimeouts();
      if (document.hidden || this.isHidden) {
        return;
      }
      this.prepareNextMessage();
    },
    clearTimeouts() {
      clearTimeout(this.delayTimeout);
      clearTimeout(this.scrollTimeout);
    },
    prepareNextMessage() {
      const line = this.$refs.line;

      const isUnlocked = news => news.condition === undefined || news.condition();
      do {
        this.currentNews = GameDatabase.news.randomElement();
      } while (!isUnlocked(this.currentNews));

      line.innerHTML = this.currentNews.text;

      line.style["transition-duration"] = "0ms";
      line.style.transform = "translateX(0)";

      const DELAY = 1000;
      this.delayTimeout = setTimeout(this.scrollMessage.bind(this), DELAY);
    },
    scrollMessage() {
      const line = this.$refs.line;

      // SCROLL_SPEED is in pixels per second
      const SCROLL_SPEED = 100;
      const scrollDuration = (this.$refs.ticker.clientWidth + line.clientWidth) / SCROLL_SPEED;

      line.style["transition-duration"] = `${scrollDuration}s`;
      line.style.transform = "translateX(-100%)";

      player.news.add(this.currentNews.id);
      if (player.news.size >= 50) Achievement(22).unlock();

      this.scrollTimeout = setTimeout(this.prepareNextMessage.bind(this), scrollDuration * 1000);
    },
    onLineClick() {
      if (this.currentNews.id === "a130") {
        SecretAchievement(24).unlock();
      }
    }
  },
  template: `
    <div ref="ticker" v-if="!isHidden" class="c-news-ticker">
      <span ref="line" class="c-news-line c-news-ticker__line" @click="onLineClick" />
    </div>
  `
});
