"use strict";

Vue.component('v-tab', {
  data: function() {
    return {
      mainUnlock: false,
      totalUnlocks: 0,
      totalAdditionalStudies: 0
    };
  },
  methods: {
    update() {
      this.mainUnlock = V.has(V_UNLOCKS.MAIN_UNLOCK)
      this.totalUnlocks = V.totalRunUnlocks
      this.totalAdditionalStudies = V.totalAdditionalStudies
    },
    startRun() {
      V.startRun()
    },
    has(info) {
      return V.has(info)
    }
  },
  computed: {
    runUnlocks: () => VRunUnlockState.all,
    runMilestones: () => V_UNLOCKS.RUN_UNLOCK_THRESHOLDS,
    db: () => GameDatabase.celestials.v,
  },
  template:
    `<div class="l-v-celestial-tab">
      <div v-if="!mainUnlock">
        You need {{ shorten(db.mainUnlock.realities) }} realities,<br>
        {{ shorten(db.mainUnlock.eternities) }} eternities,<br>
        {{ shorten(db.mainUnlock.infinities) }} infinities,<br>
        {{ shorten(db.mainUnlock.dilatedTime) }} dilated time<br>
        and {{ shorten(db.mainUnlock.replicanti) }} replicanti to unlock V, The Celestial of Achievements
      </div>
      <div v-else>
        <button @click="startRun()" class="o-v-run-button">Start V's Reality, All dimension production, EP gain, IP gain, dilated time gain and Replicanti gain are nerfed.</button>
        <div class="l-v-unlocks-container">
          <div v-for="unlock in runUnlocks" class="c-v-unlock" :class="{ 'c-v-unlock-completed': unlock.completions == 6 }">
            <h2>{{ unlock.config.name }}</h2>
            <p class="o-v-unlock-desc">{{ unlock.formattedDescription }}</p>
            <p class="o-v-unlock-amount">{{ unlock.completions }}/{{unlock.config.values.length}} done</p>
          </div>
        </div>
        <div>You have {{ totalUnlocks }} V-achievements done. You can pick {{ totalAdditionalStudies }} {{ "study" | pluralize(totalAdditionalStudies, "studies") }} from locked paths.</div>
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
