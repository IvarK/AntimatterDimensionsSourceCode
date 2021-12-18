Vue.component("eternity-points-header", {
  data() {
    return {
      eternityPoints: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.eternityPoints.copyFrom(Currency.eternityPoints.value.floor());
    }
  },
  template: `
    <div class="c-eternity-tab__header">
      You have
      <span class="c-eternity-tab__eternity-points">{{ format(eternityPoints, 2, 0) }}</span>
      {{ pluralize("Eternity Point", eternityPoints) }}.
    </div>`
});
