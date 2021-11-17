Vue.component("break-infinity-button", {
  data() {
    return {
      isBroken: false,
      isUnlocked: false,
      isEnslaved: false,
    };
  },
  computed: {
    classObject() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--color-2": true,
        "o-infinity-upgrade-btn--available": this.isUnlocked,
        "o-infinity-upgrade-btn--unavailable": !this.isUnlocked,
        "o-infinity-upgrade-btn--feel-eternity": this.isEnslaved,
      };
    },
    tooltip() {
      if (this.isEnslaved) return "...eons stacked on eons stacked on eons stacked on eons stacked on ...";
      return undefined;
    },
    text() {
      if (this.isEnslaved) return "FEEL ETERNITY";
      return this.isBroken ? "INFINITY IS BROKEN" : "BREAK INFINITY";
    }
  },
  methods: {
    update() {
      this.isBroken = player.break;
      this.isUnlocked = Autobuyer.bigCrunch.hasMaxedInterval;
      this.isEnslaved = Enslaved.isRunning;
    },
    clicked() {
      if (this.isEnslaved) Enslaved.feelEternity();
      else if (!this.isBroken && this.isUnlocked) Modal.breakInfinity.show();
    }
  },
  template: `
    <button
      v-tooltip="tooltip"
      :class="classObject"
      @click="clicked"
    >
      {{ text }}
    </button>`
});
