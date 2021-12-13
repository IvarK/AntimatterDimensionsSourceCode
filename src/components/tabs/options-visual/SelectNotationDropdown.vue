<script>
export default {
  name: "SelectNotationComboBox",
  computed: {
    notations: () => Notations.all,
  }
};
</script>

<template>
  <div class="l-select-notation">
    <div
      v-for="notation in notations"
      :key="notation.name"
      class="o-primary-btn l-select-notation__item c-select-notation__item"
      @click="notation.setAsCurrent()"
    >
      {{ notation.name }}
    </div>
  </div>
</template>
