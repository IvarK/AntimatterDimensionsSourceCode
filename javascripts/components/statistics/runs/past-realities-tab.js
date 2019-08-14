Vue.component('past-realities-tab', {
  mixins: [pastRunsMixin],
  data: function() {
    return {
      runs: player.lastTenRealities,
      reward: function(run) {
        let rm = run[1].eq(1) ? " reality machine" : " reality machines";
        return this.runGain(run) + rm + " and a level " + run[2] + " glyph";
      }
    };
  },
  template:
    `<past-runs-tab
      :runs="runs"
      singular="Reality"
      plural="Realities"
      points="RM"
      :reward="reward"
      :real-time-index=3
    />`
});