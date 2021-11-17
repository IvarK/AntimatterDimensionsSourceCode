import { modalOptionsMixin } from "./modal-options.js";

Vue.component("modal-away-progress-options", {
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
    };
  },
  methods: {
    update() {
      this.all = AwayProgressTypes.all.filter(type => type.showOption && type.isUnlocked());
    }
  },
  template: `
    <modal-options @close="emitClose" style="width: 50rem">
      <div class="c-modal-options__button-container">
        <away-progress-options-helper
          v-for="(entry, id) of all"
          :key="id"
          :option="entry.name"
        />
      </div>
      Note: Selected resources will only show if they've increased.
    </modal-options>`
});
