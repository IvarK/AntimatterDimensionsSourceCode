<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";

export default {
  name: "ConfirmationOptionsEntry",
  components: {
    ModalOptionsToggleButton,
  },
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      option: false,
    };
  },
  computed: {
    entry() {
      return ConfirmationTypes[this.index];
    },
    name() {
      return `${this.entry.name}:`;
    },
  },
  watch: {
    option(newValue) {
      this.entry.option = newValue;
    },
  },
  created() {
    this.option = this.entry.option;
  },
  methods: {
    update() {
      const entry = this.entry;
      this.isUnlocked = entry.isUnlocked();
    }
  },
};
</script>

<template>
  <ModalOptionsToggleButton
    v-if="isUnlocked"
    v-model="option"
    :text="name"
  />
</template>
