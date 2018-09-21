Vue.component('statistics-stats-tab', {
  props: ['model'],
  template:
    '<div class="statstab">\
        <br>\
        <h3>General</h3>\
        <div>You have made a total of {{ totalAntimatter }} antimatter.</div>\
        <div>You have done {{ player.resets }} dimensional boosts/shifts.</div>\
        <div>You have {{ Math.round(player.galaxies) }} Antimatter Galaxies.</div>\
        <div>You have played for {{ timeDisplay(player.realTimePlayed) }}.</div>\
        <div v-if="realityUnlocked">Your existence has spanned {{ timeDisplay(player.totalTimePlayed) }} of time.</div>\
        <br>\
        <div v-if="infinityUnlocked">\
            <h3>Infinity</h3>\
            <div v-if="hasInfinities">You have infinitied {{ formatResetAmount(player.infinitied) }}<span v-if="eternityUnlocked"> this eternity</span>.</div>\
            <div v-else>You have\'t infinitied<span v-if="eternityUnlocked"> this eternity</span>.</div>\
            <div v-if="hasBankedInfinities">You have {{ formatAmount(player.infinitiedBank) }} banked infinities.</div>\
            <div v-if="hasBestInfinity">Your fastest Infinity is in {{ timeDisplay(player.bestInfinityTime) }}.</div>\
            <div v-else>You have\'t infinitied<span v-if="eternityUnlocked"> this eternity</span>.</div>\
            <div>You have spent {{ timeDisplay(player.thisInfinityTime) }} in this Infinity.</div>\
            <br>\
        </div>\
        <div v-if="eternityUnlocked">\
            <h3>Eternity</h3>\
            <div v-if="hasEternities">You have Eternitied {{ formatResetAmount(player.eternities) }}<span v-if="realityUnlocked"> this reality</span>.</div>\
            <div v-else>You have\'t Eternitied<span v-if="realityUnlocked"> this reality</span>.</div>\
            <div v-if="hasBestEternity">Your fastest Eternity is in {{ timeDisplay(player.bestEternity) }}.</div>\
            <div v-else>You have\'t Eternitied<span v-if="realityUnlocked"> this reality</span>.</div>\
            <div>You have spent {{ timeDisplay(player.thisEternity) }} in this Eternity.</div>\
            <br>\
        </div>\
        <div v-if="realityUnlocked">\
            <h3>Reality</h3>\
            <div>You have Realitied {{ formatResetAmount(player.realities) }}.</div>\
            <div>Your fastest Reality is in {{ timeDisplay(player.bestReality) }}.</div>\
            <div>You have spent {{ timeDisplay(player.thisReality) }} in this Reality.</div>\
            <br>\
        </div>\
        <div v-html="infoScale"></div>\
    </div>',
  computed: {
    player: function() {
      return this.model.player;
    },
    totalAntimatter: function() {
      return shortenMoney(this.player.totalmoney);
    },
    progress: function() {
      return PlayerProgress.of(this.model.player);
    },
    infinityUnlocked: function() {
      return this.progress.infinityUnlocked();
    },
    eternityUnlocked: function() {
      return this.progress.eternityUnlocked();
    },
    realityUnlocked: function() {
      return this.progress.realityUnlocked();
    },
    hasInfinities: function() {
      return this.player.infinitied > 0;
    },
    hasBankedInfinities: function() {
      return this.player.infinitiedBank > 0;
    },
    hasEternities: function() {
      return this.player.eternities > 0;
    },
    hasBestInfinity: function() {
      return this.player.bestInfinityTime < 999999999999;
    },
    hasBestEternity: function() {
      return this.player.bestEternity < 999999999999;
    },
    infoScale: function() {
      return estimateMatterScale(this.player.money);
    }
  },
  methods: {
    timeDisplay: function(time) {
      return timeDisplay(time);
    },
    formatAmount: function(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatResetAmount: function(value) {
      return this.formatAmount(value) + ((value === 1) ? " time" : " times");
    }
  }
});

const planck = 4.22419e-105;
const proton = 2.82e-45;

function estimateMatterScale(matter) {
  if (!matter) return "There is no antimatter yet.";
  if (matter.gt(Decimal.fromMantissaExponent(1, 100000))) {
    return "<br>If you wrote 3 numbers a second, it would take you " +
      "<br>" + timeDisplay(matter.log10() * 1000 / 3) +
      "<br> to write down your antimatter amount.";
  }
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
    {amount: planck, name: "planck volumes"}
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

var matterScale = [
  {amount: proton, name: "protons", verb: "make"},
  {amount: 1e-42, name: "nucleui", verb: "make"},
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