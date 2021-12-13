<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import ExpandingControlBox from "@/components/ExpandingControlBox";
import OptionsButton from "@/components/OptionsButton";
import UpdateRateSlider from "./UpdateRateSlider";
import OpenModalShortcutsButton from "@/components/OpenModalShortcutsButton";
import SelectThemeDropdown from "@/components/tabs/options-visual/SelectThemeDropdown";
import SelectNotationDropdown from "@/components/tabs/options-visual/SelectNotationDropdown";

export default {
  name: "OptionsVisualTab",
  components: {
    UpdateRateSlider,
    PrimaryToggleButton,
    ExpandingControlBox,
    OptionsButton,
    OpenModalShortcutsButton,
    SelectThemeDropdown,
    SelectNotationDropdown
  },
  data() {
    return {
      theme: "",
      notation: "",
      commas: false,
      autosaveInterval: 3000,
      headerTextColored: true,
    };
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
  watch: {
    commas(newValue) {
      player.options.commas = newValue;
      ADNotations.Settings.exponentCommas.show = newValue;
    },
    headerTextColored(newValue) {
      player.options.headerTextColored = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.theme = options.theme;
      this.notation = options.notation;
      this.commas = options.commas;
      this.headerTextColored = options.headerTextColored;
    },
  }
};
</script>

<template>
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-large"
          onclick="GameOptions.toggleUI()"
        >
          {{ UILabel }}
        </OptionsButton>
        <UpdateRateSlider />
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.newsOptions.show();"
        >
          Open News Options
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <ExpandingControlBox class="l-options-grid__button c-options-grid__notations">
          <div
            slot="header"
            class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          >
            {{ themeLabel }}
          </div>
          <SelectThemeDropdown slot="dropdown" />
        </ExpandingControlBox>
        <ExpandingControlBox class="l-options-grid__button c-options-grid__notations">
          <div
            slot="header"
            class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          >
            {{ notationLabel }}
          </div>
          <SelectNotationDropdown slot="dropdown" />
        </ExpandingControlBox>
        <PrimaryToggleButton
          v-model="commas"
          class="o-primary-btn--option l-options-grid__button"
          label="Exponent formatting:"
          on="Commas"
          off="Notation"
        />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.animationOptions.show();"
        >
          Open Animation Options
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.infoDisplayOptions.show()"
        >
          Open Info Display Options
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.awayProgressOptions.show()"
        >
          Open Away Progress Options
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.hiddenTabs.show()"
        >
          Modify Visible Tabs
        </OptionsButton>
        <PrimaryToggleButton
          v-model="headerTextColored"
          class="o-primary-btn--option l-options-grid__button"
          label="Relative prestige gain text coloring:"
        />
      </div>
      <OpenModalShortcutsButton />
    </div>
  </div>
</template>
