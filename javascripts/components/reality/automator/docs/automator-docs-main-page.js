import "./automator-man-page.js";
import "./automator-docs-info.js";
import "./automator-docs-command-list.js";
import "./automator-docs-template-list.js";

Vue.component("automator-docs-main-page", {
  data() {
    return {
      listState: 0,
    };
  },
  methods: {
    buttonStyle(id) {
      return {
        "color": this.listState === id ? "green" : ""
      };
    },
  },
  template: `
    <div>
      <button
        :style="buttonStyle(0)"
        class="fas fa-info-circle"
        @click="listState = 0"
        v-tooltip="'Page Information'"
      />
      <button
        :style="buttonStyle(1)"
        class="fas fa-laptop-code"
        @click="listState = 1"
        v-tooltip="'Show Command List'"
      />
      <button
        :style="buttonStyle(2)"
        class="fas fa-file-code"
        @click="listState = 2"
        v-tooltip="'Show Template List'"
      />
      <br>
      <automator-docs-info v-if="listState === 0" />
      <automator-docs-command-list v-else-if="listState === 1" />
      <automator-docs-template-list v-else-if="listState === 2" />
    </div>`
});
