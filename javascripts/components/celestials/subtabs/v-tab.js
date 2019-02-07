Vue.component('v-tab', {
  data: function() {
    return {
      db: GameDatabase.Celestials.V,
      mainUnlock: false,
      runUnlocks: VRunUnlockState.all
    };
  },
  methods: {
    update() {
      this.mainUnlock = V.has(V_UNLOCKS.MAIN_UNLOCK)
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
        <button @click="startRun()">Start V's Reality, All dimension production, EP gain, IP gain, dilated time gain and Replicanti gain are nerfed.</button>
        <div v-for="unlock in runUnlocks">
          <h1>{{ unlock.config.name }}</h1>
          <p>{{ unlock.formattedDescription }}</p>
          <p>{{ unlock.completions }}/{{unlock.config.values.length}} done</p>
        </div>
      </div>
    </div>`
});