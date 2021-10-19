"use strict";

Vue.component("glyph-sidebar-inventory-management", {
  template: `
    <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options">
      <glyph-sort-options />
      <br>
      <glyph-clean-options />
      <br>
      <glyph-protected-row-options />
      <br>
      <glyph-header />
    </div>`
});
