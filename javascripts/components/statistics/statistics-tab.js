"use strict";

Vue.component("statistics-tab", {
  data() {
    return {
      totalAntimatter: new Decimal(0),
      realTimePlayed: TimeSpan.zero,
      infinity: {
        isUnlocked: false,
        count: new Decimal(0),
        banked: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      eternity: {
        isUnlocked: false,
        count: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      reality: {
        isUnlocked: false,
        count: 0,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      matterScale: [],
    };
  },
  methods: {
    update() {
      this.totalAntimatter.copyFrom(player.totalAntimatter);
      this.realTimePlayed.setFrom(Date.now() - player.gameCreatedTime);
      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked;
      const infinity = this.infinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count.copyFrom(player.infinitied);
        infinity.banked.copyFrom(player.infinitiedBank);
        infinity.hasBest = player.bestInfinityTime < 999999999999;
        infinity.best.setFrom(player.bestInfinityTime);
        infinity.this.setFrom(player.thisInfinityTime);
        infinity.bestRate.copyFrom(player.bestIPminThisEternity);
      }
      const isEternityUnlocked = progress.isEternityUnlocked;
      const eternity = this.eternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count.copyFrom(player.eternities);
        eternity.hasBest = player.bestEternity < 999999999999;
        eternity.best.setFrom(player.bestEternity);
        eternity.this.setFrom(player.thisEternity);
        eternity.bestRate.copyFrom(player.bestEPminThisReality);
      }
      const isRealityUnlocked = progress.isRealityUnlocked;
      const reality = this.reality;
      reality.isUnlocked = isRealityUnlocked;
      if (isRealityUnlocked) {
        reality.count = Math.floor(player.realities);
        reality.best.setFrom(player.bestReality);
        reality.this.setFrom(player.thisReality);
        reality.totalTimePlayed.setFrom(player.totalTimePlayed);
        // Real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(player.thisInfinityRealTime);
        eternity.thisReal.setFrom(player.thisEternityRealTime);
        reality.thisReal.setFrom(player.thisRealityRealTime);
        reality.bestRate.copyFrom(player.bestRMmin);
      }
      this.matterScale = MatterScale.estimate(player.antimatter);
    },
    formatDecimalAmount(value) {
      return value.gt(1e9) ? shorten(value, 3, 0) : shortenSmallInteger(value.toNumber());
    }
  },
  template:
    `<div class="c-stats-tab">
        <br>
        <h3>General</h3>
        <div>You have made a total of {{ shorten(totalAntimatter, 2, 1) }} antimatter.</div>
        <div>You have played for {{ realTimePlayed }}.</div>
        <div v-if="reality.isUnlocked">
          Your existence has spanned {{ reality.totalTimePlayed }} of time.
        </div>
        <div>
          <br>
          <div
            v-if="eternity.thisReal.totalSeconds > 1 && infinity.thisReal.totalSeconds > 1"
            v-for="line in matterScale">{{line}}</div>
        </div>
        <br>
        <div v-if="infinity.isUnlocked">
            <h3>Infinity</h3>
            <div v-if="infinity.count.gt(0)">
              You have infinitied
              {{ formatDecimalAmount(infinity.count) }}
              {{"time" | pluralize(infinity.count)}}<span v-if="eternity.isUnlocked"> this Eternity</span>.
            </div>
            <div v-else>You haven't infinitied<span v-if="eternity.isUnlocked"> this Eternity</span>.</div>
            <div v-if="infinity.banked.gt(0)">
              You have {{ formatDecimalAmount(infinity.banked) }} banked infinities.
            </div>
            <div v-if="infinity.hasBest">Your fastest Infinity was {{ infinity.best.toStringShort() }}.</div>
            <div v-else>You have no fastest Infinity<span v-if="eternity.isUnlocked"> this Eternity</span>.</div>
            <div>You have spent {{ infinity.this.toStringShort() }} in this Infinity.
              <span v-if="reality.isUnlocked">
                ({{infinity.thisReal.toStringShort()}} real time)
              </span>
            </div>
            <div>
              Your best IP/min 
              <span v-if="eternity.count.gt(0)">this Eternity </span>
              is {{ shorten(infinity.bestRate, 2, 2) }}.
            </div>
            <br>
        </div>
        <div v-if="eternity.isUnlocked">
            <h3>Eternity</h3>
            <div v-if="eternity.count.gt(0)">
              You have Eternitied
              {{ formatDecimalAmount(eternity.count) }}
              {{"time" | pluralize(eternity.count)}}<span v-if="reality.isUnlocked"> this Reality</span>.
            </div>
            <div v-else>You haven't Eternitied<span v-if="reality.isUnlocked"> this Reality</span>.</div>
            <div v-if="eternity.hasBest">Your fastest Eternity was {{ eternity.best.toStringShort() }}.</div>
            <div v-else>You have no fastest eternity<span v-if="reality.isUnlocked"> this Reality</span>.</div>
            <div>You have spent {{ eternity.this.toStringShort() }} in this Eternity.
              <span v-if="reality.isUnlocked">
                ({{eternity.thisReal.toStringShort()}} real time)
              </span>
            </div>
            <div>
              Your best EP/min 
              <span v-if="reality.isUnlocked">this Reality </span>
              is {{ shorten(eternity.bestRate, 2, 2) }}.
            </div>
            <br>
        </div>
        <div v-if="reality.isUnlocked">
            <h3>Reality</h3>
            <div>You have Realitied {{shortenSmallInteger(reality.count)}} {{"time" | pluralize(reality.count)}}.</div>
            <div>Your fastest Reality was {{ reality.best.toStringShort() }}.</div>
            <div>
              You have spent
              {{ reality.this.toStringShort() }} in this Reality. ({{reality.thisReal.toStringShort()}} real time)
            </div>
            <div>
              Your best RM/min is {{ shorten(reality.bestRate, 2, 2) }}.
            </div>
            <br>
        </div>
    </div>`
});

const MatterScale = {
  proton: 2.82e-45,

  estimate(matter) {
    if (!matter) return ["There is no antimatter yet."];
    if (matter.gt(Decimal.fromMantissaExponent(1, 100000))) {
      return [
        `If you wrote ${shortenSmallInteger(3)} numbers a second, it would take you`,
        TimeSpan.fromSeconds(matter.log10() / 3).toString(),
        "to write down your antimatter amount."
      ];
    }
    const planck = 4.22419e-105;
    const planckedMatter = matter.times(planck);
    if (planckedMatter.gt(this.proton)) {
      const scale = this.macroScale(planckedMatter);
      const amount = shorten(planckedMatter.dividedBy(scale.amount), 2, 1);
      return [`If every antimatter were a planck volume, you would have
        enough to ${scale.verb} ${amount} ${scale.name}`];
    }
    const scale = this.microScale(matter);
    return [`If every antimatter were ${shorten(this.proton / scale.amount / matter.toNumber(), 2, 1)} ${scale.name},
      you would have enough to make a proton.`];
  },

  microScale(matter) {
    const micro = this.microObjects;
    for (let i = 0; i < micro.length; i++) {
      const scale = micro[i];
      if (matter.times(scale.amount).lt(this.proton)) {
        return scale;
      }
    }
    throw "Cannot determine smallest antimatter scale";
  },

  macroScale(matter) {
    const macro = this.macroObjects;
    const last = macro.last();
    if (matter.gte(last.amount)) return last;
    let low = 0;
    let high = macro.length;
    while (low !== high) {
      const mid = Math.floor((low + high) / 2);
      if (Decimal.lte(macro[mid].amount, matter)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return macro[high - 1];
  },

  microObjects: [
    { amount: 1e-54, name: "attometers cubed" },
    { amount: 1e-63, name: "zeptometers cubed" },
    { amount: 1e-72, name: "yoctometers cubed" },
    { amount: 4.22419e-105, name: "planck volumes" }
  ],

  macroObjects: [
    { amount: 2.82e-45, name: "protons", verb: "make" },
    { amount: 1e-42, name: "nuclei", verb: "make" },
    { amount: 7.23e-30, name: "Hydrogen atoms", verb: "make" },
    { amount: 5e-21, name: "viruses", verb: "make" },
    { amount: 9e-17, name: "red blood cells", verb: "make" },
    { amount: 6.2e-11, name: "grains of sand", verb: "make" },
    { amount: 5e-8, name: "grains of rice", verb: "make" },
    { amount: 3.555e-6, name: "teaspoons", verb: "fill" },
    { amount: 7.5e-4, name: "wine bottles", verb: "fill" },
    { amount: 1, name: "fridge-freezers", verb: "fill" },
    { amount: 2.5e3, name: "Olympic-sized swimming pools", verb: "fill" },
    { amount: 2.6006e6, name: "Great Pyramids of Giza", verb: "make" },
    { amount: 3.3e8, name: "Great Walls of China", verb: "make" },
    { amount: 5e12, name: "large asteroids", verb: "make" },
    { amount: 4.5e17, name: "dwarf planets", verb: "make" },
    { amount: 1.08e21, name: "Earths", verb: "make" },
    { amount: 1.53e24, name: "Jupiters", verb: "make" },
    { amount: 1.41e27, name: "Suns", verb: "make" },
    { amount: 5e32, name: "red giants", verb: "make" },
    { amount: 8e36, name: "hypergiant stars", verb: "make" },
    { amount: 1.7e45, name: "nebulas", verb: "make" },
    { amount: 1.7e48, name: "Oort clouds", verb: "make" },
    { amount: 3.3e55, name: "Local Bubbles", verb: "make" },
    { amount: 3.3e61, name: "galaxies", verb: "make" },
    { amount: 5e68, name: "Local Groups", verb: "make" },
    { amount: 1e73, name: "Sculptor Voids", verb: "make" },
    { amount: 3.4e80, name: "observable universes", verb: "make" },
    { amount: 1e113, name: "Dimensions", verb: "make" },
    { amount: Number.MAX_VALUE, name: "Infinity Dimensions", verb: "make" },
    { amount: Decimal.fromMantissaExponent(1, 65000), name: "Time Dimensions", verb: "make" }
  ]
};
