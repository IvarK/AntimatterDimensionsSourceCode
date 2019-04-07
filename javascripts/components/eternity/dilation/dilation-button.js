Vue.component("dilation-button", {
  data() {
    return {
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(0),
      canEternity: false,
      eternityChallGoal: new Decimal(Number.MAX_VALUE),
      tachyonGain: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.isRunning = player.dilation.active;
      if (!this.isRunning) return;
      this.canEternity = player.infinityPoints.gte(player.eternityChallGoal);
      this.hasGain = getTachyonGain().gt(0);
      if (this.canEternity && this.hasGain) {
        this.tachyonGain.copyFrom(getTachyonGain());
      } else if (this.hasGain) {
        this.eternityChallGoal.copyFrom(player.eternityChallGoal);
      } else {
        this.requiredForGain.copyFrom(getTachyonReq());
      }
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
        Reach {{shorten(eternityChallGoal, 1, 0)}} IP to eternity and gain Tachyon Particles.
      </span>
      <span v-else>
        Disable dilation.
        <br>
        Reach {{shortenMoney(requiredForGain)}} antimatter to gain more Tachyon Particles.
      </span>
    </button>`
});