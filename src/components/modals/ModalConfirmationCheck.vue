<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModalConfirmationCheck",
  components: {
    PrimaryButton
  },
  props: {
    option: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      setting: true
    };
  },
  created() {
    this.setting = this.confirmation.option;
  },
  computed: {
    confirmation() {
      return ConfirmationTypes[this.option];
    },
    tooltipText() {
      return `${this.setting ? "Disable" : "Reenable"} the ${this.confirmation.name} confirmation`;
    }
  },
  methods: {
    toggle() {
      this.setting = !this.setting;
      this.confirmation.option = this.setting;
    }
  }
};
</script>

<template>
  <PrimaryButton
    v-tooltip="tooltipText"
    class="c-modal__confirmation-check"
    @click="toggle"
  >
    <template v-if="!setting">
      &times;
    </template>
  </PrimaryButton>
</template>
