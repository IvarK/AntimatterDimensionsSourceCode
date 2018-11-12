Vue.component("dim-autobuyer-box", {
  props: {
    tier: Number
  },
  data: function() {
    return {

    };
  },
  computed: {
    autobuyer: function() {
      return Autobuyer.dim(this.tier);
    },
    boxSetup: function() {
      const name = DISPLAY_NAMES[this.tier];
      return new AutobuyerBoxSetup(`${name} Dimension Autobuyer`, this.autobuyer);
    },
  },
  methods: {
    update() {
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
    </autobuyer-box>`
});