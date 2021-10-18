"use strict";

Vue.component("pelle-tab", {
  data() {
    return {
      isDoomed: false,
      armageddonInterval: new Decimal(0),
      currentArmageddonDuration: 0,
      remnants: new Decimal(0),
      hasFamine: false,
      hasPestilence: false,
      hasChaos: false,
      remnantsGain: new Decimal(0),
      remnantsPerMinute: new Decimal(0),
      showBoughtUpgrades: false,
      unboughtUpgrades: [],
      boughtUpgrades: [],
      currentArmageddonSpeedup: 0,
      remnantLimit: 0,
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.armageddonInterval.copyFrom(Pelle.armageddonInterval);
      this.currentArmageddonDuration = Pelle.currentArmageddonDuration;
      this.remnants.copyFrom(player.celestials.pelle.remnants);
      this.hasFamine = Pelle.famine.unlocked;
      this.hasPestilence = Pelle.pestilence.unlocked;
      this.hasChaos = Pelle.chaos.unlocked;
      this.remnantsGain.copyFrom(Pelle.remnantsGain);
      this.unboughtUpgrades = PelleUpgrade.all.filter(upg => !upg.isBought).slice(0, 12);
      this.boughtUpgrades = PelleUpgrade.all.filter(upg => upg.isBought);
      this.currentArmageddonSpeedup = Pelle.armageddonSpeedModifier;
      this.remnantsPerMinute = Pelle.remnantsGain
        .dividedBy(TimeSpan.fromMilliseconds(Pelle.armageddonInterval.toNumber()).totalMinutes)
        .times(this.currentArmageddonSpeedup);
      this.remnantLimit = Pelle.remnantsLimit;
    },
    getDoomed() {
      player.celestials.pelle.doomed = true;
      Pelle.armageddon(false);
      Glyphs.unequipAll();
      respecTimeStudies(true);
      Currency.infinityPoints.reset();
      player.infMult = 0;
      Autobuyer.bigCrunch.mode = AUTO_CRUNCH_MODE.AMOUNT;
      disChargeAll();
    },
    upgradeClass(upg) {
      return {
        [`pelle-upgrade-${upg.config.currency}`]: true,
        "pelle-upgrade--canbuy": upg.canBeBought,
        "pelle-upgrade--isbought": upg.isBought
      };
    }
  },
  computed: {
    visibleUpgrades() {
      if (!this.showBoughtUpgrades) return this.unboughtUpgrades.slice(0, 9);
      
      return this.boughtUpgrades.concat(this.unboughtUpgrades.slice(0, 9));
    },
    transparentUpgrades() {
      return this.unboughtUpgrades.slice(9, 12);
    },
    pelleRebuyable() {
      return {
        permanentTickspeed: PelleRebuyableUpgrade.permanentTickspeed,
        permanentGalaxies: PelleRebuyableUpgrade.permanentGalaxies,
        permanentDimensionBoosts: PelleRebuyableUpgrade.permanentDimensionBoosts,
      };
    }
  },
  template:
    `<div class="l-pelle-celestial-tab">
      <button @click="getDoomed()">Doom your reality lol</button>
      <p>
        Armageddon has lasted 
        {{ format(currentArmageddonDuration / 1000, 2, 2) }}/{{ format(armageddonInterval.dividedBy(1000), 2, 2) }} 
        seconds. Sped up by {{ formatX(currentArmageddonSpeedup, 2, 2) }} due to current antimatter/s.</p>
      <p>
        You have <b>{{ format(remnants, 2, 2) }}/{{ format(remnantLimit, 2, 0)}}</b>
        Remnants, you will gain {{ format(remnantsGain, 2, 2) }} 
        on next Armageddon ({{ format(remnantsPerMinute, 2, 2)}} / min).
      </p>
      <div class="c-pelle-currency-container">
        <pelle-currency 
          currency="famine" :rebuyable="pelleRebuyable.permanentTickspeed" v-show="hasFamine"/>
        <pelle-currency 
          currency="pestilence" :rebuyable="pelleRebuyable.permanentDimensionBoosts" v-show="hasPestilence"/>
        <pelle-currency 
          currency="chaos" :rebuyable="pelleRebuyable.permanentGalaxies" v-show="hasChaos"/>
      </div>
      <div class="c-pelle-strike-container">
      </div>
      <button @click="showBoughtUpgrades = !showBoughtUpgrades">Show/Hide bought upgrades</button>
      <div class="pelle-upgrades--container">
        <pelle-upgrade v-for="upg in visibleUpgrades" :upgrade="upg" :key="upg.config.id"/>
        <pelle-upgrade v-for="upg in transparentUpgrades" :upgrade="upg" :key="upg.config.id" transparent/>
      </div>
    </div>`
});
