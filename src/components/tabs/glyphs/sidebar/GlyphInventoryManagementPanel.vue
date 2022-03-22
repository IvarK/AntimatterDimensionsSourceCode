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
  },
  computed: {
    groupClass() {
      return "l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size" +
        " l-glyph-inventory-management";
    }
  },
};
</script>

<template>
  <div :class="groupClass">
    <GlyphSortButtonGroup />
    <GlyphProtectedRowButtonGroup />
    <GlyphAutosortButtonGroup />
    <GlyphCleanButtonGroup />
  </div>
</template>

<style scoped>

</style>
