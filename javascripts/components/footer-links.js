Vue.component('footer-links', {
  props: ['sticky'],
  template:
    `<div :class="['o-footer', sticky ? 'o-footer--sticky' : '']">
      <a href="howto.html" target="_newtab">How to play</a> |
      <a href="about.html" target="_newtab" onclick="giveAchievement('A sound financial decision')">Donate   </a> |
      <a href="changelog.html" target="_newtab">Changelog</a> |
      <a href="https://discord.gg/ST9NaXa" target="_newtab">Discord</a> |
      <a href="https://www.reddit.com/r/AntimatterDimensions/" target="_newtab">Subreddit</a> |
      <a href="https://ivark.github.io/savefixer/index.html" target="_newtab">Savefixer</a>
    </div>`
});