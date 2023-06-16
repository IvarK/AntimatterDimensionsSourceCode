<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import EffarigRunUnlockReward from "./EffarigRunUnlockReward";
import EffarigUnlockButton from "./EffarigUnlockButton";

export default {
  name: "EffarigTab",
  components: {
    EffarigUnlockButton,
    EffarigRunUnlockReward,
    CelestialQuoteHistory,
  },
  data() {
    return {
      relicShards: 0,
      shardRarityBoost: 0,
      shardPower: 0,
      shardsGained: 0,
      currentShardsRate: 0,
      amplification: 0,
      amplifiedShards: 0,
      amplifiedShardsRate: 0,
      runUnlocked: false,
      quote: "",
      isRunning: false,
      vIsFlipped: false,
      relicShardRarityAlwaysMax: false
    };
  },
  computed: {
    shopUnlocks: () => [
      EffarigUnlock.adjuster,
      EffarigUnlock.glyphFilter,
      EffarigUnlock.setSaves
    ],
    runUnlock: () => EffarigUnlock.run,
    runUnlocks: () => [
      EffarigUnlock.infinity,
      EffarigUnlock.eternity,
      EffarigUnlock.reality
    ],
    symbol: () => GLYPH_SYMBOLS.effarig,
    runButtonOuterClass() {
      return {
        "l-effarig-run-button": true,
        "c-effarig-run-button": true,
        "c-effarig-run-button--running": this.isRunning,
        "c-effarig-run-button--not-running": !this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runButtonInnerClass() {
      return this.isRunning ? "c-effarig-run-button__inner--running" : "c-effarig-run-button__inner--not-running";
    },
    runDescription() {
      return `${GameDatabase.celestials.descriptions[1].effects()}\n
      ${GameDatabase.celestials.descriptions[1].description()}`;
    },
    showShardsRate() {
      return this.currentShardsRate;
    },
    isDoomed: () => Pelle.isDoomed,
  },
  watch: {
    isRunning() {
      this.$recompute("runDescription");
    }
  },
  methods: {
    update() {
      this.relicShards = Currency.relicShards.value;
      this.shardRarityBoost = Effarig.maxRarityBoost / 100;
      this.shardPower = Ra.unlocks.maxGlyphRarityAndShardSacrificeBoost.effectOrDefault(1);
      this.shardsGained = Effarig.shardsGained;
      this.currentShardsRate = (this.shardsGained / Time.thisRealityRealTime.totalMinutes);
      this.amplification = simulatedRealityCount(false);
      this.amplifiedShards = this.shardsGained * (1 + this.amplification);
      this.amplifiedShardsRate = (this.amplifiedShards / Time.thisRealityRealTime.totalMinutes);
      this.quote = Effarig.quote;
      this.runUnlocked = EffarigUnlock.run.isUnlocked;
      this.isRunning = Effarig.isRunning;
      this.vIsFlipped = V.isFlipped;
      this.relicShardRarityAlwaysMax = Ra.unlocks.extraGlyphChoicesAndRelicShardRarityAlwaysMax.canBeApplied;
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Effarig's", number: 1 });
    },
    createCursedGlyph() {
      Glyphs.giveCursedGlyph();
    }
  }
};
</script>

<template>
  <div class="l-teresa-celestial-tab">
    <CelestialQuoteHistory celestial="effarig" />
    <div class="l-effarig-shop-and-run">
      <div class="l-effarig-shop">
        <div class="c-effarig-relics">
          You have {{ quantify("Relic Shard", relicShards, 2, 0) }}.
          <br>
          <span v-if="relicShardRarityAlwaysMax">
            The rarity of new Glyphs is being increased by +{{ formatPercents(shardRarityBoost, 2) }}.
          </span>
          <span v-else>
            Each new Glyph will have its rarity increased
            <br>
            by a random value between +{{ formatPercents(0) }} and +{{ formatPercents(shardRarityBoost, 2) }}.
          </span>
          <span v-if="shardPower > 1">
            <br>
            Glyph Sacrifice gain is also being raised to {{ formatPow(shardPower, 0, 2) }}.
          </span>
        </div>
        <div class="c-effarig-relic-description">
          You will gain {{ quantify("Relic Shard", shardsGained, 2) }} next Reality
          ({{ format(currentShardsRate, 2) }}/min).
          <span v-if="amplification !== 0">
            <br>
            Due to amplification of your current Reality,
            <br>
            you will actually gain a total of
            {{ quantify("Relic Shard", amplifiedShards, 2) }} ({{ format(amplifiedShardsRate, 2) }}/min).
          </span>
        </div>
        <div class="c-effarig-relic-description">
          <br>
          More Eternity Points slightly increases Relic Shards
          <br>
          gained. More distinct Glyph effects significantly
          <br>
          increases Relic Shards gained.
        </div>
        <EffarigUnlockButton
          v-for="(unlock, i) in shopUnlocks"
          :key="i"
          :unlock="unlock"
        />
        <EffarigUnlockButton
          v-if="!runUnlocked"
          :unlock="runUnlock"
        />
        <button
          v-if="vIsFlipped"
          class="c-effarig-shop-button c-effarig-shop-button--available"
          @click="createCursedGlyph"
        >
          Get a Cursed Glyph...
        </button>
      </div>
      <div
        v-if="runUnlocked"
        class="l-effarig-run"
      >
        <div class="c-effarig-run-description">
          <span :class="{ 'o-pelle-disabled': isDoomed }">
            Enter Effarig's Reality.
          </span>
        </div>
        <div
          :class="runButtonOuterClass"
          @click="startRun"
        >
          <div
            :class="runButtonInnerClass"
            :button-symbol="symbol"
          >
            {{ symbol }}
          </div>
        </div>
        <div class="c-effarig-run-description">
          {{ runDescription }}
        </div>
        <EffarigRunUnlockReward
          v-for="(unlock, i) in runUnlocks"
          :key="i"
          :unlock="unlock"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-effarig-relic-description {
  width: 46rem;
}
</style>
