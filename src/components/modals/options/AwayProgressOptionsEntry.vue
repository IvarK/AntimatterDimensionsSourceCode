<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";

export default {
  name: "AwayProgressOptionsEntry",
  components: {
    ModalOptionsToggleButton,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      setting: false,
      isVisible: false,
    };
  },
  computed: {
    type() {
      return AwayProgressTypes.all[this.name];
    },
    text() {
      return `${this.type.formatName}:`;
    }
  },
  watch: {
    setting(newValue) {
      this.type.option = newValue;
    },
  },
  methods: {
    update() {
      const type = this.type;
      this.setting = type.option;
      this.isVisible = type.isUnlocked();
    }
  },
};
</script>

<template>
  <ModalOptionsToggleButton
    v-if="isVisible"
    v-model="setting"
    :text="text"
  />
</template>
