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
  <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
    <GlyphSortButtonGroup />
    <br>
    <GlyphProtectedRowButtonGroup />
    <br>
    <GlyphAutosortButtonGroup />
    <br>
    <GlyphCleanButtonGroup />
  </div>
</template>

<style scoped>

</style>
