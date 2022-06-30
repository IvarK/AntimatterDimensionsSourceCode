<script>
export default {
  name: "AutomatorButton"
};
</script>

<template>
  <button
    class="c-automator__button l-automator__button fas"
    @click="emitClick"
  />
</template>

<style scoped>
.c-automator__button {
  width: 3.3rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-automator-controls-border);
  border-radius: var(--var-border-radius, 0.3rem);
  margin: 0.4rem;
  cursor: pointer;
  color: var(--color-automator-docs-font);
  background-color: var(--color-automator-controls-inactive);
}
</style>
