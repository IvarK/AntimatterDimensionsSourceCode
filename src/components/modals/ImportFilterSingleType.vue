<script>
export default {
  name: "ImportFilterSingleType",
  props: {
    type: {
      type: String,
      required: true,
    },
    currSettings: {
      type: Object,
      required: true,
    },
    newSettings: {
      type: Object,
      required: true,
    }
  },
  computed: {
    settingsChanged() {
      return JSON.stringify(this.currSettings) !== JSON.stringify(this.newSettings);
    },
    symbol() {
      return GLYPH_SYMBOLS[this.type];
    },
    capitalized() {
      return `${this.type.charAt(0).toUpperCase()}${this.type.substring(1)}`;
    },
    rarityStr() {
      return this.changedValue(this.currSettings.rarity, this.newSettings.rarity, x => formatPercents(x / 100));
    },
    effectStr() {
      return this.changedValue(this.currSettings.effectCount, this.newSettings.effectCount, formatInt);
    },
    scoreStr() {
      return this.changedValue(this.currSettings.score, this.newSettings.score, formatInt);
    },
    effectData() {
      const changes = [];
      for (let index = 0; index < this.currSettings.effectScores.length; index++) {
        const bitmaskIndex = AutoGlyphProcessor.bitmaskIndexOffset(this.type) + index;
        changes.push({
          bitmaskIndex,
          oldReq: (this.currSettings.specifiedMask & (1 << bitmaskIndex)) !== 0,
          newReq: (this.newSettings.specifiedMask & (1 << bitmaskIndex)) !== 0,
          oldScore: this.currSettings.effectScores[index],
          newScore: this.newSettings.effectScores[index],
        });
      }
      return changes;
    }
  },
  methods: {
    changedValue(oldVal, newVal, applyFn) {
      if (oldVal === newVal) return applyFn(oldVal);
      return `${applyFn(oldVal)}➜${applyFn(newVal)}`;
    },
    effectBox(effectEntry) {
      if (effectEntry.oldReq && effectEntry.newReq) return "☑";
      if (!effectEntry.oldReq && effectEntry.newReq) return "⊕";
      if (effectEntry.oldReq && !effectEntry.newReq) return "⊖";
      return "☒";
    },
    effectScoreStr(effectEntry) {
      return this.changedValue(effectEntry.oldScore, effectEntry.newScore, formatInt);
    },
    topLevelClassObject(key) {
      return {
        "o-cell": true,
        "o-cell--changed": this.currSettings[key] !== this.newSettings[key],
      };
    },
    effectClassObject(effectEntry) {
      return {
        "o-cell": true,
        "o-cell--changed": effectEntry.oldReq !== effectEntry.newReq || effectEntry.oldScore !== effectEntry.newScore,
      };
    }
  },
};
</script>

<template>
  <div>
    {{ symbol }}:
    <span v-if="settingsChanged">
      <span class="c-single-row">
        <span
          class="c-rarity"
          :class="topLevelClassObject('rarity')"
        >
          {{ rarityStr }}
        </span>
        <span
          class="c-effects-count"
          :class="topLevelClassObject('effectCount')"
        >
          Specified Effects: {{ effectStr }}
        </span>
        <span
          class="c-target-score"
          :class="topLevelClassObject('score')"
        >
          Score: {{ scoreStr }}
        </span>
      </span>
      <br>
      <span class="c-single-row">
        <span
          v-for="effect in effectData.slice(0, 4)"
          :key="effect.bitmaskIndex"
          class="c-single-score"
          :class="effectClassObject(effect)"
        >
          {{ effectBox(effect) }} {{ effectScoreStr(effect) }}
        </span>
      </span>
      <br>
      <span
        v-if="effectData.length > 4"
        class="c-single-row"
      >
        <span
          v-for="effect in effectData.slice(4)"
          :key="effect.bitmaskIndex"
          class="c-single-score o-cell"
          :class="effectClassObject(effect)"
        >
          {{ effectBox(effect) }} {{ effectScoreStr(effect) }}
        </span>
      </span>
    </span>
    <span v-else>
      (No changes)
    </span>
  </div>
</template>

<style scoped>
.c-single-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -2rem 0 0 3rem;
}

.o-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  border: var(--var-border-width, 0.2rem) solid;
  padding: 0.1rem;
}

.o-cell--changed {
  background-color: var(--color-good);
}

.c-rarity {
  width: 8rem;
}

.c-effects-count {
  width: 22rem;
}

.c-target-score {
  width: 15rem;
}

.c-single-score {
  width: 10rem;
}
</style>
