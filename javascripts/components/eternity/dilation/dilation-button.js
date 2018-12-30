Vue.component("dilation-button", {
  data() {
    return {
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.isRunning = player.dilation.active;
      if (!this.isRunning) return;
      this.hasGain = getTachyonGain() > 0;
      if (this.hasGain) return;
      this.requiredForGain.copyFrom(getTachyonReq());
    }
  },
  template:
    `<button class="o-dilation-btn" onclick="startDilatedEternity()">
      <span v-if="!isRunning">Dilate time.</span>
      <span v-else-if="hasGain">Disable dilation.</span>
      <span v-else>
        Disable dilation.
        <br>
        Reach {{shortenMoney(requiredForGain)}} antimatter to gain more Tachyon Particles.
      </span>
    </button>`
});