Vue.component('perks-tab', {
  mounted() {
    drawPerkNetwork();
    updatePerkColors();
  },
  template:`
  <div id="perks" class="realitytab">
    <pp-label></pp-label>
    <div class="vis-network" tabindex="900" style="position: relative; overflow: hidden; touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); width: 100%; height: 100%;">
        <canvas width="800" height="800" style="position: relative; touch-action: none; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); width: 100%; height: 100%;"></canvas>
    </div>
  </div>
  `
})