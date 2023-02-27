<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModifySeedModal",
  components: {
    ModalWrapper,
    PrimaryButton,
  },
  data() {
    return {
      mode: 0,
      inputSeed: "",
      validInput: false,
      seedText: "",
    };
  },
  computed: {
    choiceEnum: () => SPEEDRUN_SEED_STATE,
    officialSeed: () => Speedrun.officialFixedSeed,
  },
  created() {
    if (player.speedrun.seedSelection === this.choiceEnum.PLAYER) this.inputSeed = player.speedrun.initialSeed;
  },
  methods: {
    update() {
      this.mode = player.speedrun.seedSelection;
      this.validInput = this.inputSeed.match(/^\d+$/gu);
      this.seedText = Speedrun.seedModeText();
    },
    setMode(mode, seed) {
      if (mode === this.choiceEnum.PLAYER && !this.validInput) return;
      Speedrun.modifySeed(mode, parseInt(seed, 10));
    },
    buttonClass(mode) {
      return {
        "o-primary-btn--subtab-option": true,
        "o-selected": mode === this.mode,
      };
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Modifying Glyph RNG Seed
    </template>
    <div>
      All Glyph options beyond the first Reality for an entire playthrough are randomly determined from the very
      beginning, based on the value of an initial seed number. The role of this seed is that it chooses a single,
      <i>particular</i> set of Glyph options for your playthrough. If you or anyone else chooses the same seed
      in a different run, you will get the same options for Glyphs.
      <br>
      <br>
      You can switch between these three options any point before you generate your first Glyph.
      <br>
      Current Setting: <b>{{ seedText }}</b>
      <br>
      <br>
      <PrimaryButton
        :class="buttonClass(choiceEnum.FIXED)"
        @click="setMode(choiceEnum.FIXED)"
      >
        Official Preset Seed
      </PrimaryButton>
      <br>
      This is the default option which chooses the seed <b>{{ officialSeed }}</b>. Anyone who
      chooses to not modify the seed at all will get these Glyph options.
      <br>
      <br>
      <PrimaryButton
        :class="buttonClass(choiceEnum.RANDOM)"
        @click="setMode(choiceEnum.RANDOM)"
      >
        Randomized Seed
      </PrimaryButton>
      <br>
      This selects a completely randomized seed value, producing Glyph options which are very likely to be
      different from anyone else's playthrough unless they intentionally choose it as well.
      <br>
      <br>
      <PrimaryButton
        v-tooltip="validInput ? '' : 'Text box contains an invalid input'"
        :class="buttonClass(choiceEnum.PLAYER)"
        @click="setMode(choiceEnum.PLAYER, inputSeed)"
      >
        Player-selected Seed:
      </PrimaryButton>
      <input
        ref="inputSeed"
        v-model="inputSeed"
        type="text"
        class="c-modal-input"
      >
      <br>
      This option sets your seed to the value you type into the text box. It must be a positive integer.
    </div>
  </ModalWrapper>
</template>

<style scoped>
.o-selected {
  color: var(--color-text-inverted);
  background-color: var(--color-good);
}
</style>
