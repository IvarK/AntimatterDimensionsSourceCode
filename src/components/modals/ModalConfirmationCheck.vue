<script>
export default {
  name: "ModalConfirmationCheck",
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
    confirmationClass() {
      return {
        "c-modal__confirmation-toggle": true,
        "c-modal__confirmation-toggle--active": this.setting
      };
    },
    tooltipText() {
      return `${this.setting ? "Disable" : "Reenable"} the ${this.confirmation.name} confirmation`;
    },
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
  <div
    :class="confirmationClass"
    @click="toggle"
  >
    <span
      v-if="setting"
      class="fas fa-check"
    />
    <span
      v-else
      class="fas fa-times"
    />
    <div class="c-modal__confirmation-toggle__tooltip">
      {{ tooltipText }}
    </div>
  </div>
</template>
