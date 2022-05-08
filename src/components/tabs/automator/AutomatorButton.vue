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
  border: 0.2rem solid #767676;
  border-radius: 0.3rem;
  margin: 0.4rem;
  cursor: pointer;
  background-color: white;
}
</style>
