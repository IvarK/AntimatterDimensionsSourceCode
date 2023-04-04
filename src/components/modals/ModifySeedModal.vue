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
      seedText: "",
      convertedInput: false,
      seedValue: 0,
    };
  },
  computed: {
    choiceEnum: () => SPEEDRUN_SEED_STATE,
    officialSeed: () => Speedrun.officialFixedSeed,
  },
  created() {
    this.seedValue = player.speedrun.initialSeed;
    this.inputSeed = `${player.speedrun.initialSeed}`;
    this.convertedInput = false;
  },
  methods: {
    update() {
      this.mode = player.speedrun.seedSelection;
      this.seedText = Speedrun.seedModeText();
    },
    handleSeedInput() {
      if (this.inputSeed.match(/^-?\d+$/gu)) {
        const num = Number(this.inputSeed);
        this.seedValue = Math.abs(num) > 9e15
          ? this.hashStringToSeed(this.inputSeed)
          : Number(this.inputSeed);
      } else {
        this.seedValue = this.hashStringToSeed(this.inputSeed);
      }
      this.convertedInput = this.seedValue !== Number(this.inputSeed);

      if (this.seedValue === 0) this.setMode(this.choiceEnum.FIXED);
      else this.setMode(this.choiceEnum.PLAYER, this.seedValue);
    },
    setMode(mode, seed) {
      if (mode === this.choiceEnum.PLAYER && this.seedValue === 0) return;
      Speedrun.modifySeed(mode, parseInt(seed, 10));
    },
    buttonClass(mode) {
      return {
        "o-primary-btn--subtab-option": true,
        "o-selected": mode === this.mode,
      };
    },
    // String-to-number hashing function, using a fixed numerical seed inspired by Number.MAX_VALUE
    // See https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    hashStringToSeed(str) {
      const seed = 17977308;
      let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
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
      different from anyone else's playthrough unless they intentionally choose the same value.
      <br>
      <br>
      <PrimaryButton
        v-tooltip="seedValue === 0 ? 'Input seed cannot be zero!' : ''"
        :class="buttonClass(choiceEnum.PLAYER)"
        @click="setMode(choiceEnum.PLAYER, seedValue)"
      >
        Player-selected Seed:
      </PrimaryButton>
      <input
        ref="inputSeed"
        v-model="inputSeed"
        type="text"
        class="c-modal-input"
        @input="handleSeedInput()"
      >
      <br>
      This option sets your seed to the value you type into the text box.
      <br>
      <span v-if="seedValue !== 0">
        Your current input will be {{ convertedInput ? "converted to" : "used as" }} the number <b>{{ seedValue }}</b>.
      </span>
      <span v-else>
        Your current input {{ convertedInput ? "converts to" : "is equal to" }} <b>0</b>;
        the seed will default to Official Preset.
      </span>
      <br>
      For technical reasons, this value must be must be non-zero to be accepted.
    </div>
  </ModalWrapper>
</template>

<style scoped>
.o-selected {
  color: var(--color-text-inverted);
  background-color: var(--color-good);
}
</style>
