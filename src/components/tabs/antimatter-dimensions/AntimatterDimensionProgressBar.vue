<script>
import { DC } from "@/core/constants";

export default {
  name: "AntimatterDimensionProgressBar",
  data() {
    return {
      fill: 0,
      tooltip: "",
      displayPercents: "",
    };
  },
  computed: {
    progressBarStyle() {
      return {
        width: `${(this.fill * 100).toFixed(2)}%`
      };
    }
  },
  methods: {
    // eslint-disable-next-line complexity
    update() {
      this.displayPercents = formatPercents(this.fill, 2);
      const setProgress = (current, goal, tooltip) => {
        this.fill = Math.clampMax(current.pLog10() / Decimal.log10(goal), 1);
        this.tooltip = tooltip;
      };
      const setLinearProgress = (current, goal, tooltip) => {
        this.fill = Math.clampMax(current / goal, 1);
        this.tooltip = tooltip;
      };

      // Goals for challenges and challenge-like runs should come first because numbers will always be much smaller
      // than normal and therefore default filling won't be meaningful. Since challenges get completed or abandoned from
      // the inside outwards, we show the goals in that priority as well. It only makes sense to check cel6 and not the
      // others because pre-cel3 completion it'll default to e4000 and cel4/5 don't have meaningful single goals
      const inSpecialRun = Player.isInAntimatterChallenge || EternityChallenge.isRunning || player.dilation.active ||
        Laitela.isRunning;
      if (inSpecialRun) {
        if (Player.isInAntimatterChallenge) {
          setProgress(Currency.antimatter.value, Player.antimatterChallenge.goal, "Percentage to Challenge goal");
        } else if (EternityChallenge.isRunning) {
          if (Perk.studyECBulk.isBought) {
            // Note: If the EC is fully complete, this prop doesn't exist
            const goal = EternityChallenge.current.gainedCompletionStatus.nextGoalAt;
            if (goal) {
              setProgress(Currency.infinityPoints.value, goal, "Percentage to next Challenge completion");
            } else {
              // In a fully completed EC, there's nothing useful we can show so we just pin it at 100% and say so
              setProgress(Currency.infinityPoints.value, 10, "This Challenge is already fully completed!");
            }
          } else {
            setProgress(Currency.infinityPoints.value, Player.eternityGoal, "Percentage to Eternity Challenge goal");
          }
        } else if (player.dilation.active) {
          if (player.dilation.lastEP.gt(0)) {
            setProgress(Currency.antimatter.value, getTachyonReq(), "Percentage to gain more TP in Dilation");
          } else {
            setProgress(Currency.infinityPoints.value, Player.eternityGoal, "Percentage to Eternity in Dilation");
          }
        } else {
          // Lai'tela destabilization; since the progress bar is logarithmically-scaled, we need to pow10 the arguments
          setProgress(Decimal.pow10(player.celestials.laitela.entropy), 10, "Percentage to Destabilized Reality");
        }
      } else if (Pelle.isDoomed) {
        if (PelleRifts.recursion.milestones[2].canBeApplied || GalaxyGenerator.spentGalaxies > 0) {
          setProgress(Currency.infinityPoints.value, Tesseracts.nextCost, "Percentage to next Tesseract");
        } else if (PelleStrikes.dilation.hasStrike) {
          setProgress(Currency.eternityPoints.value, DC.E4000, "Percentage to Galaxy Generator");
        } else if (PelleStrikes.ECs.hasStrike) {
          setLinearProgress(
            (Math.min(Currency.timeTheorems.max.toNumber() / 12900, 1) +
            Math.min(EternityChallenges.completions / 60, 1)) / 2,
            1, "Percentage to fifth Strike");
        } else if (PelleStrikes.eternity.hasStrike) {
          setLinearProgress(Currency.timeTheorems.max.toNumber(), 115, "Percentage to fourth Strike");
        } else if (PelleStrikes.powerGalaxies.hasStrike) {
          setProgress(Currency.infinityPoints.value, Player.eternityGoal, "Percentage to third Strike");
        } else if (PelleStrikes.infinity.hasStrike) {
          if (player.break) {
            setProgress(Currency.infinityPoints.value, 5e11, "Percentage to second Strike");
          } else {
            setProgress(Currency.antimatter.value, Decimal.NUMBER_MAX_VALUE, "Percentage to Infinity");
          }
        } else {
          setProgress(Currency.antimatter.value, Decimal.NUMBER_MAX_VALUE, "Percentage to first Strike");
        }
      } else if (Enslaved.isCompleted) {
        // Show all other goals from the top down, starting at features in the highest prestige layer
        setProgress(Currency.infinityPoints.value, Tesseracts.nextCost, "Percentage to next Tesseract");
      } else if (PlayerProgress.dilationUnlocked()) {
        setProgress(Currency.eternityPoints.value, DC.E4000, "Percentage to Reality");
      } else if (InfinityDimension(8).isUnlocked) {
        setProgress(Currency.infinityPoints.value, Player.eternityGoal, "Percentage to Eternity");
      } else if (player.break) {
        const text = `Percentage to unlock a new ${InfinityDimensions.next().hasIPUnlock
          ? "type of Dimension"
          : "Infinity Dimension"}`;
        const nextID = InfinityDimensions.next();
        if (nextID.ipRequirementReached) {
          setProgress(player.records.thisEternity.maxAM, nextID.amRequirement, text);
        } else {
          setProgress(player.infinityPoints, nextID.ipRequirement, text);
        }
      } else {
        setProgress(Currency.antimatter.value, Decimal.NUMBER_MAX_VALUE, "Percentage to Infinity");
      }
    }
  }
};
</script>

<template>
  <div class="c-progress-bar">
    <div
      :style="progressBarStyle"
      class="c-progress-bar__fill"
    >
      <span
        v-tooltip="tooltip"
        class="c-progress-bar__percents"
      >
        {{ displayPercents }}
      </span>
    </div>
  </div>
</template>
