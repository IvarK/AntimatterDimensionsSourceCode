"use strict";

Vue.component("options-visual-tab", {
  components: {
    "options-button": {
      template: `
        <primary-button
          class="o-primary-btn--option l-options-grid__button"
          @click="emitClick"
        >
          <slot />
        </primary-button>`
    },
    "update-rate-slider": {
      props: {
        value: {
          type: Number,
          default: 50
        },
      },
      template: `
        <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
          <b>Update rate: {{ formatInt(value) }} ms</b>
          <input
            :value="value"
            class="o-primary-btn--slider__slider"
            type="range"
            min="33"
            max="200"
            @input="emitInput(parseInt($event.target.value))"
          />
        </div>`
    },
  },
  data() {
    return {
      theme: "",
      notation: "",
      commas: false,
      updateRate: 0,
      autosaveInterval: 3000,
      headerTextColored: true,
      realityReached: false,
      showNewGlyphIcon: true,
    };
  },
  watch: {
    commas(newValue) {
      player.options.commas = newValue;
      ADNotations.Settings.exponentCommas.show = newValue;
    },
    updateRate(newValue) {
      player.options.updateRate = newValue;
    },
    headerTextColored(newValue) {
      player.options.headerTextColored = newValue;
    },
    showNewGlyphIcon(newValue) {
      player.options.showNewGlyphIcon = newValue;
    },
  },
  computed: {
    themeLabel() {
      return `Theme: ${Themes.find(this.theme).displayName()} ▼`;
    },
    notationLabel() {
      return `Notation: ${this.notation} ▼`;
    },
    UILabel() {
      return `UI: ${this.$viewModel.newUI ? "New" : "Old"}`;
    }
  },
  methods: {
    update() {
      const options = player.options;
      this.theme = options.theme;
      this.notation = options.notation;
      this.commas = options.commas;
      this.updateRate = options.updateRate;
      this.headerTextColored = options.headerTextColored;
      this.showNewGlyphIcon = options.showNewGlyphIcon;
      this.realityReached = PlayerProgress.realityUnlocked();
    },
  },
  template: `
    <div class="l-options-tab">
      <div class="l-options-grid">
        <div class="l-options-grid__row">
          <options-button
            class="o-primary-btn--option_font-large"
            onclick="GameOptions.toggleUI()"
          >
            {{ UILabel }}
          </options-button>
          <update-rate-slider
            v-model="updateRate"
            oninput="GameOptions.refreshUpdateRate()"
          />
          <options-button
            class="o-primary-btn--option"
            onclick="Modal.newsOptions.show();"
          >
            Open News Options
          </options-button>
        </div>
        <div class="l-options-grid__row">
          <expanding-control-box width-source="header" class="l-options-grid__button c-options-grid__notations">
            <div slot="header" class="o-primary-btn o-primary-btn--option l-options-grid__notations-header">
              {{ themeLabel }}
            </div>
            <select-theme slot="dropdown" />
          </expanding-control-box>
          <expanding-control-box width-source="header" class="l-options-grid__button c-options-grid__notations">
            <div slot="header" class="o-primary-btn o-primary-btn--option l-options-grid__notations-header">
              {{ notationLabel }}
            </div>
            <select-notation slot="dropdown" />
          </expanding-control-box>
          <primary-button-on-off-custom
            v-model="commas"
            class="o-primary-btn--option l-options-grid__button"
            on="Exponent formatting: Commas"
            off="Exponent formatting: Notation"
          />
        </div>
        <div class="l-options-grid__row">
          <options-button
            class="o-primary-btn--option"
            onclick="Modal.animationOptions.show();"
          >
            Open Animation Options
          </options-button>
          <options-button
            class="o-primary-btn--option"
            onclick="Modal.infoDisplayOptions.show()"
          >
            Open Info Display Options
          </options-button>
          <options-button
            class="o-primary-btn--option"
            onclick="Modal.awayProgressOptions.show()"
          >
            Open Away Progress Options
          </options-button>
        </div>
        <div class="l-options-grid__row">
          <options-button
            class="o-primary-btn--option"
            onclick="Modal.hiddenTabs.show()"
          >
            Modify Visible Tabs
          </options-button>
          <primary-button-on-off
            v-model="headerTextColored"
            class="o-primary-btn--option l-options-grid__button"
            text="Relative prestige gain text coloring:"
          />
          <primary-button-on-off
            v-if="realityReached"
            v-model="showNewGlyphIcon"
            class="o-primary-btn--option l-options-grid__button"
            text='Show "New!" icon on new Glyphs:'
          />
        </div>
        <open-modal-shortcuts />
      </div>
    </div>`
});
