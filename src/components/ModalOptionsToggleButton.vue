<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ModalOptionsToggleButton",
  components: {
    PrimaryToggleButton
  },
  props: {
    isWide: {
      type: Boolean,
      required: false,
      default: true,
    },
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    classObject() {
      return {
        "o-primary-btn--option": !this.isWide,
        "o-primary-btn--option-wide": this.isWide,
      };
    }
  }
};
</script>

<template>
  <PrimaryToggleButton
    :value="value"
    :label="text"
    :class="classObject"
    @input="emitInput"
  />
</template>
