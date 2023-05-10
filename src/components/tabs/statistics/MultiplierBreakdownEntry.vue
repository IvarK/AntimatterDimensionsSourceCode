<script>
import { DC } from "@/core/constants";

import { BreakdownEntryInfo } from "./breakdown-entry-info";
import { getResourceEntryInfoGroups } from "./breakdown-entry-info-group";
import { PercentageRollingAverage } from "./percentage-rolling-average";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

// A few props are special-cased because they're base values which can be less than 1, but we don't want to
// show them as nerfs
const nerfBlacklist = ["IP_base", "EP_base", "TP_base"];

function padPercents(percents) {
  // Add some padding to percents to prevent text flicker
  // Max length is for "-100.0%"
  return percents.padStart(7, "\xa0");
}

export default {
  name: "MultiplierBreakdownEntry",
  components: {
    PrimaryToggleButton
  },
  props: {
    resource: {
      type: BreakdownEntryInfo,
      required: true,
    },
    isRoot: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      selected: 0,
      percentList: [],
      averagedPercentList: [],
      showGroup: [],
      hadChildEntriesAt: [],
      mouseoverIndex: -1,
      lastNotEmptyAt: 0,
      dilationExponent: 1,
      isDilated: false,
      // This is used to temporarily remove the transition function from the bar styling when changing the way
      // multipliers are split up; the animation which results from not doing this looks very awkward
      lastLayoutChange: Date.now(),
      now: Date.now(),
      totalMultiplier: DC.D1,
      totalPositivePower: 1,
      replacePowers: player.options.multiplierTab.replacePowers,
      inNC12: false,
    };
  },
  computed: {
    groups() {
      return getResourceEntryInfoGroups(this.resource.key);
    },
    /**
     * @returns {BreakdownEntryInfo[]}
     */
    entries() {
      return this.groups[this.selected].entries;
    },
    rollingAverage() {
      return new PercentageRollingAverage();
    },
    containerClass() {
      return {
        "c-multiplier-entry-container": true,
        "c-multiplier-entry-root-container": this.isRoot,
      };
    },
    isEmpty() {
      return !this.isRecent(this.lastNotEmptyAt);
    },
    disabledText() {
      if (!this.resource.isBase) return `Total effect inactive, disabled, or reduced to ${formatX(1)}`;
      return Decimal.eq(this.resource.mult, 0)
        ? `You cannot gain this resource (prestige requirement not reached)`
        : `You have no multipliers for this resource (will gain ${format(1)} on prestige)`;
    },
    // IC4 is the first time the player sees a power-based effect, not counting how infinity power is handled.
    // This doesn't need to be reactive because completing IC4 for the first time forces a tab switch
    hasSeenPowers() {
      return InfinityChallenge(4).isCompleted || PlayerProgress.eternityUnlocked();
    },
    // While infinity power is a power-based effect, we want to disallow showing that as an equivalent multiplier
    // since that it doesn't make a whole lot of sense to do that. We also want to hide this for entries related
    // to tickspeed/galaxies because we already mostly hack those with fake values and should thus not allow those
    // to be changed either.
    allowPowerToggle() {
      const forbiddenEntries = ["AD_infinityPower", "galaxies", "tickspeed"];
      // Uses startsWith instead of String equality since it has to match both the top-level entry and any
      // related children entries further down the tree.
      return !forbiddenEntries.some(key => this.resource.key.startsWith(key));
    },
  },
  watch: {
    replacePowers(newValue) {
      player.options.multiplierTab.replacePowers = newValue;
    },
  },
  created() {
    if (this.groups.length > 1 && player.options.multiplierTab.showAltGroup) {
      this.changeGroup();
    }
  },
  methods: {
    update() {
      for (let i = 0; i < this.entries.length; i++) {
        const entry = this.entries[i];
        entry.update();
        const hasChildEntries = getResourceEntryInfoGroups(entry.key)
          .some(group => group.hasVisibleEntries);
        if (hasChildEntries) {
          this.hadChildEntriesAt[i] = Date.now();
        }
      }
      this.dilationExponent = this.resource.dilationEffect;
      this.isDilated = this.dilationExponent !== 1;
      this.calculatePercents();
      this.now = Date.now();
      this.replacePowers = player.options.multiplierTab.replacePowers && this.allowPowerToggle;
      this.inNC12 = NormalChallenge(12).isRunning;
    },
    changeGroup() {
      this.selected = (this.selected + 1) % this.groups.length;
      player.options.multiplierTab.showAltGroup = this.selected === 1;
      this.showGroup = Array.repeat(false, this.entries.length);
      this.hadChildEntriesAt = Array.repeat(0, this.entries.length);
      this.lastLayoutChange = Date.now();
      this.rollingAverage.clear();
      this.update();
    },
    calculatePercents() {
      const powList = this.entries.map(e => e.data.pow);
      const totalPosPow = powList.filter(p => p > 1).reduce((x, y) => x * y, 1);
      const totalNegPow = powList.filter(p => p < 1).reduce((x, y) => x * y, 1);
      const log10Mult = (this.resource.fakeValue ?? this.resource.mult).log10() / totalPosPow;
      const isEmpty = log10Mult === 0;
      if (!isEmpty) {
        this.lastNotEmptyAt = Date.now();
      }
      let percentList = [];
      for (const entry of this.entries) {
        const multFrac = log10Mult === 0
          ? 0
          : Decimal.log10(entry.data.mult) / log10Mult;
        const powFrac = totalPosPow === 1 ? 0 : Math.log(entry.data.pow) / Math.log(totalPosPow);

        // Handle nerf powers differently from everything else in order to render them with the correct bar percentage
        const perc = entry.data.pow >= 1
          ? multFrac / totalPosPow + powFrac * (1 - 1 / totalPosPow)
          : Math.log(entry.data.pow) / Math.log(totalNegPow) * (totalNegPow - 1);

        // This is clamped to a minimum of something that's still nonzero in order to show it at <0.1% instead of 0%
        percentList.push(
          [entry.ignoresNerfPowers, nerfBlacklist.includes(entry.key) ? Math.clampMin(perc, 0.0001) : perc]
        );
      }

      // Shortly after a prestige, these may add up to a lot more than the base amount as production catches up. This
      // is also necessary to suppress some visual weirdness for certain categories which have lots of exponents but
      // actually apply only to specific dimensions (eg. charged infinity upgrades)
      // We have a nerfedPerc variable to give a percentage breakdown as if all multipliers which ARE affected by nerf
      // power effects already had them applied; there is support in the classes to allow for some to be affected but
      // not others. The only actual case of this occurring is V's Reality not affecting gamespeed for DT, but it was
      // cleaner to adjust the class structure instead of specifically special-casing it here
      const totalPerc = percentList.filter(p => p[1] > 0).map(p => p[1]).sum();
      const nerfedPerc = percentList.filter(p => p[1] > 0)
        .reduce((x, y) => x + (y[0] ? y[1] : y[1] * totalNegPow), 0);
      percentList = percentList.map(p => {
        if (p[1] > 0) {
          return (p[0] ? p[1] : p[1] * totalNegPow) / nerfedPerc;
        }
        return Math.clampMin(p[1] * (totalPerc - nerfedPerc) / totalPerc / totalNegPow, -1);
      });
      this.percentList = percentList;
      this.rollingAverage.add(isEmpty ? undefined : percentList);
      this.averagedPercentList = this.rollingAverage.average;
      this.totalMultiplier = Decimal.pow10(log10Mult);
      this.totalPositivePower = totalPosPow;
    },
    styleObject(index) {
      const netPerc = this.averagedPercentList.sum();
      const isNerf = this.averagedPercentList[index] < 0;
      const iconObj = this.entries[index].icon;
      const percents = this.averagedPercentList[index];
      const barSize = perc => (perc > 0 ? perc * netPerc : -perc);
      return {
        position: "absolute",
        top: `${100 * this.averagedPercentList.slice(0, index).map(p => barSize(p)).sum()}%`,
        height: `${100 * barSize(percents)}%`,
        width: "100%",
        "transition-duration": this.isRecent(this.lastLayoutChange) ? undefined : "0.2s",
        border: percents === 0 ? "" : "0.1rem solid var(--color-text)",
        color: iconObj?.textColor ?? "black",
        background: isNerf
          ? `repeating-linear-gradient(-45deg, var(--color-bad), ${iconObj?.color} 0.8rem)`
          : iconObj?.color,
      };
    },
    singleEntryClass(index) {
      return {
        "c-single-entry": true,
        "c-single-entry-highlight": this.mouseoverIndex === index,
      };
    },
    shouldShowEntry(entry) {
      return entry.data.isVisible || this.isRecent(entry.data.lastVisibleAt);
    },
    barSymbol(index) {
      return this.entries[index].icon?.symbol ?? null;
    },
    hasChildEntries(index) {
      return this.isRecent(this.hadChildEntriesAt[index]);
    },
    expandIcon(index) {
      return this.showGroup[index] ? "far fa-minus-square" : "far fa-plus-square";
    },
    expandIconStyle(index) {
      return {
        opacity: this.hasChildEntries(index) ? 1 : 0
      };
    },
    entryString(index) {
      const percents = this.percentList[index];
      if (percents < 0 && !nerfBlacklist.includes(this.entries[index].key)) {
        return this.nerfString(index);
      }

      // We want to handle very small numbers carefully to distinguish between "disabled/inactive" and
      // "too small to be relevant"
      let percString;
      if (percents === 0) percString = formatPercents(0);
      else if (percents === 1) percString = formatPercents(1);
      else if (percents < 0.001) percString = `<${formatPercents(0.001, 1)}`;
      else if (percents > 0.9995) percString = `~${formatPercents(1)}`;
      else percString = formatPercents(percents, 1);
      percString = padPercents(percString);

      // Display both multiplier and powers, but make sure to give an empty string if there's neither
      const entry = this.entries[index];
      if (!entry.data.isVisible) {
        return `${percString}: ${entry.name}`;
      }
      const overrideStr = entry.displayOverride;
      let valueStr;
      if (overrideStr) valueStr = `(${overrideStr})`;
      else {
        const values = [];
        const formatFn = x => {
          const isDilated = entry.isDilated;
          if (isDilated && this.dilationExponent !== 1) {
            const undilated = this.applyDilationExp(x, 1 / this.dilationExponent);
            return `${formatX(undilated, 2, 2)} ➜ ${formatX(x, 2, 2)}`;
          }
          return entry.isBase
            ? format(x, 2, 2)
            : formatX(x, 2, 2);
        };
        if (this.replacePowers && entry.data.pow !== 1) {
          // For replacing powers with equivalent multipliers, we calculate what the total additional multiplier
          // from ALL power effects taken together would be, and then we split up that additional multiplier
          // proportionally to this individual power's contribution to all positive powers
          const powFrac = Math.log(entry.data.pow) / Math.log(this.totalPositivePower);
          const equivMult = this.totalMultiplier.pow((this.totalPositivePower - 1) * powFrac);
          values.push(formatFn(entry.data.mult.times(equivMult)));
        } else {
          if (Decimal.neq(entry.data.mult, 1)) values.push(formatFn(entry.data.mult));
          if (entry.data.pow !== 1) values.push(formatPow(entry.data.pow, 2, 3));
        }
        valueStr = values.length === 0 ? "" : `(${values.join(", ")})`;
      }

      return `${percString}: ${entry.name} ${valueStr}`;
    },
    nerfString(index) {
      const entry = this.entries[index];
      const percString = padPercents(formatPercents(this.percentList[index], 1));

      // Display both multiplier and powers, but make sure to give an empty string if there's neither
      const overrideStr = entry.displayOverride;
      let valueStr;
      const formatFn = entry.isBase
        ? x => format(x, 2, 2)
        : x => `/${format(x.reciprocal(), 2, 2)}`;

      if (overrideStr) valueStr = `(${overrideStr})`;
      else {
        const values = [];
        if (this.replacePowers && entry.data.pow !== 1) {
          const finalMult = this.resource.fakeValue ?? this.resource.mult;
          values.push(formatFn(finalMult.pow(1 - 1 / entry.data.pow)));
        } else {
          if (Decimal.neq(entry.data.mult, 1)) {
            values.push(formatFn(entry.data.mult));
          }
          if (entry.data.pow !== 1) values.push(formatPow(entry.data.pow, 2, 3));
        }
        valueStr = values.length === 0 ? "" : `(${values.join(", ")})`;
      }

      return `${percString}: ${entry.name} ${valueStr}`;
    },
    totalString() {
      const resource = this.resource;
      const name = resource.name;
      const overrideStr = resource.displayOverride;
      if (overrideStr) return `${name}: ${overrideStr}`;

      const val = resource.mult;
      return resource.isBase
        ? `${name}: ${format(val, 2, 2)}`
        : `${name}: ${formatX(val, 2, 2)}`;
    },
    applyDilationExp(value, exp) {
      return Decimal.pow10(value.log10() ** exp);
    },
    dilationString() {
      const resource = this.resource;
      const baseMult = resource.mult;

      // This is tricky to handle properly; if we're not careful, sometimes the dilation gets applied twice since
      // it's already applied in the multiplier itself. In that case we need to apply an appropriate "anti-dilation"
      // to make the UI look correct. However, this cause some mismatches in individual dimension breakdowns due to
      // the dilation function not being linear (ie. multiply=>dilate gives a different result than dilate=>multiply).
      // In that case we check for isDilated one level down and combine the actual multipliers together instead.
      let beforeMult, afterMult;
      if (this.isDilated && resource.isDilated) {
        const dilProd = this.entries
          .filter(entry => entry.isVisible && entry.isDilated)
          .map(entry => entry.mult)
          .map(val => this.applyDilationExp(val, 1 / this.dilationExponent))
          .reduce((x, y) => x.times(y), DC.D1);
        beforeMult = dilProd.neq(1) ? dilProd : this.applyDilationExp(baseMult, 1 / this.dilationExponent);
        afterMult = resource.mult;
      } else {
        beforeMult = baseMult;
        afterMult = this.applyDilationExp(beforeMult, this.dilationExponent);
      }

      const formatFn = resource.isBase
        ? x => format(x, 2, 2)
        : x => formatX(x, 2, 2);
      return `Dilation Effect: Exponent${formatPow(this.dilationExponent, 2, 3)}
        (${formatFn(beforeMult, 2, 2)} ➜ ${formatFn(afterMult, 2, 2)})`;
    },
    isRecent(date) {
      return (this.now - date) < 200;
    }
  },
};
</script>

<template>
  <div :class="containerClass">
    <div
      v-if="!isEmpty"
      class="c-stacked-bars"
    >
      <div
        v-for="(perc, index) in averagedPercentList"
        :key="100 + index"
        :style="styleObject(index)"
        :class="{ 'c-bar-highlight' : mouseoverIndex === index }"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
        @click="showGroup[index] = !showGroup[index]"
      >
        <span
          class="c-bar-overlay"
          v-html="barSymbol(index)"
        />
      </div>
    </div>
    <div />
    <div class="c-info-list">
      <div class="c-total-mult">
        <b>
          {{ totalString() }}
        </b>
        <span class="c-display-settings">
          <PrimaryToggleButton
            v-if="hasSeenPowers && allowPowerToggle"
            v-model="replacePowers"
            v-tooltip="'Change Display for Power effects'"
            off="^N"
            on="×N"
            class="o-primary-btn c-change-display-btn"
          />
          <i
            v-if="groups.length > 1"
            v-tooltip="'Change Multiplier Grouping'"
            class="o-primary-btn c-change-display-btn fas fa-arrows-rotate"
            @click="changeGroup"
          />
        </span>
      </div>
      <div
        v-if="isEmpty"
        class="c-no-effect"
      >
        No Active Effects
        <br>
        <br>
        {{ disabledText }}
      </div>
      <div
        v-for="(entry, index) in entries"
        v-else
        :key="entry.key"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
      >
        <div
          v-if="shouldShowEntry(entry)"
          :class="singleEntryClass(index)"
        >
          <div @click="showGroup[index] = !showGroup[index]">
            <span
              :class="expandIcon(index)"
              :style="expandIconStyle(index)"
            />
            {{ entryString(index) }}
          </div>
          <MultiplierBreakdownEntry
            v-if="showGroup[index] && hasChildEntries(index)"
            :resource="entry"
          />
        </div>
      </div>
      <div v-if="isDilated && !isEmpty">
        <div class="c-single-entry c-dilation-entry">
          <div>
            {{ dilationString() }}
          </div>
        </div>
      </div>
      <div
        v-if="resource.key === 'AD_total'"
        class="c-no-effect"
      >
        <div>
          "Base AD Production" is the amount of Antimatter that you would be producing with your current AD upgrades
          as if you had waited a fixed amount of time ({{ formatInt(10) }}-{{ formatInt(40) }} seconds depending on
          your AD count) after a Sacrifice. This may misrepresent your actual production if your ADs have been
          producing for a while, but the relative mismatch will become smaller as you progress further in the game
          and numbers become larger.
        </div>
        <div v-if="inNC12">
          The breakdown in this tab within Normal Challenge 12 may be inaccurate for some entries, and might count
          extra multipliers which apply to all Antimatter Dimensions rather than just the ones which are displayed.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-multiplier-entry-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 100rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-text);
  padding: 0.5rem;
  font-weight: normal;
  background-color: var(--color-base);
}

.c-multiplier-entry-root-container {
  min-height: 45rem;
}

.c-stacked-bars {
  position: relative;
  width: 5rem;
  background-color: var(--color-disabled);
  margin-right: 1.5rem;
}

.c-bar-overlay {
  display: flex;
  width: 100%;
  height: 100%;
  top: -5%;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
  opacity: 0.8;
  z-index: 1;
}

.c-bar-highlight {
  animation: a-glow-bar 1s infinite;
}

@keyframes a-glow-bar {
  0% { box-shadow: inset 0 0 0.3rem 0; }
  50% {
    box-shadow: inset 0 0 0.6rem 0;
    filter: brightness(130%);
  }
  100% { box-shadow: inset 0 0 0.3rem 0; }
}

.c-info-list {
  height: 100%;
  width: 90%;
  padding: 0.2rem;
}

.c-display-settings {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 8rem;
}

.c-change-display-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  margin: 0 0.5rem;
}

.c-total-mult {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.c-no-effect {
  color: var(--color-text);
  user-select: none;
}

.c-single-entry {
  text-align: left;
  color: var(--color-text);
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border: 0.1rem dashed;
  cursor: pointer;
  user-select: none;
}

.c-single-entry-highlight {
  border: 0.1rem solid;
  font-weight: bold;
  animation: a-glow-text 1s infinite;
}

@keyframes a-glow-text {
  50% { background-color: var(--color-accent); }
}

.c-dilation-entry {
  border: 0.2rem solid;
  font-weight: bold;
  animation: a-glow-dilation-nerf 3s infinite;
}

@keyframes a-glow-dilation-nerf {
  50% { background-color: var(--color-bad); }
}
</style>
