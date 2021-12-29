import "./automator-man-page.js";

Vue.component("automator-docs-main-page", {
  data() {
    return {
      listState: 0,
      selectedCommand: -1,
    };
  },
  computed: {
    commands: () => GameDatabase.reality.automator.commands,
    templates: () => GameDatabase.reality.automator.templates.scripts
  },
  methods: {
    showModal(template) {
      Modal.automatorScriptTemplate.show(template);
    },
    buttonStyle(selected) {
      return {
        "color": selected ? "green" : ""
      };
    },
  },
  template: `
    <div>
      <button
        :style="buttonStyle(listState === 0)"
        class="fas fa-info-circle"
        @click="listState = 0"
        v-tooltip="'Information'"
      />
      <button
        :style="buttonStyle(listState === 1)"
        class="fas fa-laptop-code"
        @click="listState = 1"
        v-tooltip="'Show Command List'"
      />
      <button
        :style="buttonStyle(listState === 2)"
        class="fas fa-file-code"
        @click="listState = 2"
        v-tooltip="'Show Template List'"
      />
      <button
        v-if="listState === 1 && selectedCommand !== -1"
        class="fas fa-arrow-left"
        @click="selectedCommand = -1"
        v-tooltip="'Back to Command List'"
      />
      <br>
      <div class="c-automator-docs-page" v-if="listState === 0">
        This page of the Automator pane shows information about the scripting language used for the Automator.
        <br>
        <br>
        If you feel confident about diving right in to making your own script, you can open up a list of command
        documentation pages. This will be similarly formatted to reference pages for programming.
        <br>
        <br>
        If you have minimal or no prior coding experience, you can instead use some premade templates which generate
        text that can put directly into the Automator text field.
      </div>
      <div v-else-if="listState === 1">
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
      </div>
      <div v-else-if="listState === 2">
        These templates will let you do some more common things within the Automator. They may be slightly slower than
        manually-written scripts, but don't require you to have any previous programming experience to use. Clicking any
        of these buttons will open up a prompt with some input fields, which will generate text you can copy and paste
        directly into the Automator.
        <button
          class="c-automator__button l-automator__button"
          v-for="template in templates"
          @click="showModal(template)"
        >
          Template: {{ template.name }}
        </button>
      </div>
    </div>`
});
