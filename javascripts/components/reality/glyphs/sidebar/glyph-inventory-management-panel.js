"use strict";

Vue.component("glyph-inventory-management-panel", {
  template: `
    <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
      <glyph-sort-button-group />
      <glyph-clean-button-group />
      <glyph-protected-row-button-group />
      <glyph-autosort-button-group />
    </div>`
});
