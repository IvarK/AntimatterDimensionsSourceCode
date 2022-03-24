<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "OfflineSpeedupButton",
  components: {
    PrimaryButton,
  },
  props: {
    button: Object,
    progress: Object,
  },
  computed: {
    canBeClicked() {
      return this.button.condition(this.progress.current, this.progress.max);
    },
    buttonClass() {
      return {
        "o-primary-btn--width-medium": true,
        "o-primary-btn--disabled": !this.canBeClicked,
      };
    }
  },
  methods: {
    buttonClicked() {
      if (!this.canBeClicked) return;
      this.button.click();
    }
  },
};
</script>

<template>
  <PrimaryButton
    :class="buttonClass"
    @click="buttonClicked"
  >
    {{ button.text }}
  </PrimaryButton>
</template>