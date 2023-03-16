<script>
import AwayProgressEntry from "@/components/modals/AwayProgressEntry";
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "AwayProgressModal",
  components: {
    AwayProgressEntry,
    ModalWrapper,
  },
  props: {
    playerBefore: {
      type: Object,
      required: true,
    },
    playerAfter: {
      type: Object,
      required: true,
    },
    seconds: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      somethingHappened: false,
    };
  },
  computed: {
    nothingHappened() {
      return Theme.current().name === "S9";
    },
    offlineStats() {
      return AwayProgressTypes.appearsInAwayModal;
    },
    headerText() {
      const timeDisplay = TimeSpan.fromSeconds(this.seconds).toString();
      if (this.nothingHappened || !this.somethingHappened) {
        return `While you were away for ${timeDisplay}... Nothing happened.`;
      }
      return `While you were away for ${timeDisplay}: `;
    },
  },
  mounted() {
    this.$nextTick(() => {
      // After all the children have been loaded, check if somethingHappened - if not, give them the achievement!
      if (this.nothingHappened || !this.somethingHappened) SecretAchievement(36).unlock();
    });
  },
};
</script>

<template>
  <ModalWrapper class="c-modal-away-progress">
    <div class="c-modal-away-progress__header">
      {{ headerText }}
    </div>
    <div
      v-if="!nothingHappened"
      class="c-modal-away-progress__resources c-modal--short"
    >
      <AwayProgressEntry
        v-for="name of offlineStats"
        :key="name"
        :name="name"
        :player-before="playerBefore"
        :player-after="playerAfter"
        @something-happened="somethingHappened = true"
      />
    </div>
    <span v-if="!nothingHappened && somethingHappened">Note: Click an entry to hide it in the future.</span>
  </ModalWrapper>
</template>

<style scoped>
.c-modal-away-progress__resources div {
  min-width: 55rem;
  border-bottom: 0.1rem solid var(--color-text);
  margin-bottom: 0.2rem;
  padding-bottom: 0.2rem;
  cursor: pointer;
}

.c-modal-away-progress__resources div:last-child {
  border: none;
}
</style>
