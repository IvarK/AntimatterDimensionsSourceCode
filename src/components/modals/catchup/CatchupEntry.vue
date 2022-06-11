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
    <b>{{ info.name }}</b>: {{ description }}
  </div>
</template>
