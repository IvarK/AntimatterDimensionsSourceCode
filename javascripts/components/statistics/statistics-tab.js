"use strict";

Vue.component("statistics-tab", {
  data() {
    return {
      totalAntimatter: new Decimal(0),
      realTimePlayed: TimeSpan.zero,
      newsMessagesSeen: 0,
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
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new Decimal(0),
        bestRarity: 0,
      },
      matterScale: [],
      recordGlyphInfo: [],
    };
  },
  methods: {
    update() {
      this.totalAntimatter.copyFrom(player.records.totalAntimatter);
      this.realTimePlayed.setFrom(player.records.realTimePlayed);
      this.newsMessagesSeen = player.news.size;
      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked || player.devMode;
      const infinity = this.infinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count.copyFrom(Currency.infinities);
        infinity.banked.copyFrom(Currency.infinitiesBanked);
        infinity.hasBest = player.records.bestInfinity.time < 999999999999;
        infinity.best.setFrom(player.records.bestInfinity.time);
        infinity.this.setFrom(player.records.thisInfinity.time);
        infinity.bestRate.copyFrom(player.records.bestInfinity.bestIPminEternity);
      }
      const isEternityUnlocked = progress.isEternityUnlocked || player.devMode;
      const eternity = this.eternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count.copyFrom(Currency.eternities);
        eternity.hasBest = player.records.bestEternity.time < 999999999999;
        eternity.best.setFrom(player.records.bestEternity.time);
        eternity.this.setFrom(player.records.thisEternity.time);
        eternity.bestRate.copyFrom(player.records.bestEternity.bestEPminReality);
      }
      const isRealityUnlocked = progress.isRealityUnlocked || player.devMode;
      const reality = this.reality;
      reality.isUnlocked = isRealityUnlocked;
      if (isRealityUnlocked) {
        reality.count = Math.floor(Currency.realities.value);
        reality.best.setFrom(player.records.bestReality.time);
        reality.bestReal.setFrom(player.records.bestReality.realTime);
        reality.this.setFrom(player.records.thisReality.time);
        reality.totalTimePlayed.setFrom(player.records.totalTimePlayed);
        // Real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(player.records.thisInfinity.realTime);
        eternity.thisReal.setFrom(player.records.thisEternity.realTime);
        reality.thisReal.setFrom(player.records.thisReality.realTime);
        reality.bestRate.copyFrom(player.records.bestReality.RMmin);
        reality.bestRarity = Math.max(strengthToRarity(player.records.bestReality.glyphStrength), 0);
      }
      this.matterScale = MatterScale.estimate(Currency.antimatter.value);
      this.recordGlyphInfo = [
        [true, Glyphs.copyForRecords(player.records.bestReality.RMminSet),
          `Best Reality Machines per minute: ${format(player.records.bestReality.RMmin, 2, 2)} RM/min`],
        [true, Glyphs.copyForRecords(player.records.bestReality.glyphLevelSet),
          `Best Glyph level: ${formatInt(player.records.bestReality.glyphLevel)}`],
        [true, Glyphs.copyForRecords(player.records.bestReality.bestEPSet),
          `Best Eternity Points: ${format(player.records.bestReality.bestEP, 2, 2)} Eternity Points`],
        [true, Glyphs.copyForRecords(player.records.bestReality.speedSet),
          `Fastest Reality (real time): ${reality.bestReal.toStringShort()}`],
        [player.celestials.teresa.bestRunAM.gt(1), Glyphs.copyForRecords(player.celestials.teresa.bestAMSet),
          `Best Antimatter in Teresa: ${format(player.celestials.teresa.bestRunAM, 2, 2)} Antimatter`]
      ];
    },
    formatDecimalAmount(value) {
      return value.gt(1e9) ? format(value, 3, 0) : formatInt(value.toNumber());
    }
  },
  template:
    `<div class="c-stats-tab">
        <div>
          <div class="c-stats-tab-general">General</div>
          <div>You have made a total of {{ format(totalAntimatter, 2, 1) }} antimatter.</div>
          <div>You have played for {{ realTimePlayed }}.</div>
          <div v-if="reality.isUnlocked">
            Your existence has spanned {{ reality.totalTimePlayed }} of time.
          </div>
          <div>You have seen {{ formatInt(newsMessagesSeen) }} unique
          news ticker {{ "message" | pluralize(newsMessagesSeen) }}.</div>
          <div>
            <br>
            <div
              v-if="eternity.thisReal.totalSeconds > 1 && infinity.thisReal.totalSeconds > 1"
              v-for="line in matterScale">{{line}}</div>
          </div>
          <br>
        </div>
        <div v-if="infinity.isUnlocked">
            <div class="c-stats-tab-general c-stats-tab-infinity">Infinity</div>
            <div v-if="infinity.count.gt(0)">
              You have {{ formatDecimalAmount(infinity.count) }}
              {{"Infinity" | pluralize(infinity.count, "Infinities")}}<span
              v-if="eternity.isUnlocked"> this Eternity</span>.
            </div>
            <div v-else>You have no Infinities<span v-if="eternity.isUnlocked"> this Eternity</span>.</div>
            <div v-if="infinity.banked.gt(0)">
              You have {{ formatDecimalAmount(infinity.banked) }} Banked
              {{"Infinity" | pluralize(infinity.banked, "Infinities")}}.
            </div>
            <div v-if="infinity.hasBest">Your fastest Infinity was {{ infinity.best.toStringShort() }}.</div>
            <div v-else>You have no fastest Infinity<span v-if="eternity.isUnlocked"> this Eternity</span>.</div>
            <div>You have spent {{ infinity.this.toStringShort() }} in this Infinity.
              <span v-if="reality.isUnlocked">
                ({{infinity.thisReal.toStringShort()}} real time)
              </span>
            </div>
            <div>
              Your best Infinity Points per minute
              <span v-if="eternity.count.gt(0)">this Eternity </span>
              is {{ format(infinity.bestRate, 2, 2) }}.
            </div>
            <br>
        </div>
        <div v-if="eternity.isUnlocked">
            <div class="c-stats-tab-general c-stats-tab-eternity">Eternity</div>
            <div v-if="eternity.count.gt(0)">
              You have {{ formatDecimalAmount(eternity.count) }}
              {{"Eternity" | pluralize(eternity.count, "Eternities")}}<span
              v-if="reality.isUnlocked"> this Reality</span>.
            </div>
            <div v-else>You have no Eternities<span v-if="reality.isUnlocked"> this Reality</span>.</div>
            <div v-if="eternity.hasBest">Your fastest Eternity was {{ eternity.best.toStringShort() }}.</div>
            <div v-else>You have no fastest Eternity<span v-if="reality.isUnlocked"> this Reality</span>.</div>
            <div>You have spent {{ eternity.this.toStringShort() }} in this Eternity.
              <span v-if="reality.isUnlocked">
                ({{eternity.thisReal.toStringShort()}} real time)
              </span>
            </div>
            <div>
              Your best Eternity Points per minute
              <span v-if="reality.isUnlocked">this Reality </span>
              is {{ format(eternity.bestRate, 2, 2) }}.
            </div>
            <br>
        </div>
        <div v-if="reality.isUnlocked">
            <div class="c-stats-tab-general c-stats-tab-reality">Reality</div>
            <div>You have {{formatInt(reality.count)}} {{"Reality" | pluralize(reality.count, "Realities")}}.</div>
            <div>Your fastest game-time Reality was {{ reality.best.toStringShort() }}.</div>
            <div>Your fastest real-time Reality was {{ reality.bestReal.toStringShort() }}.</div>
            <div>
              You have spent
              {{ reality.this.toStringShort() }} in this Reality. ({{reality.thisReal.toStringShort()}} real time)
            </div>
            <div>
              Your best Reality Machines per minute is {{ format(reality.bestRate, 2, 2) }}.
            </div>
            <div>Your best glyph rarity is {{ formatRarity(reality.bestRarity) }}.</div>
            <br>
          <glyph-set-preview
            v-for="(set, idx) in recordGlyphInfo"
            :key="idx"
            :show="set[0]"
            :glyphs="set[1]"
            :text="set[2]" />
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
