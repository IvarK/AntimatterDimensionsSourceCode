"use strict";

Vue.component("modal-away-progress", {
  props: {
    modalConfig: Object
  },
  data() {
    return {
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
  computed: {
    before() {
      return this.modalConfig.playerBefore;
    },
    after() {
      return this.modalConfig.playerAfter;
    },
    // eslint-disable-next-line complexity
    headerText() {
      const before = this.before;
      const after = this.after;
      if ((!after.antimatter.gt(before.antimatter) || !this.antimatter) &&
          (!after.infinityPoints.gt(before.infinityPoints) || !this.infinityPoints) &&
          (!after.eternityPoints.gt(before.eternityPoints) || !this.eternityPoints) &&
          (!after.reality.realityMachines.gt(before.reality.realityMachines) || !this.realityMachines) &&
          (!after.dilation.dilatedTime.gt(before.dilation.dilatedTime) || !this.dilatedTime) &&
          (!after.infinitied.gt(before.infinitied) || !this.infinities) &&
          (!after.eternities.gt(before.eternities) || !this.eternities) &&
          (after.realities <= before.realities || !this.realities) &&
          (after.celestials.laitela.singularities <= before.celestials.laitela.singularities || !this.singularities) &&
          (!after.celestials.laitela.matter.gt(before.celestials.laitela.matter) || !this.darkMatter) &&
          (!after.replicanti.amount.gt(before.replicanti.amount) || !this.replicanti) &&
          (after.replicanti.galaxies <= before.replicanti.galaxies || !this.replicantiGalaxies) &&
          !this.celestialMemoriesShown &&
          !this.blackHoleShown
         ) {
        SecretAchievement(36).unlock();
        return `While you were away for ${TimeSpan.fromSeconds(this.modalConfig.seconds).toString()}...
          Nothing happened.`;
      }
      return `While you were away for ${TimeSpan.fromSeconds(this.modalConfig.seconds).toString()}: `;
    },
    celestialMemoriesShown() {
      for (const petName in this.before.celestials.ra.pets) {
        if (this.after.celestials.ra.pets[petName].exp > this.before.celestials.ra.pets[petName].exp &&
            player.options.awayProgress.celestialMemories) return true;
      }
    return false;
    },
    blackHoleShown() {
      if ((this.after.blackHole[0].activations > this.before.blackHole[0].activations ||
          this.after.blackHole[1].activations > this.before.blackHole[1].activations) &&
          player.options.awayProgress.blackHole) {
        return true;
      }
    return false;
    }
  },
  methods: {
    update() {
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
    },
    formatPseudo(number) {
      if (Decimal.lt(number, 1e9)) return formatInt(number);
      return format(number, 2, 2);  
    }
  },
  template: `
    <div class="c-modal-away-progress">
      <modal-close-button @click="emitClose"/>
      <div class="c-modal-away-progress__header">{{ headerText }}</div>
      <div class="c-modal-away-progress__resources">
        <div v-if="after.antimatter.gt(before.antimatter) && antimatter">
          <b class="c-modal-away-progress__antimatter">Antimatter</b> increased from
          <br>
          {{ format(before.antimatter, 2, 2) }} to {{ format(after.antimatter, 2, 2) }}
        </div>
        <div v-if="after.infinityPoints.gt(before.infinityPoints) && infinityPoints">
          <b class="c-modal-away-progress__infinity-points">Infinity Points</b> increased from
          <br>
          {{ format(before.infinityPoints, 2, 2) }} to {{ format(after.infinityPoints, 2, 2) }}
        </div>
        <div v-if="after.eternityPoints.gt(before.eternityPoints) && eternityPoints">
          <b class="c-modal-away-progress__eternity-points">Eternity Points</b> increased from
          <br>
          {{ format(before.eternityPoints, 2, 2) }} to {{ format(after.eternityPoints, 2, 2) }}
        </div>
        <div v-if="after.reality.realityMachines.gt(before.reality.realityMachines) && realityMachines">
          <b class="c-modal-away-progress__reality-machines">Reality Machines</b> increased from
          <br>
          {{ format(before.reality.realityMachines, 2, 2) }} to {{ format(after.reality.realityMachines, 2, 2) }}
        </div>
        <div v-if="after.dilation.dilatedTime.gt(before.dilation.dilatedTime) && dilatedTime">
          <b class="c-modal-away-progress__dilated-time">Dilated Time</b> increased from
          <br>
          {{ format(before.dilation.dilatedTime, 2, 2) }} to {{ format(after.dilation.dilatedTime, 2, 2) }}
        </div>
        <div v-if="after.infinitied.gt(before.infinitied) && infinities">
          <b class="c-modal-away-progress__infinities">Infinities</b> increased from
          <br>
          {{ formatPseudo(before.infinitied) }} to {{ formatPseudo(after.infinitied) }}
        </div>
        <div v-if="after.eternities.gt(before.eternities) && eternities">
          <b class="c-modal-away-progress__eternities">Eternities</b> increased from
          <br>
          {{ formatPseudo(before.eternities) }} to {{ formatPseudo(after.eternities) }}
        </div>
        <div v-if="after.realities > before.realities && realities">
          <b class="c-modal-away-progress__realities">Realities</b> increased from
          <br>
          {{ formatPseudo(before.realities) }} to {{ formatPseudo(after.realities) }}
        </div>
        <div v-if="after.celestials.laitela.singularities > before.celestials.laitela.singularities && singularities">
          <b class="c-modal-away-progress__singularities">Singularities</b> increased from
          <br>
          {{ formatPseudo(before.celestials.laitela.singularities) }} to
          {{ formatPseudo(after.celestials.laitela.singularities) }}
        </div>
        <div v-if="after.celestials.laitela.matter.gt(before.celestials.laitela.matter) && darkMatter">
          <b class="c-modal-away-progress__singularities">Dark Matter</b> increased from
          <br>
          {{ format(before.celestials.laitela.matter, 2, 2) }} to {{ format(after.celestials.laitela.matter, 2, 2) }}
        </div>
        <div v-if="after.replicanti.amount.gt(before.replicanti.amount) && replicanti">
          <b class="c-modal-away-progress__replicanti">Replicanti</b> increased from
          <br>
          {{ format(before.replicanti.amount, 2, 2) }} to {{ format(after.replicanti.amount, 2, 2) }}
        </div>
        <div v-if="after.replicanti.galaxies > before.replicanti.galaxies && replicantiGalaxies">
          <b class="c-modal-away-progress__replicanti">Replicanti Galaxies</b> increased from
          <br>
          {{ formatInt(before.replicanti.galaxies) }} to {{ formatInt(after.replicanti.galaxies) }}
        </div>
        <div v-if="celestialMemoriesShown">
          <span v-if="after.celestials.ra.pets.teresa.level > before.celestials.ra.pets.teresa.level">
          <b class="c-modal-away-progress__teresa">Teresa's Celestial Memory</b> increased from
          <br>
          memories {{ format(before.celestials.ra.pets.teresa.level) }} to
          memories {{ format(after.celestials.ra.pets.teresa.level) }}
          <br>
          </span>
          <span v-if="after.celestials.ra.pets.effarig.level > before.celestials.ra.pets.effarig.level">
          <b class="c-modal-away-progress__effarig">Effarig's Celestial Memory</b> increased from
          <br>
          memories {{ format(before.celestials.ra.pets.effarig.level) }} to
          memories {{ format(after.celestials.ra.pets.effarig.level) }}
          <br>
          </span>
          <span v-if="after.celestials.ra.pets.enslaved.level > before.celestials.ra.pets.enslaved.level">
          <b class="c-modal-away-progress__enslaved">Enslaved's Celestial Memory</b> increased from
          <br>
          memories {{ format(before.celestials.ra.pets.enslaved.level) }} to
          memories {{ format(after.celestials.ra.pets.enslaved.level) }}
          <br>
          </span>
          <span v-if="after.celestials.ra.pets.v.level > before.celestials.ra.pets.v.level">
          <b class="c-modal-away-progress__v">V's Celestial Memory</b> increased from
          <br>
          memories {{ format(before.celestials.ra.pets.v.level) }} to
          memories {{ format(after.celestials.ra.pets.v.level) }}
          </span>
        </div>
        <div v-if="blackHoleShown">
          <span v-if="after.blackHole[0].activations > before.blackHole[0].activations">
          Your <span v-if="before.blackHole[1].unlocked">first </span>
          <b class="c-modal-away-progress__black-hole">Black Hole</b>
          activated {{ formatInt(after.blackHole[0].activations - before.blackHole[0].activations) }}
          {{"time" | pluralize(after.blackHole[0].activations - before.blackHole[0].activations)}}
          <br>
          </span>
          <span v-if="after.blackHole[1].activations > before.blackHole[1].activations">
          Your second <b class="c-modal-away-progress__black-hole">Black Hole</b>
          activated {{ formatInt(after.blackHole[1].activations - before.blackHole[1].activations) }}
          {{"time" | pluralize(after.blackHole[1].activations - before.blackHole[1].activations)}}
          <br>
          </span>
        </div>
      </div>
    </div>`
});