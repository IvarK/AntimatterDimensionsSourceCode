"use strict";

Vue.component("v-tab", {
  data() {
    return {
      mainUnlock: false,
      totalUnlocks: 0,
      totalAdditionalStudies: 0,
      achievementsPerAdditionalStudy: 0,
      realities: 0,
      infinities: new Decimal(0),
      eternities: 0,
      dilatedTime: new Decimal(0),
      replicanti: new Decimal(0),
      rm: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.mainUnlock = V.has(V_UNLOCKS.MAIN_UNLOCK);
      this.totalUnlocks = V.totalRunUnlocks;
      this.totalAdditionalStudies = V.totalAdditionalStudies;
      this.achievementsPerAdditionalStudy = V.achievementsPerAdditionalStudy;
      this.realities = player.realities;
      this.infinities.copyFrom(player.infinitied);
      this.eternities = player.eternities;
      this.dilatedTime.copyFrom(player.dilation.dilatedTime);
      this.replicanti.copyFrom(player.replicanti.amount);
      this.rm.copyFrom(player.reality.realityMachines);
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
            <div v-if="hex.config" class="l-v-hexagon c-v-unlock" :class="{ 'c-v-unlock-completed': hex.completions == 6 }">
              <h2>{{ hex.config.name }}</h2>
              <p class="o-v-unlock-desc">{{ hex.formattedDescription }}</p>
              <p class="o-v-unlock-amount">{{ hex.completions }}/{{hex.config.values.length}} done</p>
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
          You have {{ totalUnlocks }} V-achievements done. You can pick
          {{ totalAdditionalStudies }} {{ "study" | pluralize(totalAdditionalStudies, "studies") }}
          on other paths you normally can't buy.
        </div>
        <div>(You get one additional study per {{ achievementsPerAdditionalStudy }} V-achievements, rounded down.)</div>
        <br>
        <div class="l-v-milestones-container">
          <div class="o-v-milestone" v-for="milestone in runMilestones" :class="{'o-v-milestone-unlocked': has(milestone)}">
            <p>{{ milestone.description }}</p>
            <p>Reward: {{ milestone.reward }}</p>
            <p v-if="milestone.effect">Currently: <b>{{ milestone.format(milestone.effect()) }}</b></p>
          </div>
        </div>
      </div>
    </div>`
});
