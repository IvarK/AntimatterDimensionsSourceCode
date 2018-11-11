Vue.component("autobuyers-tab", {
  template:
    `<div class="l-autobuyers-tab">
      <autobuyer-toggles class="l-autobuyers-tab__toggles" />
      <div class="l-autobuyer-grid">
        <div class="l-autobuyer-grid__row">
          <reality-autobuyer-box />
          <eternity-autobuyer-box />
        </div>
      </div>
    </div>`
});