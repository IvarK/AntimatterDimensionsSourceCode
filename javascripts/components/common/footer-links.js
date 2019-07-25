"use strict";

Vue.component("footer-links", {
  data() {
    return {
      isVisible: true
    };
  },
  created() {
    this.on$(GameEvent.TAB_CHANGED, () => this.isVisible = !Tab.eternity.studies.isOpen);
  },
  template:
    `<div v-if="isVisible" class="o-footer">
      <a href="howto.html" target="_newtab">How to play</a> |
      <a href="about.html" target="_newtab" onclick="SecretAchievement(33).unlock()">Donate</a> |
      <a href="changelog.html" target="_newtab">Changelog</a> |
      <a href="https://discord.gg/ST9NaXa" target="_newtab">Discord</a> |
      <a href="https://www.reddit.com/r/AntimatterDimensions/" target="_newtab">Subreddit</a> |
      <a href="https://ivark.github.io/savefixer/index.html" target="_newtab">Savefixer</a>
    </div>`
});
