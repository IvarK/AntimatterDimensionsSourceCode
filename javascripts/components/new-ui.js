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
      <div class="quote">I'm gay lol -Boo</div>
      <game-tab v-show="$viewModel.tabs.current && $viewModel.tabs.current !== 'reality-tab' && $viewModel.tabs.current !== 'dimensions-tab'" style="flex: 1 0">
        <component :is="$viewModel.tabs.current"></component>
      </game-tab>
      <new-dimensions-tab v-if="$viewModel.tabs.current == 'dimensions-tab'"></new-dimensions-tab>
    </div>
  </div>`
})