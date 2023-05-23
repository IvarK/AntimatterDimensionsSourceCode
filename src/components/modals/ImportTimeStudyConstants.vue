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
      willImport: [],
    };
  },
  computed: {
    presets: () => player.timestudy.presets.filter(p => p.studies !== ""),
    names() {
      // Study presets can contain non-alphanumeric characters, which aren't allowed in constants,
      // so we replace all of those with underscores. This alone can however result in duplicate names due
      // to multiple different characters being mapped to underscores, so we also include the preset index
      return this.presets.map((p, index) => `TSPreset${index + 1}__${p.name.replaceAll(/[^a-zA-Z_0-9]/gu, "_")}`);
    }
  },
  methods: {
    update() {
      this.constantNames = [...player.reality.automator.constantSortOrder];
      this.updateImportStatus();
    },
    importConstants() {
      for (let index = 0; index < this.presets.length; index++) {
        AutomatorBackend.modifyConstant(this.names[index], this.presets[index].studies);
      }
    },
    hasConflict(constantName) {
      return this.constantNames.includes(constantName);
    },
    updateImportStatus() {
      let availableSlots = AutomatorData.MAX_ALLOWED_CONSTANT_COUNT - this.constantNames.length;
      this.willImport = [];
      for (let index = 0; index < this.names.length; index++) {
        if (this.hasConflict(this.names[index])) {
          this.willImport.push(true);
        } else if (availableSlots > 0) {
          this.willImport.push(true);
          availableSlots--;
        } else this.willImport.push(false);
      }
    },
    missedImports() {
      return this.willImport.countWhere(x => !x);
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
        :class="{ 'l-not-imported' : !willImport[i-1] }"
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
        {{ quantify("preset", missedImports()) }} in this list cannot be imported
        due to the limit on constant count.
      </div>
    </div>
    <template #confirm-text>
      Import All
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-warn-text {
  font-weight: bold;
  color: var(--color-bad);
}

.l-not-imported {
  color: var(--color-disabled);
}
</style>
