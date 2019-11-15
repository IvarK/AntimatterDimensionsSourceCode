"use strict";

Vue.component("news-ticker", {
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

      if (this.currentNews && this.currentNews.id === "a236") {
        this.currentNews = GameDatabase.news.find(message => message.id === "a216");
      } else {
        const isUnlocked = news => news.unlocked || news.unlocked === undefined;
        do {
          this.currentNews = GameDatabase.news.randomElement();
        } while (!isUnlocked(this.currentNews));
      }

      line.innerHTML = this.currentNews.text;

      line.style["transition-duration"] = "0ms";
      if (this.currentNews && this.currentNews.id === "a244") {
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
      const SCROLL_SPEED = 100;
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
      if (this.currentNews.id === "a130") {
        SecretAchievement(24).unlock();
      }
      if (this.currentNews.id === "a196") {
        let random = Math.random();
        // Golden ratio
        random += 0.618033988749895;
        random %= 1;
        random *= 255;
        const color = `hsl(${random}, 90%, 60%)`;
          this.$refs.line.innerHTML =
            `<span style='color: ${color}; text-shadow: 0 0 0.5rem ${color}; animation: text-grow 0.4s infinite;'>
            Disco Time!</span>`;
      }
      if (this.currentNews.id === "a210") {
        player.secretUnlocks.uselessNewsClicks++;
        this.$refs.line.innerHTML = this.currentNews.text;
      }
      if (this.currentNews.id === "a247") {
        if (this.$refs.line.innerHTML.includes("This")) {
          this.$refs.line.innerHTML =
            "¡uʍop ǝpᴉsdn ɯǝɥʇ dᴉlɟ oʇ sǝƃɐssǝɯ sʍǝu uo ʞɔᴉlɔ oʇ ʎʇᴉlᴉqɐ ǝɥʇ ǝʞᴉl sƃuᴉɥʇ ǝɹnʇɐǝɟ llᴉʍ 0˙ᄅ sʍǝN " +
            "˙,,0˙ᄅ sʍǝN,, ɟo ʇsǝʇ ɐ sᴉ ǝƃɐssǝɯ sʍǝu sᴉɥ┴";
        } else {
          this.$refs.line.innerHTML =
            "This news message is a test of \"News 2.0\". News 2.0 will feature things like the ability to click " +
            "on news messages to flip them upside down!";
        }
      }
      if (this.currentNews.id === "a289") {
        player.secretUnlocks.paperclips++;
        GameOptions.toggleNews();
      }
    }
  },
  template: `
    <div ref="ticker" class="c-news-ticker">
      <span ref="line" class="c-news-line c-news-ticker__line" @click="onLineClick" />
    </div>
  `
});
