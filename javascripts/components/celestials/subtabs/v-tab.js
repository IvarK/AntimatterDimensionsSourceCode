"use strict";

Vue.component("v-tab", {
  data() {
    return {
      mainUnlock: false,
      totalUnlocks: 0,
      achievementsPerAdditionalStudy: 0,
      realities: 0,
      infinities: new Decimal(0),
      eternities: new Decimal(0),
      dilatedTime: new Decimal(0),
      replicanti: new Decimal(0),
      rm: new Decimal(0),
      runRecords: Array.from(player.celestials.v.runRecords),
      runGlyphs: player.celestials.v.runGlyphs.map(g => this.copyGlyphs(g)),
    };
  },
  methods: {
    update() {
      this.mainUnlock = V.has(V_UNLOCKS.MAIN_UNLOCK);
      this.totalUnlocks = V.totalRunUnlocks;
      this.achievementsPerAdditionalStudy = V.achievementsPerAdditionalStudy;
      this.realities = player.realities;
      this.infinities.copyFrom(player.infinitied);
      this.eternities.copyFrom(player.eternities);
      this.dilatedTime.copyFrom(player.dilation.dilatedTime);
      this.replicanti.copyFrom(player.replicanti.amount);
      this.rm.copyFrom(player.reality.realityMachines);
      this.runRecords = Array.from(player.celestials.v.runRecords);
      this.runGlyphs = player.celestials.v.runGlyphs.map(g => this.copyGlyphs(g));
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
    }
  },
  computed: {
    hexGrid: () => [
      VRunUnlocks.all[0],
      VRunUnlocks.all[1],
      {},
      VRunUnlocks.all[2],
      { isRunButton: true },
      VRunUnlocks.all[3],
      VRunUnlocks.all[4],
      VRunUnlocks.all[5],
      {}
    ],
    runMilestones: () => V_UNLOCKS.RUN_UNLOCK_THRESHOLDS,
    db: () => GameDatabase.celestials.v,
  },
  template:
    `<div class="l-v-celestial-tab">
      <div v-if="!mainUnlock">
        You need {{ shorten(db.mainUnlock.realities, 2, 0) }} realities (currently {{ shorten(realities, 2, 0) }}),<br>
        {{ shorten(db.mainUnlock.eternities, 2, 0) }} eternities (currently {{ shorten(eternities, 2, 0) }}),<br>
        {{ shorten(db.mainUnlock.infinities, 2, 0) }} infinities (currently {{ shorten(infinities, 2, 0) }}),<br>
        {{ shorten(db.mainUnlock.dilatedTime, 2, 0) }} dilated time (currently {{ shorten(dilatedTime, 2, 0) }}),<br>
        {{ shorten(db.mainUnlock.replicanti, 2, 0) }} replicanti (currently {{ shorten(replicanti, 2, 0) }}),<br>
        and {{ shorten(db.mainUnlock.rm, 2, 0) }} RM (currently {{ shorten(rm, 2, 0) }})
        to unlock V, The Celestial of Achievements
      </div>
      <div v-else>
        <div class="l-v-unlocks-container">
          <li v-for="hex in hexGrid">
            <div v-if="hex.config"
              class="l-v-hexagon c-v-unlock"
              :class="{ 'c-v-unlock-completed': hex.completions == 6 }">
                <p class="o-v-unlock-name">{{ hex.config.name }}</p>
                <p class="o-v-unlock-desc">{{ hex.formattedDescription }}</p>
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
          You have {{ shortenSmallInteger(totalUnlocks) }} V-achievements done. 
          You gain 1 Space Theorem for each completion.
        </div>
        <div>
          (You get one additional study per {{ shortenSmallInteger(achievementsPerAdditionalStudy) }}
          V-achievements, rounded down.)
        </div>
        <br>
        <div class="l-v-milestones-container">
          <div class="o-v-milestone"
            v-for="milestone in runMilestones"
            :class="{'o-v-milestone-unlocked':
            has(milestone)}">
              <p>{{ milestone.description }}</p>
              <p>Reward: {{ milestone.reward }}</p>
              <p v-if="milestone.effect">Currently: <b>{{ milestone.format(milestone.effect()) }}</b></p>
          </div>
        </div>
      </div>
    </div>`
});
