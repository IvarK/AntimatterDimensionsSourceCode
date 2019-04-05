Vue.component("break-infinity-button", {
  data: function() {
    return {
      isBroken: false,
      isUnlocked: false
    };
  },
  computed: {
    classObject: function() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--color-2": true,
        "o-infinity-upgrade-btn--available": this.isUnlocked,
        "o-infinity-upgrade-btn--unavailable": !this.isUnlocked,
      };
    },
    tooltip: function() {
      return this.isUnlocked ?
        "Cost multipliers post-infinity will begin increasing faster, but so will the Infinity Point gain" :
        undefined;
    }
  },
  methods: {
    update() {
      this.isBroken = player.break;
      this.isUnlocked = Autobuyer.infinity.isUnlocked && Autobuyer.infinity.hasMaxedInterval;
    }
  },
  template:
    `<button
      v-tooltip="tooltip"
      :class="classObject"
      onclick="breakInfinity()"
    >{{isBroken ? "FIX INFINITY" : "BREAK INFINITY"}}</button>`
});