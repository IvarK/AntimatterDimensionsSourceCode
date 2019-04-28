"use strict";

Vue.component("options-tab", {
  template:
    `<div class="l-options-tab">
      <options-button-grid />
      <p onclick="Modal.shortcuts.show()" class="c-options-tab__shortcuts-link">
        Press <kbd>?</kbd> to open shortcut list.
      </p>
    </div>`
});
