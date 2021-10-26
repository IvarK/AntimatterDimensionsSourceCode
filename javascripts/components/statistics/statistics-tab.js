"use strict";

Vue.component("statistics-tab", {
  data() {
    return {
      totalAntimatter: new Decimal(0),
      realTimePlayed: TimeSpan.zero,
      uniqueNews: 0,
      totalNews: 0,
      secretAchievementCount: 0,
      infinity: {
        isUnlocked: false,
        count: new Decimal(0),
        banked: new Decimal(0),
        projectedBanked: new Decimal(0),
        bankRate: new Decimal(0),
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
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new Decimal(0),
        bestRarity: 0,
      },
      matterScale: [],
    };
  },
  computed: {
    // These are here to avoid extra spaces in-game pre-reality and to get around codefactor 120-char limits in the
    // HTML template due to the fact that adding a linebreak also adds a space
    infinityCountString() {
      const num = this.infinity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Infinity", num, "Infinities")}`
        : "no Infinities";
    },
    eternityCountString() {
      const num = this.eternity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Eternity", num, "Eternities")}`
        : "no Eternities";
    }
  },
  methods: {
    update() {
      const records = player.records;
      this.totalAntimatter.copyFrom(records.totalAntimatter);
      this.realTimePlayed.setFrom(records.realTimePlayed);
      this.uniqueNews = NewsHandler.uniqueTickersSeen;
      this.totalNews = player.news.totalSeen;
      this.secretAchievementCount = SecretAchievements.all.filter(a => a.isUnlocked).length;

      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked || player.devMode;
      const infinity = this.infinity;
      const bestInfinity = records.bestInfinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count.copyFrom(Currency.infinities);
        infinity.banked.copyFrom(Currency.infinitiesBanked);
        infinity.projectedBanked = new Decimal(0).plusEffectsOf(
          Achievement(131),
          TimeStudy(191)
        );
        infinity.bankRate = infinity.projectedBanked.div(Math.clampMin(33, records.thisEternity.time)).times(60000);
        infinity.hasBest = bestInfinity.time < 999999999999;
        infinity.best.setFrom(bestInfinity.time);
        infinity.this.setFrom(records.thisInfinity.time);
        infinity.bestRate.copyFrom(bestInfinity.bestIPminEternity);
      }

      const isEternityUnlocked = progress.isEternityUnlocked || player.devMode;
      const eternity = this.eternity;
      const bestEternity = records.bestEternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count.copyFrom(Currency.eternities);
        eternity.hasBest = bestEternity.time < 999999999999;
        eternity.best.setFrom(bestEternity.time);
        eternity.this.setFrom(records.thisEternity.time);
        eternity.bestRate.copyFrom(bestEternity.bestEPminReality);
      }

      const isRealityUnlocked = progress.isRealityUnlocked || player.devMode;
      const reality = this.reality;
      const bestReality = records.bestReality;
      reality.isUnlocked = isRealityUnlocked;

      if (isRealityUnlocked) {
        reality.count = Math.floor(Currency.realities.value);
        reality.best.setFrom(bestReality.time);
        reality.bestReal.setFrom(bestReality.realTime);
        reality.this.setFrom(records.thisReality.time);
        reality.totalTimePlayed.setFrom(records.totalTimePlayed);
        // Real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(records.thisInfinity.realTime);
        infinity.bankRate = infinity.projectedBanked.div(Math.clampMin(33, records.thisEternity.realTime)).times(60000);
        eternity.thisReal.setFrom(records.thisEternity.realTime);
        reality.thisReal.setFrom(records.thisReality.realTime);
        reality.bestRate.copyFrom(bestReality.RMmin);
        reality.bestRarity = Math.max(strengthToRarity(bestReality.glyphStrength), 0);
      }
      this.matterScale = MatterScale.estimate(Currency.antimatter.value);
    },
    formatDecimalAmount(value) {
      return value.gt(1e9) ? format(value, 3, 0) : formatInt(value.toNumber());
    }
  },
  template: `
    <div class="c-stats-tab">
      <div>
        <div class="c-stats-tab-general">General</div>
        <div>You have made a total of {{ format(totalAntimatter, 2, 1) }} antimatter.</div>
        <div>You have played for {{ realTimePlayed }}. (real time)</div>
        <div v-if="reality.isUnlocked">
          Your existence has spanned {{ reality.totalTimePlayed }} of time. (game time)
        </div>
        <div>
          You have seen {{ formatInt(totalNews) }}
          news {{ "message" | pluralize(totalNews) }}
          in total.
        </div>
        <div>
          You have seen {{ formatInt(uniqueNews) }} unique
          news {{ "message" | pluralize(uniqueNews) }}.
        </div>
        <div>
          You have unlocked {{ formatInt(secretAchievementCount) }} Secret
          {{ "Achievement" | pluralize(secretAchievementCount) }}.
        </div>
        <div>
          <br>
          <div style="height: 5rem;">
            <div v-for="line in matterScale">
              {{ line }}
            </div>
            <br v-if="matterScale.length < 2">
            <br v-if="matterScale.length < 3">
          </div>
        </div>
        <br>
      </div>
      <div v-if="infinity.isUnlocked" class="c-stats-tab-subheader">
        <div class="c-stats-tab-general c-stats-tab-infinity">Infinity</div>
        <div>
          You have {{ infinityCountString }}<span v-if="eternity.isUnlocked"> this Eternity</span>.
        </div>
        <div v-if="infinity.banked.gt(0)">
          You have {{ formatDecimalAmount(infinity.banked) }} Banked
          {{ "Infinity" | pluralize(infinity.banked, "Infinities") }}.
        </div>
        <div v-if="infinity.hasBest">
          Your fastest Infinity was {{ infinity.best.toStringShort() }}.
        </div>
        <div v-else>
          You have no fastest Infinity<span v-if="eternity.isUnlocked"> this Eternity</span>.
        </div>
        <div>
          You have spent {{ infinity.this.toStringShort() }} in this Infinity.
          <span v-if="reality.isUnlocked">
            ({{ infinity.thisReal.toStringShort() }} real time)
          </span>
        </div>
        <div>
          Your best Infinity Points per minute
          <span v-if="eternity.count.gt(0)">this Eternity </span>
          is {{ format(infinity.bestRate, 2, 2) }}.
        </div>
        <br>
      </div>
      <div v-if="eternity.isUnlocked" class="c-stats-tab-subheader">
        <div class="c-stats-tab-general c-stats-tab-eternity">Eternity</div>
        <div>
          You have {{ eternityCountString }}<span v-if="reality.isUnlocked"> this Reality</span>.
        </div>
        <div v-if="infinity.projectedBanked.gt(0)">
          You will gain {{ formatDecimalAmount(infinity.projectedBanked) }} Banked
          {{ "Infinity" | pluralize(infinity.projectedBanked, "Infinities") }} on Eternity
          ({{ formatDecimalAmount(infinity.bankRate) }} per minute).
        </div>
        <div v-else-if="infinity.banked.gt(0)">
          You will gain no Banked Infinities on Eternity.
        </div>
        <div v-if="eternity.hasBest">Your fastest Eternity was {{ eternity.best.toStringShort() }}.</div>
        <div v-else>You have no fastest Eternity<span v-if="reality.isUnlocked"> this Reality</span>.</div>
        <div>You have spent {{ eternity.this.toStringShort() }} in this Eternity.
          <span v-if="reality.isUnlocked">
            ({{ eternity.thisReal.toStringShort() }} real time)
          </span>
        </div>
        <div>
          Your best Eternity Points per minute
          <span v-if="reality.isUnlocked">this Reality </span>
          is {{ format(eternity.bestRate, 2, 2) }}.
        </div>
        <br>
      </div>
      <div v-if="reality.isUnlocked" class="c-stats-tab-subheader">
        <div class="c-stats-tab-general c-stats-tab-reality">Reality</div>
        <div>You have {{ formatInt(reality.count) }} {{ "Reality" | pluralize(reality.count, "Realities") }}.</div>
        <div>Your fastest game-time Reality was {{ reality.best.toStringShort() }}.</div>
        <div>Your fastest real-time Reality was {{ reality.bestReal.toStringShort() }}.</div>
        <div>
          You have spent
          {{ reality.this.toStringShort() }} in this Reality. ({{ reality.thisReal.toStringShort() }} real time)
        </div>
        <div>
          Your best Reality Machines per minute is {{ format(reality.bestRate, 2, 2) }}.
        </div>
        <div>Your best glyph rarity is {{ formatRarity(reality.bestRarity) }}.</div>
        <br>
      </div>
    </div>`
});

const MatterScale = {
  proton: DC.D2_82EM45,

  estimate(matter) {
    if (!matter) return ["There is no antimatter yet."];
    if (matter.gt(DC.E100000)) {
      return [
        `If you wrote ${formatInt(3)} numbers a second, it would take you`,
        TimeSpan.fromSeconds(matter.log10() / 3).toString(),
        "to write down your antimatter amount."
      ];
    }
    const planck = DC.D4_22419EM105;
    const planckedMatter = matter.times(planck);
    if (planckedMatter.gt(this.proton)) {
      const scale = this.macroScale(planckedMatter);
      const amount = format(planckedMatter.dividedBy(scale.amount), 2, 1);
      return [`If every antimatter were a planck volume, you would have
        enough to ${scale.verb} ${amount} ${scale.name}`];
    }
    const scale = this.microScale(matter);
    return [`If every antimatter were ${format(this.proton / scale.amount / matter.toNumber(), 2, 1)} ${scale.name},
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
      if (macro[mid].amount.lte(matter)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return macro[high - 1];
  },

  microObjects: [
    { amount: DC.EM54, name: "attometers cubed" },
    { amount: DC.EM63, name: "zeptometers cubed" },
    { amount: DC.EM72, name: "yoctometers cubed" },
    { amount: DC.D4_22419EM105, name: "planck volumes" }
  ],

  macroObjects: [
    { amount: DC.D2_82EM45, name: "protons", verb: "make" },
    { amount: DC.EM42, name: "nuclei", verb: "make" },
    { amount: DC.D7_23EM30, name: "Hydrogen atoms", verb: "make" },
    { amount: DC.D5EM21, name: "viruses", verb: "make" },
    { amount: DC.D9EM17, name: "red blood cells", verb: "make" },
    { amount: DC.D6_2EM11, name: "grains of sand", verb: "make" },
    { amount: DC.D5EM8, name: "grains of rice", verb: "make" },
    { amount: DC.D3_555EM6, name: "teaspoons", verb: "fill" },
    { amount: DC.D7_5EM4, name: "wine bottles", verb: "fill" },
    { amount: DC.D1, name: "fridge-freezers", verb: "fill" },
    { amount: DC.D2_5E3, name: "Olympic-sized swimming pools", verb: "fill" },
    { amount: DC.D2_6006E6, name: "Great Pyramids of Giza", verb: "make" },
    { amount: DC.D3_3E8, name: "Great Walls of China", verb: "make" },
    { amount: DC.D5E12, name: "large asteroids", verb: "make" },
    { amount: DC.D4_5E17, name: "dwarf planets", verb: "make" },
    { amount: DC.D1_08E21, name: "Earths", verb: "make" },
    { amount: DC.D1_53E24, name: "Jupiters", verb: "make" },
    { amount: DC.D1_41E27, name: "Suns", verb: "make" },
    { amount: DC.D5E32, name: "red giants", verb: "make" },
    { amount: DC.D8E36, name: "hypergiant stars", verb: "make" },
    { amount: DC.D1_7E45, name: "nebulas", verb: "make" },
    { amount: DC.D1_7E48, name: "Oort clouds", verb: "make" },
    { amount: DC.D3_3E55, name: "Local Bubbles", verb: "make" },
    { amount: DC.D3_3E61, name: "galaxies", verb: "make" },
    { amount: DC.D5E68, name: "Local Groups", verb: "make" },
    { amount: DC.E73, name: "Sculptor Voids", verb: "make" },
    { amount: DC.D3_4E80, name: "observable universes", verb: "make" },
    { amount: DC.E113, name: "Dimensions", verb: "make" },
    { amount: DC.C2P1024, name: "Infinity Dimensions", verb: "make" },
    { amount: DC.E65000, name: "Time Dimensions", verb: "make" }
  ]
};
