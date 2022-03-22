<script>
import GlyphSortButtonGroup from "./GlyphSortButtonGroup";
import GlyphProtectedRowButtonGroup from "./GlyphProtectedRowButtonGroup";
import GlyphAutosortButtonGroup from "./GlyphAutosortButtonGroup";
import GlyphCleanButtonGroup from "./GlyphCleanButtonGroup";

export default {
  name: "GlyphInventoryManagementPanel",
  components: {
    GlyphSortButtonGroup,
    GlyphProtectedRowButtonGroup,
    GlyphAutosortButtonGroup,
    GlyphCleanButtonGroup
  }
};
</script>

<template>
  <div
    class="
      l-glyph-sacrifice-options c-glyph-sacrifice-options
      l-glyph-sidebar-panel-size l-glyph-inventory-management
      "
  >
    <div class="o-glyph-inventory-management-group">
      <GlyphSortButtonGroup />
    </div>
    <div class="o-glyph-inventory-management-group">
      <GlyphProtectedRowButtonGroup />
    </div>
    <div class="o-glyph-inventory-management-group">
      <GlyphAutosortButtonGroup />
    </div>
    <div class="o-glyph-inventory-management-group">
      <GlyphCleanButtonGroup />
    </div>
  </div>
</template>

<style scoped>

</style>
