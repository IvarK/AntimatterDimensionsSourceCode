Vue.component("normal-dim-tab-header", {
  data() {
    return {
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      sacrificeBoost: new Decimal(0),
      options: player.options
    };
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
    update() {
      const isSacrificeUnlocked = Sacrifice.isUnlocked && player.resets > 4;
      this.isSacrificeUnlocked = isSacrificeUnlocked;
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.isAffordable;
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    maxAll() {
      maxAll();
    }
  },
  template:
    `<div class="l-normal-dim-tab__header">
      <input
        v-show="isSacrificeUnlocked"
        v-model="options.noSacrificeConfirmation"
        v-tooltip="'No confirmation when doing Dimensional Sacrifice'"
        type="checkbox"
        class="o-big-checkbox"
      />
      <primary-button
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        :enabled="isSacrificeAffordable"
        class="o-primary-btn--sacrifice"
        @click="sacrifice"
      >Dimensional Sacrifice ({{sacrificeBoostDisplay}}x)</primary-button>
      <primary-button
        class="o-primary-btn--buy-max"
        @click="maxAll"
      >Max all (M)</primary-button>
    </div>`
});