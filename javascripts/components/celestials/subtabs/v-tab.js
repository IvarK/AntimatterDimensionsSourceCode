"use strict";

Vue.component("v-tab", {
  data() {
    return {
      mainUnlock: false,
      totalUnlocks: 0,
      realities: 0,
      infinities: new Decimal(0),
      eternities: new Decimal(0),
      dilatedTime: new Decimal(0),
      replicanti: new Decimal(0),
      rm: new Decimal(0),
      runRecords: Array.from(player.celestials.v.runRecords),
      runGlyphs: player.celestials.v.runGlyphs.map(g => this.copyGlyphs(g)),
      isFlipped: false
    };
  },
  methods: {
    update() {
      this.mainUnlock = V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK);
      this.totalUnlocks = V.spaceTheorems;
      this.realities = player.realities;
      this.infinities.copyFrom(player.infinitied);
      this.eternities.copyFrom(player.eternities);
      this.dilatedTime.copyFrom(player.dilation.dilatedTime);
      this.replicanti.copyFrom(player.replicanti.amount);
      this.rm.copyFrom(player.reality.realityMachines);
      this.runRecords = Array.from(player.celestials.v.runRecords);
      this.runGlyphs = player.celestials.v.runGlyphs.map(g => this.copyGlyphs(g));
      this.isFlipped = V.isFlipped;
    },
    copyGlyphs(glyphList) {
      return glyphList.map(g => ({
        type: g.type,
        level: g.level,
        strength: g.strength,
        effects: g.effects,
      }));
    },
    startRun() {
      V.startRun();
    },
    has(info) {
      return V.has(info);
    },
    mode(hex) {
      return hex.config.mode === V_REDUCTION_MODE.SUBTRACTION ? "reduced" : "divided";
    },
    rewardText(milestone) {
      return typeof milestone.reward === "function"
        ? milestone.reward()
        : milestone.reward;
    },
  },
  computed: {
    // If V is flipped, change the layout of the grid
    hexGrid() {
      return this.isFlipped ? [
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
        VRunUnlocks.all[2],
        { isRunButton: true },
        VRunUnlocks.all[3],
        VRunUnlocks.all[4],
        VRunUnlocks.all[5],
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
          V_UNLOCKS.TRIAD_STUDIES,
          V_UNLOCKS.ACHIEVEMENT_BH,
          V_UNLOCKS.RA_UNLOCK
        ],
      ]
    },
    db: () => GameDatabase.celestials.v,
  },
  template:
    `<div class="l-v-celestial-tab">
      <div v-if="!mainUnlock">
        {{ format(rm, 2, 0) }} / {{ format(db.mainUnlock.rm, 2, 0) }} RM
        <br>
        {{ format(realities, 2, 0) }} / {{ format(db.mainUnlock.realities, 2, 0) }} realities
        <br>
        {{ format(eternities, 2, 0) }} / {{ format(db.mainUnlock.eternities, 2, 0) }} eternities
        <br>
        {{ format(infinities, 2, 0) }} / {{ format(db.mainUnlock.infinities, 2, 0) }} infinities
        <br>
        {{ format(dilatedTime, 2, 0) }} / {{ format(db.mainUnlock.dilatedTime, 2, 0) }} dilated time
        <br>
        {{ format(replicanti, 2, 0) }} / {{ format(db.mainUnlock.replicanti, 2, 0) }} replicanti
        <br>
        <div class="l-v-milestones-grid__row">
          <div class="o-v-milestone">
            <p>{{ vUnlock.description }}</p>
            <p>Reward: {{ rewardText(vUnlock) }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="l-v-unlocks-container">
          <li v-for="hex in hexGrid">
            <div v-if="hex.config"
              class="l-v-hexagon c-v-unlock"
              :class="{ 'c-v-unlock-completed': hex.completions == 6 }">
                <p class="o-v-unlock-name">{{ hex.config.name }}</p>
                <p class="o-v-unlock-desc">{{ hex.formattedDescription }}</p>
                <p class="o-v-unlock-goal-reduction" v-if="has(runMilestones[0]) && hex.isReduced">
                  Goal has been {{ mode(hex) }} by {{ format(hex.reduction, 2, 0) }} {{ hex.reductionInfo }}
                </p>
                <p class="o-v-unlock-amount">{{ hex.completions }}/{{hex.config.values.length}} done</p>
                <p class="o-v-unlock-record">
                  Best: {{ hex.config.formatRecord(runRecords[hex.id]) }}
                </p>
                <p v-if="runRecords[hex.id] > 0">
                  <glyph-component v-for="(g, idx) in runGlyphs[hex.id]"
                         :key="idx"
                         style="margin: 0.2rem;"
                         :glyph="g"
                         :showSacrifice="false"
                         :draggable="false"
                         :circular="true"
                         size="2.8rem"
                         :textProportion="0.6"
                         glowBlur="0.2rem"
                         glowSpread="0.1rem" />
                </p>
            </div>
            <div v-else-if="hex.isRunButton" @click="startRun()" class="l-v-hexagon o-v-run-button">
              <p>
              Start V's Reality.<br/>All dimension multipliers, EP gain, IP gain, and dilated time gain per second
              are square-rooted, and Replicanti interval is squared.
              </p>
            </div>
            <div v-else>
              <div style="opacity: 0" class="l-v-hexagon"></div>
            </div>
          </li>
        </div>
        <div>
          V-achievements can only be completed within V's reality, but are permanent and do not reset upon leaving
          and re-entering the reality.
        </div>
        <div>
          You have {{ formatInt(totalUnlocks) }} V-achievements done.
          You gain 1 Space Theorem for each completion.
        </div>
        <br>
        <div class="l-v-milestones-grid">
          <div v-for="row in runMilestones" class="l-v-milestones-grid__row">
            <div class="o-v-milestone"
              v-for="milestone in row"
              :class="{'o-v-milestone-unlocked':
              has(milestone)}">
                <p>{{ milestone.description }}</p>
                <p>Reward: {{ rewardText(milestone) }}</p>
                <p v-if="milestone.effect">Currently: <b>{{ milestone.format(milestone.effect()) }}</b></p>
            </div>
          </div>
        </div>
      </div>
    </div>`
});
