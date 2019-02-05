Vue.component('v-tab', {
  data: function() {
    return {
      db: GameDatabase.Celestials.V,
      mainUnlock: false
    };
  },
  methods: {
    update() {
      this.mainUnlock = V.has(V_UNLOCKS.MAIN_UNLOCK)
    },
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
        You have unlocked V lol gj
      </div>
    </div>`
});