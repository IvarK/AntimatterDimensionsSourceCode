"use strict";

Vue.component("news-ticker", {
  data() {
    return {
      recentTickers: [],
    };
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
    update() {
      if (this.currentNews && this.currentNews.dynamic) this.$refs.line.innerHTML = this.currentNews.text;
    },
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
      if (line === undefined) return;

      const isUnlocked = news => news.unlocked || news.unlocked === undefined;

      if (nextNewsMessageId && GameDatabase.news.find(message => message.id === nextNewsMessageId)) {
        this.currentNews = GameDatabase.news.find(message => message.id === nextNewsMessageId);
        nextNewsMessageId = undefined;
      } else if (this.currentNews && this.currentNews.id === "a236") {
        this.currentNews = GameDatabase.news
          .filter(message => message.isAdvertising && isUnlocked(message))
          .randomElement();
      } else {
        const isAI = Math.random() < player.options.news.AIChance;
        this.currentNews = GameDatabase.news
          .filter(message => message.id.includes("ai") === isAI)
          .filter(message => !this.recentTickers.includes(message) && isUnlocked(message))
          .randomElement();
        // Prevent tickers from repeating if they were seen recently
        this.recentTickers.push(this.currentNews.id);
        while (this.recentTickers.length > player.options.news.repeatBuffer) this.recentTickers.shift();
      }
      if (this.currentNews.reset) {
        this.currentNews.reset();
      }

      line.innerHTML = this.currentNews.text;

      line.style["transition-duration"] = "0ms";
      if (this.currentNews?.id === "a244" || this.currentNews?.id === "ai63") {
        line.style.transform = "translateX(-100%)";
      } else {
        line.style.transform = "translateX(0)";
      }

      const DELAY = 1000;
      this.delayTimeout = setTimeout(this.scrollMessage.bind(this), DELAY);
    },
    scrollMessage() {
      const line = this.$refs.line;

      // SCROLL_SPEED is in pixels per second
      const SCROLL_SPEED = player.options.news.speed * 100;
      const scrollDuration = (this.$refs.ticker.clientWidth + line.clientWidth) / SCROLL_SPEED;

      line.style["transition-duration"] = `${scrollDuration}s`;
      if (this.currentNews && this.currentNews.id === "a244") {
        line.style.transform = "translateX(0)";
      } else {
        line.style.transform = "translateX(-100%)";
      }

      player.news.add(this.currentNews.id);
      if (player.news.size >= 50) Achievement(22).unlock();

      this.scrollTimeout = setTimeout(this.prepareNextMessage.bind(this), scrollDuration * 1000);
    },
    onLineClick() {
      if (this.currentNews.onClick !== undefined) {
        SecretAchievement(24).unlock();
        const updatedText = this.currentNews.onClick();
        if (updatedText !== undefined) {
          this.$refs.line.innerHTML = updatedText;
        }
      }
    }
  },
  template: `
    <div ref="ticker" class="c-news-ticker">
      <span ref="line" class="c-news-line c-news-ticker__line" @click="onLineClick" />
    </div>`
});
