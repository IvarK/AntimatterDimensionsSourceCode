Vue.component('new-dimensions-tab', {
  data() {
    return {
      until_10_setting: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      sacrificeBoost: new Decimal(0),
      options: player.options
    }
  },
  computed: {
    sacrificeBoostDisplay() {
      return this.shortenRateOfChange(this.sacrificeBoost);
    },
    sacrificeTooltip() {
      return `Boosts 8th Dimension by ${this.sacrificeBoostDisplay}x`;
    },
  },
  methods: {
    maxAll() {
      maxAll();
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    toggleUntil10() {
      until_10_setting = !until_10_setting
    },
    getUntil10Display() {
      return this.until_10_setting ? "Until 10" : "Buy 1";
    },
    update() {
      this.until_10_setting = until_10_setting
      const isSacrificeUnlocked = Sacrifice.isUnlocked && player.resets > 4;
      this.isSacrificeUnlocked = isSacrificeUnlocked;
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.isAffordable;
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
    }
  },
  template:
  `<div>
  <div class="modes-container">
    <button class="storebtn" @click="toggleUntil10" style="width: 100px; height: 30px; padding: 0;">{{ getUntil10Display() }}</button>
    <primary-button
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        :enabled="isSacrificeAffordable"
        class="storebtn sacrifice-btn"
        @click="sacrifice"
      >Dimensional Sacrifice ({{sacrificeBoostDisplay}}x)</primary-button>
    <button class="storebtn" @click="maxAll" style="width: 100px; height: 30px; padding: 0;">Max All (M)</button>
  </div>
  <new-tickspeed-row></new-tickspeed-row>
  <div class="dimensions-container">
    <new-dimension-row 
      v-for="tier in 8"
      :key="tier"
      :tier="tier"></new-dimension-row>
  </div>
  <div class="resets-container">
    <new-dim-shift-row></new-dim-shift-row>
    <new-galaxy-row></new-galaxy-row>
  </div>
</div>
  `
})