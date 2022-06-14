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
  <div class="c-modal-catchup-entry">
    <span class="c-resource-name">{{ info.name }}</span>: {{ description }}
  </div>
</template>

<style scoped>
.c-resource-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.c-modal-catchup-entry {
  border-top: 0.1rem solid var(--color-text);
  padding: 0.5rem 0 0.5rem 1.5rem;
  cursor: default;
}

.c-modal-catchup-entry:nth-child(1) {
  border-top: none;
}
</style>
