import "../celestial-quote-history.js";
import PrimaryButton from "@/components/PrimaryButton";
import GlyphSetPreview from "@/components/GlyphSetPreview";

Vue.component("v-tab", {
  components: {
    PrimaryButton,
    GlyphSetPreview
  },
  data() {
    return {
      isDoomed: false,
      mainUnlock: false,
      canUnlockCelestial: false,
      mainUnlockDB: [],
      totalUnlocks: 0,
      pp: 0,
      showReduction: false,
      runRecords: [],
      runGlyphs: [],
      isFlipped: false,
      wantsFlipped: true,
      isRunning: false,
      hasAlchemy: false,
    };
  },
  computed: {
    celestialUnlockClassObject() {
      return {
        "o-v-milestone": true,
        "o-v-milestone--unlocked": this.canUnlockCelestial,
      };
    },
    // If V is flipped, change the layout of the grid
    hexGrid() {
      return this.isFlipped && this.wantsFlipped
        ? [
          VRunUnlocks.all[6],
          {},
          {},
          {},
          { isRunButton: true },
          VRunUnlocks.all[7],
          VRunUnlocks.all[8],
          {},
          {}
        ]
        : [
          VRunUnlocks.all[0],
          VRunUnlocks.all[1],
          {},
          VRunUnlocks.all[5],
          { isRunButton: true },
          VRunUnlocks.all[2],
          VRunUnlocks.all[4],
          VRunUnlocks.all[3],
          {}
        ];
    },
    vUnlock: () => V_UNLOCKS.V_ACHIEVEMENT_UNLOCK,
    runMilestones() {
      return [
        [
          V_UNLOCKS.SHARD_REDUCTION,
          V_UNLOCKS.ND_POW,
          V_UNLOCKS.FAST_AUTO_EC
        ],
        [
          V_UNLOCKS.AUTO_AUTOCLEAN,
          V_UNLOCKS.ACHIEVEMENT_BH,
          V_UNLOCKS.RA_UNLOCK
        ],
      ];
    },
    runButtonClassObject() {
      return {
        "l-v-hexagon": true,
        "c-v-run-button": true,
        "c-v-run-button--running": this.isRunning,
      };
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[3].description().replace(/^\w/u, c => c.toUpperCase());
    },
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.mainUnlock = V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK);
      this.canUnlockCelestial = V.canUnlockCelestial;
      this.mainUnlockDB = GameDatabase.celestials.v.mainUnlock;
      this.totalUnlocks = V.spaceTheorems;
      this.pp = Currency.perkPoints.value;
      this.showReduction = V.has(V_UNLOCKS.SHARD_REDUCTION);
      this.runRecords = Array.from(player.celestials.v.runRecords);
      this.runGlyphs = player.celestials.v.runGlyphs.map(gList => Glyphs.copyForRecords(gList));
      this.isFlipped = V.isFlipped;
      this.wantsFlipped = player.celestials.v.wantsFlipped;
      this.isRunning = V.isRunning;
      this.hasAlchemy = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
    },
    unlockCelestial() {
      if (V.canUnlockCelestial) V.unlockCelestial();
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "V's", number: 3 });
    },
    has(info) {
      return V.has(info);
    },
    mode(hex) {
      return hex.config.mode === V_REDUCTION_MODE.SUBTRACTION ? "reduced" : "divided";
    },
    reductionValue(hex) {
      return hex.config.mode === V_REDUCTION_MODE.SUBTRACTION
        ? formatInt(hex.reduction)
        : format(Decimal.pow10(hex.reduction));
    },
    showRecord(hex) {
      return this.runRecords[hex.id] > 0 || hex.completions > 0;
    },
    rewardText(milestone) {
      return typeof milestone.reward === "function"
        ? milestone.reward()
        : milestone.reward;
    },
    reduceGoals(hex) {
      if (!Currency.perkPoints.purchase(hex.reductionCost)) return;
      const steps = hex.config.reductionStepSize ? hex.config.reductionStepSize : 1;
      player.celestials.v.goalReductionSteps[hex.id] += steps;
      for (const unlock of VRunUnlocks.all) {
        unlock.tryComplete();
      }
      V.checkForUnlocks();
    },
    reductionTooltip(hex) {
      return `Spend ${quantify("Perk Point", hex.reductionCost, 2, 0)}
        to reduce goal by ${format(hex.config.perReductionStep)}`;
    },
    toggleFlipped() {
      player.celestials.v.wantsFlipped = !this.wantsFlipped;
    }
  },
  template: `
    <div class="l-v-celestial-tab">
      <celestial-quote-history celestial="v" />
      <div v-if="!mainUnlock" class="c-v-info-text">
        <v-unlock-requirement
          v-for="req in mainUnlockDB"
          :dbEntry="req"
          :key="req.name"
        />
        <div class="l-v-milestones-grid__row">
          <div
            :class="celestialUnlockClassObject"
            @click="unlockCelestial"
          >
            <p>{{ vUnlock.description }}</p>
            <p>{{ rewardText(vUnlock) }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="isFlipped" class="c-v-info-text">
          <PrimaryButton
            class="o-primary-btn--subtab-option"
            @click="toggleFlipped"
          >
            <span v-if="wantsFlipped">Hide</span>
            <span v-else>Show</span>
            Hard V
          </PrimaryButton>
          <br><br>
          Cursed Glyphs can be created in the Effarig tab<span v-if="!isDoomed">, and the
          Black Hole can now be used to slow down time</span>.
          <br>
          Each Hard V-Achievement counts as two V-achievements and will award {{ formatInt(2) }} Space Theorems
          instead of {{ formatInt(1) }}.
          <br>
          Goal reduction is significantly more expensive for Hard V-Achievements.
        </div>
        <div v-if="showReduction" class="c-v-info-text">
          You have {{ quantify("Perk Point", pp, 2, 0) }}.
        </div>
        <div class="l-v-unlocks-container">
          <li v-for="hex in hexGrid" :style= "[hex.isRunButton ? {zIndex: 1} : {zIndex: 0}]">
            <div v-if="hex.config"
              class="l-v-hexagon c-v-unlock"
              :class="{ 'c-v-unlock-completed': hex.completions === hex.config.values.length }"
            >
              <p class="o-v-unlock-name"><br v-if="hex.canBeReduced && showReduction">{{ hex.config.name }}</p>
              <p class="o-v-unlock-desc" v-html="hex.formattedDescription"></p>
              <p class="o-v-unlock-goal-reduction" v-if="has(runMilestones[0]) && hex.isReduced">
                Goal has been {{ mode(hex) }} by {{ reductionValue(hex) }}
              </p>
              <p class="o-v-unlock-amount">
                {{ formatInt(hex.completions) }}/{{ formatInt(hex.config.values.length) }} done
              </p>
              <div v-if="showRecord(hex)">
                <p class="o-v-unlock-record">
                  Best: {{ hex.config.formatRecord(runRecords[hex.id]) }}
                </p>
                <p>
                  <GlyphSetPreview
                    :glyphs="runGlyphs[hex.id]"
                    :text="hex.config.name"
                    :textHidden="true"
                  />
                </p>
                <div v-if="hex.canBeReduced && showReduction">
                  <div style="height:0.8rem;" />
                  <button
                    class="o-primary-btn l-v-reduction"
                    :class="{ 'o-primary-btn--disabled': !hex.canBeReduced || pp < hex.reductionCost }"
                    :ach-tooltip="reductionTooltip(hex)"
                    @click="reduceGoals(hex)"
                  >
                    <i class="fas fa-angle-double-down"></i>
                  </button>
                </div>
              </div>
            </div>
            <div v-else-if="hex.isRunButton" @click="startRun()" :class="runButtonClassObject">
              <b style="font-size: 1.5rem">
                <span v-if="isRunning">You are in </span>
                <span v-if="isDoomed">You can't start<br></span>
                <span v-else>Start </span>
                V's Reality.
              </b>
              <br>
              <div :style="{ 'font-size': hasAlchemy ? '1.1rem' : '' }">
                {{ runDescription }}
                <span v-if="hasAlchemy">
                  Exponential Glyph Alchemy effect is disabled.
                </span>
              </div>
              <div class="c-v-run-button__line c-v-run-button__line--1"></div>
              <div class="c-v-run-button__line c-v-run-button__line--2"></div>
              <div class="c-v-run-button__line c-v-run-button__line--3"></div>
            </div>
            <div v-else>
              <div style="opacity: 0" class="l-v-hexagon"></div>
            </div>
          </li>
        </div>
        <div class="c-v-info-text">
          V-Achievements can only be completed within V's Reality, but are permanent and do not reset upon leaving
          and re-entering the Reality.
        </div>
        <div class="c-v-info-text">
          You have {{ formatInt(totalUnlocks) }} V-Achievements done.
          You gain {{ formatInt(1) }} Space Theorem for each completion,
          allowing you to purchase Time Studies which are normally locked.
        </div>
        <br>
        <div class="l-v-milestones-grid">
          <div v-for="row in runMilestones" class="l-v-milestones-grid__row">
            <div class="o-v-milestone"
              v-for="milestone in row"
              :class="{'o-v-milestone--unlocked':
              has(milestone)}"
            >
              <p>{{ milestone.description }}</p>
              <p>Reward: {{ rewardText(milestone) }}</p>
              <p v-if="milestone.effect">Currently: <b>{{ milestone.format(milestone.effect()) }}</b></p>
            </div>
          </div>
        </div>
      </div>
    </div>`
});

Vue.component("v-unlock-requirement", {
  props: {
    dbEntry: Object,
  },
  data() {
    return {
      resource: new Decimal(0),
      progress: 0,
    };
  },
  computed: {
    barProgressStyle() {
      const color = this.progress === 1
        ? "var(--color-v--base)"
        : "#6b5f2e";
      return {
        background: color,
        width: `${100 * this.progress}%`
      };
    },
    textStyle() {
      return {
        color: this.progress === 1
          ? "black"
          : "var(--color-text)",
        "border-color": "var(--color-text)",
      };
    },
  },
  methods: {
    update() {
      this.resource.copyFrom(new Decimal(this.dbEntry.resource()));
      this.progress = Math.clampMax(this.dbEntry.progress(), 1);
    }
  },
  template: `
    <div class="c-v-unlock-bar" :style="textStyle">
      <div class="c-v-unlock-bar__progress" :style="barProgressStyle" />
      {{ dbEntry.format(resource) }} / {{ dbEntry.format(dbEntry.requirement) }} {{ dbEntry.name }}
    </div>`
});
