Vue.component("dilation-button", {
  data() {
    return {
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(0),
      canEternity: false,
      tachyonGain: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.isRunning = player.dilation.active;
      if (!this.isRunning) return;
      this.hasGain = getTachyonGain().gt(0);
      this.requiredForGain.copyFrom(getTachyonReq());
      this.canEternity = player.infinityPoints.gte(Number.MAX_VALUE)
      this.tachyonGain.copyFrom(getTachyonGain());
    }
  },
  template:
    `<button class="o-dilation-btn" onclick="startDilatedEternity()">
      <span v-if="!isRunning">Dilate time.</span>
      <span v-else-if="canEternity && hasGain">
        Disable dilation.
        <br>
        Gain {{shortenMoney(tachyonGain)}} Tachyon Particles.
      </span>
      <span v-else-if="hasGain">
        Disable dilation.
        <br>
        Reach {{shorten(Number.MAX_VALUE, 1, 0)}} IP to eternity and gain Tachyon Particles.
      </span>
      <span v-else>
        Disable dilation.
        <br>
        Reach {{shortenMoney(requiredForGain)}} antimatter to gain more Tachyon Particles.
      </span>
    </button>`
});