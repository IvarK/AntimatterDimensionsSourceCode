<script>
import AutomatorDocsManPage from "./AutomatorDocsManPage";

export default {
  name: "AutomatorDocsCommandList",
  components: {
    AutomatorDocsManPage
  },
  data() {
    return {
      selectedCommand: -1,
    };
  },
  computed: {
    commands: () => GameDatabase.reality.automator.commands,
  }
};
</script>

<template>
  <div>
    <button
      v-if="selectedCommand !== -1"
      v-tooltip="'Back to Command List'"
      class="c-automator-docs--button fas fa-arrow-left"
      @click="selectedCommand = -1"
    />
    <AutomatorDocsManPage
      v-if="selectedCommand !== -1"
      :command="commands[selectedCommand]"
    />
    <div
      v-else
      class="c-automator-docs-page"
    >
      <span>Command List:</span>
      <span
        v-for="command in commands"
        v-if="command.isUnlocked()"
        :key="command.id"
        class="c-automator-docs-page__link"
        @click="selectedCommand = command.id"
      >
        {{ command.keyword }}
      </span>
      <br>
      <span>
        Note: In the SYNTAX note on each command, <u>underlined</u> inputs are <i>required</i> inputs which you must
        fill and inputs in [square brackets] are optional (if used, they should be input <i>without</i> the brackets).
        Any other parts should be typed in as they appear. Unless otherwise stated, all of the inputs are
        case-insensitive. Some commands may have more than one valid format, which will appear on separate lines.
      </span>
    </div>
  </div>
</template>

<style scoped>

</style>
