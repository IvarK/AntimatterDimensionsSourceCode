Vue.component("automator-docs-command-list", {
  data() {
    return {
      selectedCommand: -1,
    };
  },
  computed: {
    commands: () => GameDatabase.reality.automator.commands,
  },
  template: `
    <div>
      <button
        v-if="selectedCommand !== -1"
        class="fas fa-arrow-left"
        @click="selectedCommand = -1"
        v-tooltip="'Back to Command List'"
      />
      <automator-man-page
        v-if="selectedCommand !== -1"
        :command="commands[selectedCommand]"
      />
      <div v-else class="c-automator-docs-page" >
        <span>Command List:</span>
        <span
          v-for="command in commands"
          class="c-automator-docs-page__link"
          @click="selectedCommand = command.id"
          v-if="command.isUnlocked()"
        >
          {{ command.keyword }}
        </span>
      </div>
    </div>`
});
