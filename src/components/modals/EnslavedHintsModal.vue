<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "EnslavedHintsModal",
  components: {
    ModalWrapper,
    PrimaryButton
  },
  data() {
    return {
      currentStored: 0,
      nextHintCost: 0,
      canGetHint: false,
      shownEntries: [],
      realityHintsLeft: 0,
      glyphHintsLeft: 0,
      hints: 0,
    };
  },
  computed: {
    hintCost() {
      return `${quantify("year", TimeSpan.fromMilliseconds(this.nextHintCost).totalYears, 2)}`;
    },
    formattedStored() {
      return `${quantify("year", TimeSpan.fromMilliseconds(this.currentStored).totalYears, 2)}`;
    },
    hasProgress(id) {
      return this.progressEntries.some(entry => entry.id === id);
    },
    // Note: This calculation seems to behave extremely poorly if the goal has been raised more than 12 hints worth
    // of cost bumps and I'm not entirely sure why. There's probably a numerical issue I can't quite figure out, but
    // considering that much cost raising can't happen in practice I think I'm just going to leave it be.
    timeEstimate() {
      if (this.currentStored >= this.nextHintCost) return "";

      // Relevant values are stored as milliseconds, so multiply the rate by 1000 to get to seconds
      const storeRate = 1000 * (Enslaved.isStoringGameTime
        ? Enslaved.currentBlackHoleStoreAmountPerMs
        : getGameSpeedupFactor());
      const alreadyWaited = this.currentStored / storeRate;
      const decaylessTime = this.nextHintCost / storeRate;

      // Check if decay is irrelevant and don't do the hard calculations if so
      const minCostEstimate = (TimeSpan.fromYears(1e40).totalMilliseconds - this.currentStored) / storeRate;
      if (TimeSpan.fromSeconds(minCostEstimate).totalDays > this.hints) {
        return `${TimeSpan.fromSeconds(minCostEstimate).toStringShort(true)}`;
      }

      // Decay is 3x per day, but the math needs decay per second
      const K = Math.pow(3, 1 / 86400);
      const x = decaylessTime * Math.log(K) * Math.pow(K, alreadyWaited);
      const timeToGoal = productLog(x) / Math.log(K) - alreadyWaited;
      return `${TimeSpan.fromSeconds(timeToGoal).toStringShort(true)}`;
    }
  },
  methods: {
    update() {
      this.currentStored = player.celestials.enslaved.stored;
      this.nextHintCost = Enslaved.nextHintCost;
      this.canGetHint = this.currentStored >= this.nextHintCost;
      this.shownEntries = [];

      this.realityHintsLeft = Object.values(EnslavedProgress).length;
      for (const prog of Object.values(EnslavedProgress)) {
        if (prog.hasHint) {
          this.shownEntries.push([prog.hasProgress
            ? prog.config.progress
            : "(You haven't figured this hint out yet)", prog.config.hint]);
          this.realityHintsLeft--;
        }
      }

      const glyphHintCount = player.celestials.enslaved.glyphHintsGiven;
      for (let hintNum = 0; hintNum < glyphHintCount; hintNum++) {
        this.shownEntries.push(["", GameDatabase.celestials.enslaved.glyphHints[hintNum]]);
      }
      this.glyphHintsLeft = GameDatabase.celestials.enslaved.glyphHints.length - glyphHintCount;

      this.hints = Enslaved.hintCostIncreases;
    },
    giveRealityHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      Object.values(EnslavedProgress).filter(prog => !prog.hasHint).randomElement().giveHint();
    },
    giveGlyphHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      player.celestials.enslaved.glyphHintsGiven++;
    }
  },

};
</script>

<template>
  <ModalWrapper
    class="c-enslaved-hint-modal"
    @close="emitClose"
  >
    <template #header>
      Cracks in The Enslaved Ones' Reality
    </template>
    <div>
      This Reality seems to be resisting your efforts to complete it. So far you have done the following:
    </div>
    <br>
    <div
      v-for="(entry, index) in shownEntries"
      :key="index"
    >
      <div v-if="entry[0]">
        <b>{{ entry[0] }}</b>
        <br>
        - {{ entry[1] }}
      </div>
      <div v-else>
        * <i>Glyph hint: {{ entry[1] }}</i>
      </div>
      <br>
    </div>
    <div v-if="realityHintsLeft + glyphHintsLeft > 0">
      You can spend some time looking for some more cracks in the Reality, but every hint you spend Stored Time on
      will increase the Stored Time needed for the next by a factor of {{ formatInt(3) }}. This cost bump will
      gradually go away over {{ formatInt(24) }} hours and figuring out what the hint means will immediately
      divide the cost by {{ formatInt(2) }}. The cost can't be reduced below {{ format(1e40) }} years.
      <br><br>
      The next hint will cost {{ hintCost }} Stored Time. You currently have {{ formattedStored }} stored.
      <span v-if="currentStored < nextHintCost">
        You will reach this if you charge your Black Hole for {{ timeEstimate }}.
      </span>
      <br><br>
      <PrimaryButton
        :enabled="realityHintsLeft > 0 && canGetHint"
        @click="giveRealityHint(realityHintsLeft)"
      >
        Get a hint about the Reality itself ({{ formatInt(realityHintsLeft) }} left)
      </PrimaryButton>
      <br>
      <PrimaryButton
        :enabled="glyphHintsLeft > 0 && canGetHint"
        @click="giveGlyphHint(glyphHintsLeft)"
      >
        Get a hint on what Glyphs to use ({{ formatInt(glyphHintsLeft) }} left)
      </PrimaryButton>
    </div>
    <div v-else>
      There are no more hints left!
    </div>
  </ModalWrapper>
</template>
