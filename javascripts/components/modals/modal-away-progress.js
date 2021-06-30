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
      blackHole: false,
      teresaMemoriesShown: false,
      effarigMemoriesShown: false,
      enslavedMemoriesShown: false,
      vMemoriesShown: false,
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
          (!after.infinities.gt(before.infinities) || !this.infinities) &&
          (!after.eternities.gt(before.eternities) || !this.eternities) &&
          (after.realities <= before.realities || !this.realities) &&
          (after.celestials.laitela.singularities <= before.celestials.laitela.singularities || !this.singularities) &&
          (!after.celestials.laitela.darkMatter.gt(before.celestials.laitela.darkMatter) || !this.darkMatter) &&
          (!after.replicanti.amount.gt(before.replicanti.amount) || !this.replicanti) &&
          (after.replicanti.galaxies <= before.replicanti.galaxies || !this.replicantiGalaxies) &&
          !this.teresaMemoriesShown && !this.effarigMemoriesShown &&
          !this.enslavedMemoriesShown && !this.vMemoriesShown &&
          !this.blackHoleShown
      ) {
        SecretAchievement(36).unlock();
        return `While you were away for ${TimeSpan.fromSeconds(this.modalConfig.seconds).toString()}...
          Nothing happened.`;
      }
      return `While you were away for ${TimeSpan.fromSeconds(this.modalConfig.seconds).toString()}: `;
    },
    blackHoleShown() {
      return ((this.after.blackHole[0].activations > this.before.blackHole[0].activations ||
        this.after.blackHole[1].activations > this.before.blackHole[1].activations) &&
        player.options.awayProgress.blackHole);
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
      this.teresaMemoriesShown = this.showMemoryGain("teresa");
      this.effarigMemoriesShown = this.showMemoryGain("effarig");
      this.enslavedMemoriesShown = this.showMemoryGain("enslaved");
      this.vMemoriesShown = this.showMemoryGain("v");
    },
    formatPseudo(number) {
      if (Decimal.lt(number, 1e9)) return formatInt(number);
      return format(number, 2, 2);
    },
    showMemoryGain(pet) {
      return player.options.awayProgress.celestialMemories &&
        this.after.celestials.ra.pets[pet].memories > this.before.celestials.ra.pets[pet].memories &&
        this.before.celestials.ra.pets[pet].level < Ra.levelCap;
    },
  },
  template: `
    <div class="c-modal-away-progress">
      <modal-close-button @click="emitClose" />
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
        <div v-if="after.infinities.gt(before.infinities) && infinities">
          <b class="c-modal-away-progress__infinities">Infinities</b> increased from
          <br>
          {{ formatPseudo(before.infinities) }} to {{ formatPseudo(after.infinities) }}
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
        <div v-if="after.celestials.laitela.darkMatter.gt(before.celestials.laitela.darkMatter) && darkMatter">
          <b class="c-modal-away-progress__singularities">Dark Matter</b> increased from
          <br>
          {{ format(before.celestials.laitela.darkMatter, 2, 2) }} to
          {{ format(after.celestials.laitela.darkMatter, 2, 2) }}
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
        <div v-if="teresaMemoriesShown || effarigMemoriesShown || enslavedMemoriesShown || vMemoriesShown">
          <span v-if="teresaMemoriesShown">
            <b class="c-modal-away-progress__teresa">Teresa's Memories</b> increased from
            <br>
            {{ format(before.celestials.ra.pets.teresa.memories, 2) }} to
            {{ format(after.celestials.ra.pets.teresa.memories, 2) }}
            <br>
          </span>
          <span v-if="effarigMemoriesShown">
            <b class="c-modal-away-progress__effarig">Effarig's Memories</b> increased from
            <br>
            {{ format(before.celestials.ra.pets.effarig.memories, 2) }} to
            {{ format(after.celestials.ra.pets.effarig.memories, 2) }}
            <br>
          </span>
          <span v-if="enslavedMemoriesShown">
            <b class="c-modal-away-progress__enslaved">Enslaved's Memories</b> increased from
            <br>
            {{ format(before.celestials.ra.pets.enslaved.memories, 2) }} to
            {{ format(after.celestials.ra.pets.enslaved.memories, 2) }}
            <br>
          </span>
          <span v-if="vMemoriesShown">
            <b class="c-modal-away-progress__v">V's Memories</b> increased from
            <br>
            {{ format(before.celestials.ra.pets.v.memories, 2) }} to
            {{ format(after.celestials.ra.pets.v.memories, 2) }}
          </span>
        </div>
        <div v-if="blackHoleShown">
          <span v-if="after.blackHole[0].activations > before.blackHole[0].activations">
            Your <span v-if="before.blackHole[1].unlocked">first </span>
            <b class="c-modal-away-progress__black-hole">Black Hole</b>
            activated {{ formatInt(after.blackHole[0].activations - before.blackHole[0].activations) }}
            {{ "time" | pluralize(after.blackHole[0].activations - before.blackHole[0].activations) }}
            <br>
          </span>
          <span v-if="after.blackHole[1].activations > before.blackHole[1].activations">
            Your second <b class="c-modal-away-progress__black-hole">Black Hole</b>
            activated {{ formatInt(after.blackHole[1].activations - before.blackHole[1].activations) }}
            {{ "time" | pluralize(after.blackHole[1].activations - before.blackHole[1].activations) }}
            <br>
          </span>
        </div>
      </div>
    </div>`
});
