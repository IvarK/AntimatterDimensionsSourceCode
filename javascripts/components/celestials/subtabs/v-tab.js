Vue.component('v-tab', {
  data: function() {
    return {
      db: GameDatabase.Celestials.V,
      mainUnlock: false,
      runUnlocks: VRunUnlockState.all,
      totalUnlocks: V.totalRunUnlocks
    };
  },
  methods: {
    update() {
      this.mainUnlock = V.has(V_UNLOCKS.MAIN_UNLOCK)
      this.totalUnlocks = V.totalRunUnlocks
    },
    startRun() {
      V.startRun()
    }
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
        <div>You have {{ totalUnlocks }} V-achievements done. You can pick {{ Math.floor(totalUnlocks/3) }} studies from locked paths.</div>
        <br>
        <div>Here be some shop using those V-achievements</div>
      </div>
    </div>`
});