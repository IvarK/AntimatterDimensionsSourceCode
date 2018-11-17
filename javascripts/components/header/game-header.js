Vue.component("game-header", {
  data: function() {
    return {
      isInMatterChallenge: false,
      matter: new Decimal(0),
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.isInMatterChallenge = ["challenge12", "postc1", "postc6"].includes(player.currentChallenge);
      if (this.isInMatterChallenge) {
        this.matter.copyFrom(Player.effectiveMatterAmount);
      }
      this.antimatter.copyFrom(player.money);
      this.antimatterPerSec.copyFrom(Player.antimatterPerSecond);
    }
  },
  template:
    `<div>
      <div v-if="isInMatterChallenge">There is {{shortenMoney(matter)}} matter.</div>
        <game-header-amounts-line />
        <div>
          <p>You have <span class="c-game-header__antimatter">{{shortenMoney(antimatter)}}</span> antimatter.</p>
        </div>
        <div class="l-game-header__buttons-line">
          <game-header-big-crunch-button />
          <game-header-new-dim-button />
          <game-header-eternity-button />
        </div>
        <div>You are getting {{shortenDimensions(antimatterPerSec)}} antimatter per second.</div>
        <game-header-tickspeed-row />
    </div>`
});
