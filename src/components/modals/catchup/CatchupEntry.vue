<script>
export default {
  name: "CatchupEntry",
  props: {
    info: {
      type: Object,
      required: true
    },
  },
  computed: {
    description() {
      return typeof this.info.description === "function" ? this.info.description() : this.info.description;
    }
  }
};
</script>

<template>
  <div
    class="c-modal-away-progress__resources"
  >
    <span class="c-resource-name">{{ info.name }}</span>: {{ description }}
  </div>
</template>

<style scoped>
.c-resource-name {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
