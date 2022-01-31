<script>
import AutomatorManPage from "./AutomatorDocsManPage";

export default {
  name: "AutomatorDocsCommandList",
  components: {
    AutomatorManPage
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
      class="fas fa-arrow-left"
      @click="selectedCommand = -1"
    />
    <AutomatorManPage
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
    </div>
  </div>
</template>

<style scoped>

</style>
