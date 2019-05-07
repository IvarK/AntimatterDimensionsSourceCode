Vue.component('new-ui', {
  data() {
    return {
      view: ui.view
    }
  },
  template:
  `<div id="page">
    <sidebar></sidebar>
    <div class="game-container">
      <div class="quote"><div id="news">.</div></div>
      <component :is="$viewModel.page"></component>
    </div>
    <div id="notification-container" class="l-notification-container"></div>
  </div>`
})