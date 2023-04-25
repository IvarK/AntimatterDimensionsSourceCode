<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ImportTimeStudyConstants",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      constantNames: [],
    };
  },
  computed: {
    presets: () => player.timestudy.presets.filter(p => p.studies !== ""),
    names() {
      // Study presets can contain non-alphanumeric characters, which aren't allowed in constants,
      // so we replace all of those with underscores
      return this.presets.map(p => `TSPreset__${p.name.replaceAll(/[^a-zA-Z_0-9]/gu, "_")}`);
    }
  },
  methods: {
    update() {
      this.constantNames = [...player.reality.automator.constantSortOrder];
    },
    importConstants() {
      for (let index = 0; index < this.presets.length; index++) {
        AutomatorBackend.modifyConstant(this.names[index], this.presets[index].studies);
      }
    },
    hasConflict(constantName) {
      return this.constantNames.includes(constantName);
    },
    missedImports() {
      let newCount = 0;
      for (const name of this.names) {
        if (!this.hasConflict(name)) newCount++;
      }
      return Math.clampMin(this.constantNames.length + newCount - AutomatorData.MAX_ALLOWED_CONSTANT_COUNT, 0);
    },
    // Shorten the string to less than 55 characters for UI purposes - but we shorten the middle since the
    // beginning and end are both potentially useful to see
    shortenString(str) {
      if (str.length < 55) return str;
      return `${str.substring(0, 12)}...${str.substring(str.length - 40, str.length)}`;
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="importConstants"
  >
    <template #header>
      Importing Time Study Presets as Constants
    </template>
    <div class="c-modal-message__text">
      Confirming this modal will import all of your saved Time Study presets as new Automator constants.
      Below are all the valid presets which will be imported, with the beginning and end of their contained
      studies shown. Some names may be changed due to restrictions on constant name formatting.
      <br>
      <br>
      <div
        v-for="i in presets.length"
        :key="i"
      >
        Name: {{ presets[i-1].name }} ➜ <b>{{ names[i-1] }}</b>
        <br>
        {{ shortenString(presets[i-1].studies) }}
        <span
          v-if="hasConflict(names[i-1])"
          class="l-warn-text"
        >
          <br>
          This will overwrite an existing constant!
        </span>
        <br>
        <br>
      </div>
      <div
        v-if="missedImports() > 0"
        class="l-warn-text"
      >
        Due to the limit on constant count, {{ quantify("constant", missedImports()) }} will not be imported!
      </div>
    </div>
    <template #confirm-text>
      Import All
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-warn-text {
  color: var(--color-bad);
}
</style>
