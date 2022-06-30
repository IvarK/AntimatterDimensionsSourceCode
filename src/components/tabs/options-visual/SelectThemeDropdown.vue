<script>
export default {
  name: "SelectThemeDropdown",
  data() {
    return {
      availableThemeNames: []
    };
  },
  computed: {
    themes() {
      return this.availableThemeNames.map(name => Themes.find(name));
    }
  },
  methods: {
    update() {
      this.availableThemeNames = Themes.available().map(t => t.name);
    }
  }
};
</script>

<template>
  <div class="l-select-theme">
    <div
      v-for="theme in themes"
      :key="theme.name"
      :style="{
        'border-bottom-width': theme.name === availableThemeNames.last() ? '0' : ''
      }"
      class="o-primary-btn l-select-theme__item c-select-theme__item"
      @click="theme.set()"
    >
      {{ theme.displayName() }}
    </div>
  </div>
</template>
