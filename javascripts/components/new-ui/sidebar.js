Vue.component('sidebar', {
  methods: {
    switchTo(tab) {
      showTab(tab)
    }
  },
  template:
  `<div class="sidebar">
    <div class="resource-container">
      <sidebar-am></sidebar-am>
      <sidebar-ip></sidebar-ip>
      <sidebar-ep></sidebar-ep>
      <sidebar-rm></sidebar-rm>
    </div>
    <div class="tab-buttons">
      <div class="tab-button active" @click="switchTo('dimensions')"><h3>Dimensions</h3></div>
      <div class="tab-button" @click="switchTo('achievements')"><h3>Achievements</h3></div>
      <div class="tab-button" @click="switchTo('options')"><h3>Options</h3></div>
      <div class="tab-button" @click="switchTo('challenges')"><h3>Challenges</h3></div>
      <div class="tab-button infinity" @click="switchTo('infinity')"><h3>Infinity</h3></div>
      <div class="tab-button eternity" @click="switchTo('eternity')"><h3>Eternity</h3></div>
      <div class="tab-button" @click="switchTo('reality')"><h3>Reality</h3></div>
      <div class="tab-button" @click="switchTo('celestials')"><h3>Celestials</h3></div>
      <div class="tab-button shop" @click="switchTo('shop')"><h3>Shop</h3></div>
      <div class="subtabs">
        <div class="subtab active">Ω</div>
        <div class="subtab">∞</div>
        <div class="subtab">Δ</div>
      </div>
    </div>
  </div>`
})