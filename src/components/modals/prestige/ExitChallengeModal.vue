<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitChallengeModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    challengeName: {
      type: String,
      required: true,
    },
    normalName: {
      type: String,
      required: true,
    },
    hasHigherLayers: {
      type: Boolean,
      required: true,
    },
    exitFn: {
      type: Function,
      required: true,
    }
  },
  computed: {
    isCelestial() {
      return this.challengeName.match("Reality");
    },
    isRestarting() {
      return this.isCelestial ? player.options.retryCelestial : player.options.retryChallenge;
    }
  },
  methods: {
    handleYesClick() {
      this.exitFn();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="exitChallenge"
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to {{ isRestarting ? "restart" : "exit" }} {{ challengeName }}
    </template>

    <div class="c-modal-message__text">
      <span v-if="isRestarting">
        You will immediately re-enter {{ challengeName }} again after confirming this modal.
      </span>
      <span v-else>
        This will place you back into a regular {{ normalName }} without any restrictions.
      </span>
      <span v-if="hasHigherLayers">
        Other effects coming from higher-layer restrictions will still continue to apply.
      </span>
    </div>
    <template #confirm-text>
      {{ isRestarting ? "Restart" : "Exit" }}
    </template>
  </ModalWrapperChoice>
</template>
