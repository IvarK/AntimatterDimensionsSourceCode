Vue.component("dimboost-autobuyer-box", {
  computed: {
    boxSetup: function() {
      return new AutobuyerBoxSetup(
        () => Autobuyer.dimboost.isUnlocked,
        () => Autobuyer.dimboost.isOn,
        value => Autobuyer.dimboost.isOn = value
      );
    },
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <div>Automatic DimBoosts</div>
    </autobuyer-box>`
});