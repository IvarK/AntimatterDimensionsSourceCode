Vue.component("dimboost-autobuyer-box", {
  computed: {
    boxSetup: function() {
      return new AutobuyerBoxSetup("Automatic DimBoosts", Autobuyer.dimboost);
    },
  },
  template:
    `<autobuyer-box :setup="boxSetup">
    </autobuyer-box>`
});