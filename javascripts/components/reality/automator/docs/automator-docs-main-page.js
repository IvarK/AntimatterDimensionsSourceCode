"use strict";

Vue.component("automator-docs-main-page", {
  computed: {
    commands: () => GameDatabase.reality.automator.commands
  },
  template: `
    <div class="c-automator-docs-page">
      <span>Commands:</span>
      <span
        v-for="command in commands"
        class="c-automator-docs-page__link"
        @click="$emit('select', command.id)"
        v-if="command.isUnlocked()"
      >{{command.keyword}}</span>
    </div>
  `
});
