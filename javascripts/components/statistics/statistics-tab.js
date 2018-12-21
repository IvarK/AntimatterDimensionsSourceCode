Vue.component('statistics-tab', {
  data: function() {
    return {
      totalAntimatter: new Decimal(0),
      resets: 0,
      galaxies: 0,
      realTimePlayed: TimeSpan.zero,
      infinity: {
        isUnlocked: false,
        count: 0,
        banked: 0,
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
      },
      eternity: {
        isUnlocked: false,
        count: 0,
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal : TimeSpan.zero,
      },
      reality: {
        isUnlocked: false,
        count: 0,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
      },
      infoScale: String.empty,
    };
  },
  methods: {
    update() {
      this.totalAntimatter.copyFrom(player.totalmoney);
      this.resets = player.resets;
      this.galaxies = Math.round(player.galaxies);
      this.realTimePlayed.setFrom(player.realTimePlayed);
      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked;
      const infinity = this.infinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count = player.infinitied;
        infinity.banked = player.infinitiedBank;
        infinity.hasBest = player.bestInfinityTime < 999999999999;
        infinity.best.setFrom(player.bestInfinityTime);
        infinity.this.setFrom(player.thisInfinityTime);
      }
      const isEternityUnlocked = progress.isEternityUnlocked;
      const eternity = this.eternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count = player.eternities;
        eternity.hasBest = player.bestEternity < 999999999999;
        eternity.best.setFrom(player.bestEternity);
        eternity.this.setFrom(player.thisEternity);
      }
      const isRealityUnlocked = progress.isRealityUnlocked;
      const reality = this.reality;
      reality.isUnlocked = isRealityUnlocked;
      if (isRealityUnlocked) {
        reality.count = player.realities;
        reality.best.setFrom(player.bestReality);
        reality.this.setFrom(player.thisReality);
        reality.totalTimePlayed.setFrom(player.totalTimePlayed);
        // real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(player.thisInfinityRealTime);
        eternity.thisReal.setFrom(player.thisEternityRealTime);
        reality.thisReal.setFrom(player.thisRealityRealTime);
      }
      this.infoScale = estimateMatterScale(player.money, this);
    },
    formatAmount: function(value) { 
      return value > 1e18 ? shortenWithCurrentNotation(value, 6, 0) : formatWithCommas(value);
    },
    formatResetAmount: function(value) {
      return this.formatAmount(value) + ((value === 1) ? " time" : " times");
    }
  },
  template:
    `<div>
        <br>
        <h3>General</h3>
        <div>You have made a total of {{ shortenMoney(totalAntimatter) }} antimatter.</div>
        <div>You have done {{ resets }} Dimension Boosts/Shifts.</div>
        <div>You have {{ galaxies }} Antimatter Galaxies.</div>
        <div>You have played for {{ realTimePlayed.toString() }}.</div>
        <div v-if="reality.isUnlocked">Your existence has spanned {{ reality.totalTimePlayed.toString() }} of time.</div>
        <div v-html="infoScale"/>
        <br>
        <div v-if="infinity.isUnlocked">
            <h3>Infinity</h3>
            <div v-if="infinity.count > 0">You have infinitied {{ formatResetAmount(infinity.count) }}<span v-if="eternity.isUnlocked"> this Eternity</span>.</div>
            <div v-else>You haven't infinitied<span v-if="eternity.isUnlocked"> this Eternity</span>.</div>
            <div v-if="infinity.banked > 0">You have {{ formatAmount(infinity.banked) }} banked infinities.</div>
            <div v-if="infinity.hasBest">Your fastest Infinity was {{ infinity.best.toString() }}.</div>
            <div v-else>You have no fastest Infinity<span v-if="eternity.isUnlocked"> this Eternity</span>.</div>
            <div>You have spent {{ infinity.this.toString() }} in this Infinity.
              <span v-if="reality.isUnlocked">
                ({{infinity.thisReal.toStringShort()}} real time)
              </span>
            </div>
            <br>
        </div>
        <div v-if="eternity.isUnlocked">
            <h3>Eternity</h3>
            <div v-if="eternity.count > 0">You have Eternitied {{ formatResetAmount(eternity.count) }}<span v-if="reality.isUnlocked"> this Reality</span>.</div>
            <div v-else>You haven't Eternitied<span v-if="reality.isUnlocked"> this Reality</span>.</div>
            <div v-if="eternity.hasBest">Your fastest Eternity was {{ eternity.best.toString() }}.</div>
            <div v-else>You have no fastest eternity<span v-if="reality.isUnlocked"> this Reality</span>.</div>
            <div>You have spent {{ eternity.this.toString() }} in this Eternity.
              <span v-if="reality.isUnlocked">
                ({{eternity.thisReal.toStringShort()}} real time)
              </span>
            </div>
            <br>
        </div>
        <div v-if="reality.isUnlocked">
            <h3>Reality</h3>
            <div>You have Realitied {{ formatResetAmount(reality.count) }}.</div>
            <div>Your fastest Reality was {{ reality.best.toString() }}.</div>
            <div>You have spent {{ reality.this.toString() }} in this Reality. ({{reality.thisReal.toStringShort()}} real time)</div>
            <br>
        </div>
    </div>`
});

const proton = 2.82e-45;

function estimateMatterScale(matter) {
  if (!matter) return "There is no antimatter yet.";
  if (matter.gt(Decimal.fromMantissaExponent(1, 100000))) {
    return "<br>If you wrote 3 numbers a second, it would take you " +
      "<br>" + TimeSpan.fromSeconds(matter.log10() / 3).toString() +
      "<br> to write down your antimatter amount.";
  }
  const planck = 4.22419e-105;
  let planckedMatter = matter.times(planck);
  if (planckedMatter.gt(proton)) {
    let scale = largestMatterScale(planckedMatter);
    let amount = shortenMoney(planckedMatter.dividedBy(scale.amount));
    return "If every antimatter were a planck volume, " +
      "you would have enough to " + scale.verb + " " + amount + " " + scale.name;
  }
  let scale = smallestProtonScale(matter);
  return "If every antimatter were " + shortenMoney(proton / scale.amount / matter) + " " +
    scale.name + ", you would have enough to make a proton.";
}

function smallestProtonScale(matter) {
  let scales = [
    {amount: 1e-54, name: "attometers cubed"},
    {amount: 1e-63, name: "zeptometers cubed"},
    {amount: 1e-72, name: "yoctometers cubed"},
    {amount: 4.22419e-105, name: "planck volumes"}
  ];
  for (let i = 0; i < scales.length; i++) {
    let scale = scales[i];
    if (matter.times(scale.amount).lt(proton)) {
      return scale;
    }
  }
  throw "Cannot determine smallest antimatter scale";
}

function largestMatterScale(matter) {
  const last = matterScale[matterScale.length - 1];
  if (matter.gte(last.amount)) return last;
  let low = 0;
  let high = matterScale.length;
  while (low !== high) {
    let mid = Math.floor((low + high) / 2);
    if (Decimal.lte(matterScale[mid].amount, matter)) {
      low = mid + 1;
    }
    else {
      high = mid;
    }
  }
  return matterScale[high - 1];
}

const matterScale = [
  {amount: proton, name: "protons", verb: "make"},
  {amount: 1e-42, name: "nuclei", verb: "make"},
  {amount: 7.23e-30, name: "Hydrogen atoms", verb: "make"},
  {amount: 5e-21, name: "viruses", verb: "make"},
  {amount: 9e-17, name: "red blood cells", verb: "make"},
  {amount: 6.2e-11, name: "grains of sand", verb: "make"},
  {amount: 5e-8, name: "grains of rice", verb: "make"},
  {amount: 3.555e-6, name: "teaspoons", verb: "fill"},
  {amount: 7.5e-4, name: "wine bottles", verb: "fill"},
  {amount: 1, name: "fridge-freezers", verb: "fill"},
  {amount: 2.5e3, name: "Olympic-sized swimming pools", verb: "fill"},
  {amount: 2.6006e6, name: "Great Pyramids of Giza", verb: "make"},
  {amount: 3.3e8, name: "Great Walls of China", verb: "make"},
  {amount: 5e12, name: "large asteroids", verb: "make"},
  {amount: 4.5e17, name: "dwarf planets", verb: "make"},
  {amount: 1.08e21, name: "Earths", verb: "make"},
  {amount: 1.53e24, name: "Jupiters", verb: "make"},
  {amount: 1.41e27, name: "Suns", verb: "make"},
  {amount: 5e32, name: "red giants", verb: "make"},
  {amount: 8e36, name: "hypergiant stars", verb: "make"},
  {amount: 1.7e45, name: "nebulas", verb: "make"},
  {amount: 1.7e48, name: "Oort clouds", verb: "make"},
  {amount: 3.3e55, name: "Local Bubbles", verb: "make"},
  {amount: 3.3e61, name: "galaxies", verb: "make"},
  {amount: 5e68, name: "Local Groups", verb: "make"},
  {amount: 1e73, name: "Sculptor Voids", verb: "make"},
  {amount: 3.4e80, name: "observable universes", verb: "make"},
  {amount: 1e113, name: "Dimensions", verb: "make"},
  {amount: Number.MAX_VALUE, name: "Infinity Dimensions", verb: "make"},
  {amount: Decimal.fromMantissaExponent(1, 65000), name: "Time Dimensions", verb: "make"}
];