import { modalOptionsMixin } from "./modal-options.js";

Vue.component("modal-away-progress-options", {
  components: {
    "away-progress-options-helper": {
      mixins: [modalOptionsMixin],
      props: {
        name: String,
      },
      data() {
        return {
          setting: false,
          isVisible: false,
        };
      },
      watch: {
        setting(newValue) {
          this.type.option = newValue;
        },
      },
      computed: {
        type() {
          return AwayProgressTypes.all[this.name];
        },
        text() {
          return `${this.type.formatName}:`;
        }
      },
      methods: {
        update() {
          const type = this.type;
          this.setting = type.option;
          this.isVisible = type.isUnlocked();
        }
      },
      template: `
        <wide-on-off-button
          v-if="isVisible"
          v-model="setting"
          :text="text"
        />`
    }
  },
  computed: {
    all() {
      return AwayProgressTypes.showOption;
    }
  },
  template: `
    <modal-options @close="emitClose" style="width: 75rem">
      <div class="c-modal-options__button-container">
        <away-progress-options-helper
          v-for="name of all"
          :key="name"
          :name="name"
        />
      </div>
      Note: Selected resources will only show if they've increased.
    </modal-options>`
});
