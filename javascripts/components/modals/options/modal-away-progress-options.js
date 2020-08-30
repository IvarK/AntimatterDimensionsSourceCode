"use strict";

Vue.component("modal-away-progress-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      replicantiUnlocked: false,
      dilationUnlocked: false,
      raUnlocked: false,
      laitelaUnlocked: false,
      blackHoleUnlocked: false,
      antimatter: false,
      infinityPoints: false,
      eternityPoints: false,
      realityMachines: false,
      dilatedTime: false,
      infinities: false,
      eternities: false,
      realities: false,
      singularities: false,
      darkMatter: false,
      replicanti: false,
      replicantiGalaxies: false,
      celestialMemories: false,
      blackHole: false
    };
  },
  watch: {
    antimatter(newValue) {
      player.options.awayProgress.antimatter = newValue;
    },
    infinityPoints(newValue) {
      player.options.awayProgress.infinityPoints = newValue;
    },
    eternityPoints(newValue) {
      player.options.awayProgress.eternityPoints = newValue;
    },
    realityMachines(newValue) {
      player.options.awayProgress.realityMachines = newValue;
    },
    dilatedTime(newValue) {
      player.options.awayProgress.dilatedTime = newValue;
    },
    infinities(newValue) {
      player.options.awayProgress.infinities = newValue;
    },
    eternities(newValue) {
      player.options.awayProgress.eternities = newValue;
    },
    realities(newValue) {
      player.options.awayProgress.realities = newValue;
    },
    singularities(newValue) {
      player.options.awayProgress.singularities = newValue;
    },
    darkMatter(newValue) {
      player.options.awayProgress.darkMatter = newValue;
    },
    replicanti(newValue) {
      player.options.awayProgress.replicanti = newValue;
    },
    replicantiGalaxies(newValue) {
      player.options.awayProgress.replicantiGalaxies = newValue;
    },
    celestialMemories(newValue) {
      player.options.awayProgress.celestialMemories = newValue;
    },
    blackHole(newValue) {
      player.options.awayProgress.blackHole = newValue;
    },
  },
  methods: {
    update() {
      this.replicantiUnlocked = PlayerProgress.replicantiUnlocked() || PlayerProgress.realityUnlocked || PlayerProgress.eternityUnlocked;
      this.dilationUnlocked = PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked;
      this.raUnlocked = V.has(V_UNLOCKS.RA_UNLOCK);
      this.laitelaUnlocked = Ra.has(RA_UNLOCKS.RA_LAITELA_UNLOCK);
      this.blackHoleUnlocked = BlackHoles.list[0].isUnlocked;

      const options = player.options.awayProgress;
      this.antimatter = options.antimatter;
      this.infinityPoints = options.infinityPoints;
      this.eternityPoints = options.eternityPoints;
      this.realityMachines = options.realityMachines;
      this.dilatedTime = options.dilatedTime;
      this.infinities = options.infinities;
      this.eternities = options.eternities;
      this.realities = options.realities;
      this.singularities = options.singularities;
      this.darkMatter = options.darkMatter;
      this.replicanti = options.replicanti;
      this.replicantiGalaxies = options.replicantiGalaxies;
      this.celestialMemories = options.celestialMemories;
      this.blackHole = options.blackHole;
    }
  },
  template:
    `<modal-options @close="emitClose" style="width: 50rem">
      <div>
        <wide-on-off-button v-model="antimatter" text="Antimatter:"/>
        <wide-on-off-button v-if="infinityUnlocked" v-model="infinityPoints" text="Infinity Points:"/>
        <wide-on-off-button v-if="eternityUnlocked" v-model="eternityPoints" text="Eternity Points:"/>
        <wide-on-off-button v-if="realityUnlocked" v-model="realityMachines" text="Reality Machines:"/>
        <wide-on-off-button v-if="dilationUnlocked" v-model="dilatedTime" text="Dilated Time:"/>
        <wide-on-off-button v-if="infinityUnlocked" v-model="infinities" text="Infinities:"/>
        <wide-on-off-button v-if="eternityUnlocked" v-model="eternities" text="Eternities:"/>
        <wide-on-off-button v-if="realityUnlocked" v-model="realities" text="Realities:"/>
        <wide-on-off-button v-if="laitelaUnlocked" v-model="singularities" text="Singularities:"/>
        <wide-on-off-button v-if="laitelaUnlocked" v-model="darkMatter" text="Dark Matter:"/>
        <wide-on-off-button v-if="replicantiUnlocked" v-model="replicanti" text="Replicanti:"/>
        <wide-on-off-button v-if="replicantiUnlocked" v-model="replicantiGalaxies" text="Replicanti Galaxies:"/>
        <wide-on-off-button v-if="raUnlocked" v-model="celestialMemories" text="Celestial Memories:"/>
        <wide-on-off-button v-if="blackHoleUnlocked" v-model="blackHole" text="Black Hole:"/>
      </div>
    Note: Selected resources will only show if they've increased.
    </modal-options>`
});
