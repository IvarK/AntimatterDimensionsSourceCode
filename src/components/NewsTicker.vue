<script>
export default {
  data() {
    return {
      enableAnimation: false,
    };
  },
  computed: {
    lineClass() {
      return this.enableAnimation ? undefined : "c-disable-ticker-animation";
    }
  },
  beforeCreate() {
    this.recentTickers = [];
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
      if (this.currentNews?.dynamic) {
        this.$refs.line.innerHTML = this.currentNews.text;
      }
      this.enableAnimation = player.options.news.includeAnimated;
    },
    restart() {
      // TODO: Proper delay before ui is initialized
      if (!GameUI.initialized) {
        setTimeout(this.restart.bind(this), 100);
        return;
      }
      this.clearTimeouts();
      if (document.hidden) {
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

      NewsHandler.addSeenNews(this.currentNews.id);
      if (NewsHandler.uniqueTickersSeen >= 50) Achievement(22).unlock();
      player.news.totalSeen++;

      this.scrollTimeout = setTimeout(this.prepareNextMessage.bind(this), scrollDuration * 1000);
    },
    onLineClick() {
      if (this.currentNews.onClick === undefined) {
        return;
      }
      SecretAchievement(24).unlock();
      const updatedText = this.currentNews.onClick();
      if (updatedText !== undefined) {
        this.$refs.line.innerHTML = updatedText;
      }
    }
  }
};
</script>

<template>
  <div
    ref="ticker"
    class="c-news-ticker"
  >
    <span
      ref="line"
      class="c-news-line c-news-ticker__line"
      :class="lineClass"
      @click="onLineClick"
    />
  </div>
</template>

<style scoped>
.c-news-ticker {
  overflow: hidden;
}

.c-news-ticker__line {
  padding-left: 100%;
  transition: transform linear;
}

.c-disable-ticker-animation > * {
  animation-play-state: paused !important;
}

.c-news-line {
  display: inline-block;
  font-family: Typewriter, serif;
  font-size: 1.5rem;
  white-space: nowrap;
  font-weight: bold;
  text-align: left;
  user-select: none;
}

.c-news-line a {
  text-decoration: underline;
}

.new-ui .c-news-ticker {
  width: 100%;
  border-bottom: 0.1rem solid var(--color-accent);
  padding: 0.8rem 0;
  height: 3.9rem;
}

.new-ui .c-news-line {
  color: var(--color-text);
}

.old-ui .c-news-ticker {
  border: 0.2rem solid black;
  border-radius: 0.4rem;
  padding: 0.2rem 0;
  height: 3rem;
}

.old-ui .s-base--metro .c-news-ticker,
.old-ui .t-s6 .c-news-ticker,
.old-ui .t-s10 .c-news-ticker {
  border-width: 0.1rem;
}

.old-ui .t-dark .c-news-ticker {
  border-color: #546e7a;
  background-color: #455a64;
}

.old-ui .t-dark-metro .c-news-ticker {
  background-color: #455a64;
}

.old-ui .t-s1 .c-news-ticker {
  background-color: #dbd242
}

.old-ui .t-s6 .c-news-ticker,
.old-ui .t-s10 .c-news-ticker {
  background-color: black;
}

.old-ui .c-news-line {
  color: var(--color-text);
}
</style>
