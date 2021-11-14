Vue.component("infinity-points-header", {
  data() {
    return {
      infinityPoints: new Decimal(0),
      isVisible: false
    };
  },
  methods: {
    update() {
      this.infinityPoints.copyFrom(Currency.infinityPoints);
      this.isVisible = PlayerProgress.infinityUnlocked();
    }
  },
  template: `
    <div v-show="isVisible" class="c-infinity-tab__header">
      You have
      <span class="c-infinity-tab__infinity-points">{{ format(infinityPoints, 2, 0) }}</span>
      {{ pluralize("Infinity Point", infinityPoints) }}.
    </div>`
});
