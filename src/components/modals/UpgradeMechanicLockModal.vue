<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UpgradeMechanicLockModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    },
    isImaginary: {
      type: Boolean,
      required: true,
    },
    specialLockText: {
      type: String,
      required: false,
      default: null,
    }
  },
  computed: {
    upgradeStr() {
      return this.isImaginary ? "Imaginary Upgrade" : "Reality Upgrade";
    },
    lockEvent() {
      return this.specialLockText ?? this.upgrade.lockEvent;
    }
  },
  methods: {
    disableLock() {
      this.upgrade.setMechanicLock(false);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="disableLock"
  >
    <template #header>
      {{ upgradeStr }} Condition Lock
    </template>
    <div class="c-modal-message__text">
      Are you sure you wish to {{ lockEvent }}? Doing this right now will cause you to
      <span class="l-emphasis">
        fail the requirement for the {{ upgradeStr }} "{{ upgrade.name }}"
      </span>
      <span :ach-tooltip="upgrade.requirement">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      <br>
      Selecting "Cancel" will close this modal with no effect, while selecting "Disable Lock" will disable the
      requirement check for this upgrade and prevent this message from reappearing unless you turn it back on.
      <br>
      <br>
      Neither of these options will perform the action you just attempted, so you will need to try again.
    </div>
    <template #confirm-text>
      Disable Lock
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-emphasis {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
