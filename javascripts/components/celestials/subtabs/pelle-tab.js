"use strict";

Vue.component("pelle-tab", {
  data() {
    return {
      isDoomed: false,
      armageddonInterval: 0,
      unstableMatter: new Decimal(0),
      hasFamine: false
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.armageddonInterval = Pelle.armageddonInterval;
      this.unstableMatter.copyFrom(player.celestials.pelle.unstableMatter);
      this.hasFamine = PelleUpgrade.famineUnlock.isBought;
    },
    getDoomed() {
      player.celestials.pelle.doomed = true;
      Pelle.armageddon(false);
      Glyphs.unequipAll();
      respecTimeStudies(true);
    }
  },
  computed: {
    upgrades() {
      return PelleUpgrade.all;
    }
  },
  template:
    `<div class="l-pelle-celestial-tab">
      <button @click="getDoomed()">Doom your reality lol</button>
      <p>Armageddon is happenings every {{ armageddonInterval / 1000 }} seconds</p>
      <p>You have <b>{{ format(unstableMatter, 2, 2) }}</b> Unstable matter</p>
      <div v-for="upg in upgrades">
        <h3>{{ upg.description }}</h3>
        <b>Cost: {{ upg.cost }} {{ upg.currencyDisplay }}</b>
        <button @click="upg.purchase()">purchase lol</button>
      </div>
      <div v-if="hasFamine">You now have famine lol</div>
    </div>`
});