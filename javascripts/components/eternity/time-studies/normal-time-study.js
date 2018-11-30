Vue.component("normal-time-study", {
  props: {
    setup: Object
  },
  data: function() {
    return {
      description: String.empty,
      effectValue: new Decimal(0)
    };
  },
  computed: {
    study: function() {
      return this.setup.study;
    },
    displaySetup: function() {
      return normalTimeStudyDisplaySetup.find(s => s.study === this.study.id);
    },
    hasDynamicDescription: function() {
      return this.displaySetup !== undefined && this.displaySetup.formatDescription !== undefined;
    },
    hasEffectDisplay: function() {
      return this.displaySetup !== undefined && this.displaySetup.formatEffect !== undefined;
    },
    effectDisplay: function() {
      return this.displaySetup.formatEffect(this.effectValue, this.formatter);
    },
    classObject: function() {
      const classObject = {
        "o-time-study--normal": true
      };
      let pathClass;
      switch (this.setup.path) {
        case TimeStudyPath.NORMAL_DIM: pathClass = "o-time-study--normal-dim"; break;
        case TimeStudyPath.INFINITY_DIM: pathClass = "o-time-study--infinity-dim"; break;
        case TimeStudyPath.TIME_DIM: pathClass = "o-time-study--time-dim"; break;
        case TimeStudyPath.ACTIVE: pathClass = "o-time-study--active"; break;
        case TimeStudyPath.PASSIVE: pathClass = "o-time-study--passive"; break;
        case TimeStudyPath.IDLE: pathClass = "o-time-study--idle"; break;
        case TimeStudyPath.LIGHT: pathClass = "o-time-study--light"; break;
        case TimeStudyPath.DARK: pathClass = "o-time-study--dark"; break;
      }
      if (pathClass !== undefined) {
        classObject[pathClass] = true;
      }
      return classObject;
    }
  },
  created() {
    if (this.displaySetup !== undefined && !this.hasDynamicDescription) {
      this.description = this.displaySetup.description;
    }
  },
  methods: {
    update() {
      const displaySetup = this.displaySetup;
      if (displaySetup === undefined) return;
      if (this.hasDynamicDescription) {
        this.description = displaySetup.formatDescription(this.formatter);
      }
      if (this.hasEffectDisplay) {
        this.effectValue.copyFrom(new Decimal(this.study.effectValue));
      }
    },
    purchase: function() {
      this.study.purchase();
    }
  },
  template:
    `<time-study :setup="setup" :class="classObject" @purchase="purchase">
      {{description}}
      <template v-if="hasEffectDisplay">
        <br>
        <span>Currently: {{effectDisplay}}</span>
      </template>
    </time-study>`
});

const normalTimeStudyDisplaySetup = [
  {
    study: 11,
    description: "Tickspeed affects 1st Time Dimension with reduced effect",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(new Decimal(1).dividedBy(value))}x`
  },
  {
    study: 21,
    description: "Replicanti multiplier formula is better (log2(x)^2) -> (x^0.032)"
  },
  {
    study: 22,
    description: "Replicanti interval limit 50ms -> 1ms"
  },
  {
    study: 31,
    description: "Powers up bonuses that are based on your infinitied stat (to the power of 4)"
  },
  {
    study: 32,
    formatDescription: () => `You gain ${TimeStudy(32).effectValue}x more infinitied stat (based on Dimension Boosts)`
  },
  {
    study: 33,
    description: "You keep half of your Replicanti galaxies on Infinity"
  },
  {
    study: 41,
    description: "Each galaxy gives a 1.2x multiplier on IP gained.",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 42,
    description: "Galaxy requirement goes up 52 8ths instead of 60."
  },
  {
    study: 51,
    formatDescription: formatter => `You gain ${formatter.shortenCosts(1e15)}x more IP`
  },
  {
    study: 61,
    description: "You gain 10x more EP"
  },
  {
    study: 62,
    description: "You gain replicanti 3 times faster"
  },
  {
    study: 71,
    description: "Sacrifice affects all other normal dimensions with reduced effect",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 72,
    description: "Sacrifice affects 4th Infinity Dimension with greatly reduced effect",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 73,
    description: "Sacrifice affects 3rd Time Dimension with greatly reduced effect",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 81,
    description: "Dimension Boost power becomes 10x"
  },
  {
    study: 82,
    description: "Dimension Boosts affect Infinity Dimensions",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 83,
    description: "Dimension Boosts gain a multiplier based on tick upgrades gained from TDs",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 91,
    description: "Normal dimensions gain a multiplier based on time spent this eternity",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 92,
    description: "Infinity dimensions gain a multiplier based on fastest eternity time",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 93,
    description: "Time dimensions gain a multiplier based on tick upgrades gained",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 101,
    description: "Replicanti give a multiplier to normal dims equal to their amount.",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 102,
    description: "Replicanti galaxies boost replicanti multiplier",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 103,
    description: "Time dimensions gain a multiplier equal to replicanti galaxy amount",
    formatEffect: value => `${value.toNumber()}x`
  },
  {
    study: 111,
    description: "Make the IP formula better"
  },
  {
    study: 121,
    description: player.reality.perks.includes(72) ?
      "You gain 50x more EP" :
      "The worse your average EP/min is, the more EP you get",
    formatEffect: player.reality.perks.includes(72) ?
      undefined :
      value => `${value.toNumber()}x`
  },
  {
    study: 122,
    description: "You gain 35x more EP"
  },
  {
    study: 123,
    description: "You gain more EP based on time spent this Eternity",
    formatEffect: function(value) {
      // TODO
      if (player.reality.perks.includes(73)) {
        value = Math.sqrt(1.39*(player.thisEternity + 15 * 60 * 1000)/1000);
      }
      else {
        value = value.toNumber();
      }
      return `${value.toFixed(1)}x`;
    }
  },
  {
    study: 131,
    description: "Automatic Replicanti galaxies are disabled, but you can get 50% more"
  },
  {
    study: 132,
    description: "Replicanti galaxies are 40% more effective"
  },
  {
    study: 133,
    description: "Replicanti are 10x slower until infinity, but their galaxies are 50% stronger"
  },
  {
    study: 141,
    description: "Multiplier to IP, which decays over this Infinity",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 142,
    formatDescription: formatter => `You gain ${formatter.shortenCosts(1e25)}x more IP`
  },
  {
    study: 143,
    description: "Multiplier to IP, which increases over this Infinity",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 151,
    formatDescription: formatter => `${formatter.shortenCosts(1e4)}x multiplier on all Time Dimensions`
  },
  {
    study: 161,
    formatDescription: formatter => `${formatter.shortenCosts(new Decimal("1e616"))}x multiplier on all Normal Dimensions`
  },
  {
    study: 162,
    formatDescription: formatter => `${formatter.shortenCosts(1e11)}x multiplier on all Infinity Dimensions`
  },
  {
    study: 171,
    description: "Time shard requirement for the next tickspeed upgrade goes up slower"
  },
  {
    study: 181,
    description: "You gain 1% of your IP gained on crunch each second"
  },
  {
    study: 191,
    description: "After Eternity you permanently keep 5% of your Infinities"
  },
  {
    study: 192,
    formatDescription: formatter =>
      `You can get beyond ${formatter.shortenMoney(Number.MAX_VALUE)} ` +
      "Replicanti, but the interval is increased the more you have"
  },
  {
    study: 193,
    description: "Normal Dimension boost based on Eternities",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 201,
    description: "Pick another path from the first split"
  },
  {
    study: 211,
    description: "Dimension Boost requirement scaling is reduced by 5"
  },
  {
    study: 212,
    description: "Galaxies are more effective based on your time shards",
    formatEffect: value => `${((value - 1) * 100).toFixed(2)}%`
  },
  {
    study: 213,
    description: "You gain Replicanti 20 times faster"
  },
  {
    study: 214,
    description: "Sacrifice boosts the 8th Dimension even more",
    formatEffect: (value, formatter) => `${formatter.shortenMoney(value)}x`
  },
  {
    study: 221,
    description: "Time Dimensions gain a multiplier based on Dimension Boosts"
  },
  {
    study: 222,
    description: "Dimension Boost costs scale by another 2 less"
  },
  {
    study: 223,
    description: "Galaxy cost scaling starts 7 galaxies later"
  },
  {
    study: 224,
    description: "Galaxy cost scaling starts 1 galaxy later for every 2000 Dimension Boosts"
  },
  {
    study: 225,
    description: "You gain extra RGs based on your Replicanti amount",
    formatEffect: value => `+${value} RG`
  },
  {
    study: 226,
    description: "You gain extra RGs based on your max RGs",
    formatEffect: value => `+${value} RG`
  },
  {
    study: 227,
    description: "Sacrifice affects the 4th Time Dimension with reduced effect"
  },
  {
    study: 228,
    description: "Sacrifice scales better"
  },
  {
    study: 231,
    description: "Dimension Boosts are more effective based on their amount"
  },
  {
    study: 232,
    description: "Galaxies are more effective based on Antimatter Galaxies"
  },
  {
    study: 233,
    description: "Max Replicanti galaxy upgrade cost is reduced based on your Replicanti amount"
  },
  {
    study: 234,
    description: "Sacrifice boosts First Dimension"
  }
];