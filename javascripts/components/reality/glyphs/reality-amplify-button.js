Vue.component("reality-amplify-button", {
  data: () => ({
    isVisible: false,
    isDisabled: false,
    isActive: false,
    ratio: 1,
    canAmplify: false,
  }),
  computed: {
    tooltip() {
      if (this.isDisabled) return "You cannot amplify Celestial Realities";
      if (!this.canAmplify) {
        return "Store more or complete the Reality faster to amplify";
      }
      return null;
    }
  },
  methods: {
    update() {
      this.isVisible = Enslaved.isUnlocked;
      this.isDisabled = isInCelestialReality();
      this.isActive = Enslaved.boostReality;
      this.ratio = Enslaved.realityBoostRatio;
      this.canAmplify = !this.isDisabled && this.ratio > 1;
    },
    toggleActive() {
      if (!this.canAmplify) return;
      Enslaved.boostReality = !Enslaved.boostReality;
    }
  },
  template: `
    <div
      v-if="isVisible"
    >
      <button
        :class="['l-reality-amplify-button', {'o-enslaved-mechanic-button--storing-time': isActive}]"
        style="width: 100%"
        @click="toggleActive"
        :ach-tooltip="tooltip"
      >
        <div v-if="canAmplify">
          <span v-if="isActive">Will be amplified:</span>
          <span v-else>Amplify this Reality:</span>
          <br>
          All rewards ×{{ formatInt(ratio) }}
        </div>
        <div v-else>
          Not enough stored real time to amplify.
        </div>
      </button>
    </div>`
});
