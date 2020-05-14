"use strict";

Vue.component("dilation-button", {
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(0),
      canEternity: false,
      eternityGoal: new Decimal(0),
      tachyonGain: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.isUnlocked = PlayerProgress.dilationUnlocked();
      this.isRunning = player.dilation.active;
      if (!this.isRunning) return;
      this.canEternity = Player.canEternity;
      this.hasGain = getTachyonGain().gt(0);
      if (this.canEternity && this.hasGain) {
        this.tachyonGain.copyFrom(getTachyonGain());
      } else if (this.hasGain) {
        this.eternityGoal.copyFrom(Player.eternityGoal);
      } else {
        this.requiredForGain.copyFrom(getTachyonReq());
      }
    }
  },
  template:
    `<button class="o-dilation-btn"
             :class="isUnlocked ? 'o-dilation-btn--unlocked' : 'o-dilation-btn--locked'"
             onclick="startDilatedEternity()">
      <span v-if="!isUnlocked">Purchase the dilation time study to unlock.</span>
      <span v-else-if="!isRunning">Dilate time.</span>
      <span v-else-if="canEternity && hasGain">
        Disable dilation.
        <br>
        Gain {{format(tachyonGain, 2, 1)}} Tachyon Particles.
      </span>
      <span v-else-if="hasGain">
        Disable dilation.
        <br>
        Reach {{format(eternityGoal, 1, 0)}} IP to eternity and gain Tachyon Particles.
      </span>
      <span v-else>
        Disable dilation.
        <br>
        Reach {{format(requiredForGain, 2, 1)}} antimatter to gain more Tachyon Particles.
      </span>
    </button>`
});
