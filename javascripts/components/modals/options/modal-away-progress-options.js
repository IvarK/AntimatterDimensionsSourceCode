"use strict";

Vue.component("modal-away-progress-options", {
  mixins: [modalOptionsMixin],
  components: {
    "away-progress-options-helper": {
      mixins: [modalOptionsMixin],
      props: {
        option: String,
      },
      data() {
        return {
          setting: false,
        };
      },
      watch: {
        setting(newValue) {
          AwayProgressTypes[this.option].option = newValue;
        },
      },
      computed: {
        text() {
          return `${AwayProgressTypes[this.option].formatName}:`;
        }
      },
      methods: {
        update() {
          this.setting = AwayProgressTypes[this.option].option;
        }
      },
      template: `
        <wide-on-off-button
          v-model="setting"
          :text="text"
        />`
    }
  },
  data() {
    return {
      all: Array,
      celestialMemories: false,
      blackHole: false
    };
  },
  watch: {
    celestialMemories(newValue) {
      player.options.awayProgress.celestialMemories = newValue;
    },
    blackHole(newValue) {
      player.options.awayProgress.blackHole = newValue;
    },
  },
  methods: {
    update() {
      this.all = AwayProgressTypes.all.filter(type => type.showOption && type.isUnlocked());

      this.raUnlocked = V.has(V_UNLOCKS.RA_UNLOCK);
      this.blackHoleUnlocked = BlackHoles.list[0].isUnlocked;

      const options = player.options.awayProgress;
      this.celestialMemories = options.celestialMemories;
      this.blackHole = options.blackHole;
    }
  },
  template: `
    <modal-options @close="emitClose" style="width: 50rem">
      <div>
        <away-progress-options-helper
          v-for="(entry, id) of all"
          :key="id"
          :option="entry.name"
        />
        <wide-on-off-button v-if="raUnlocked" v-model="celestialMemories" text="Celestial Memories:" />
        <wide-on-off-button v-if="blackHoleUnlocked" v-model="blackHole" text="Black Hole:" />
      </div>
      Note: Selected resources will only show if they've increased.
    </modal-options>`
});
