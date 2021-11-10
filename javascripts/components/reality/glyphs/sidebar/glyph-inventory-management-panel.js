import "./glyph-sort-button-group.js";
import "./glyph-protected-row-button-group.js";
import "./glyph-autosort-button-group.js";
import "./glyph-clean-button-group.js";

Vue.component("glyph-inventory-management-panel", {
  template: `
    <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
      <glyph-sort-button-group />
      <br>
      <glyph-protected-row-button-group />
      <br>
      <glyph-autosort-button-group />
      <br>
      <glyph-clean-button-group />
    </div>`
});
