Vue.component("pp-label", {
  data() {
    return {
      pp: 0
    };
  },
  methods: {
    update() {
      this.pp = player.reality.pp;
    }
  },
  template: `
    <div class="c-pp-label">You have {{ shorten(pp, 0, 0) }} {{"Perk Point" | pluralize(pp)}}</div>
  `
});