Vue.component("autobuyer-interval-button", {
  props: {
    autobuyer: Object
  },
  data() {
    return {
      cost: 0,
      isMaxed: false,
      isUnlocked: false
    };
  },
  methods: {
    update() {
      this.cost = this.autobuyer.cost;
      this.isMaxed = this.autobuyer.hasMaxedInterval;
      this.isUnlocked = this.autobuyer.isUnlocked;
    },
    upgradeInterval() {
      this.autobuyer.upgradeInterval();
    }
  },
  template: `
    <button
      v-if="!isMaxed && isUnlocked"
      class="o-autobuyer-btn l-autobuyer-box__button"
      @click="upgradeInterval"
    >
      {{ formatPercents(0.4) }} smaller interval
      <br>
      Cost: {{ format(cost, 2, 0) }} IP
    </button>
    <button
      v-else-if="!isMaxed"
      class="o-autobuyer-btn l-autobuyer-box__button"
    >
      Complete the challenge to upgrade interval
    </button>`
});
