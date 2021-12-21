<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";
import AwayProgressEntry from "@/components/modals/AwayProgressEntry";

export default {
  name: "AwayProgressModal",
  components: {
    AwayProgressEntry,
    ModalCloseButton,
  },
  props: {
    modalConfig: {
      type: Object,
      required: true
    }
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
    before() {
      return this.modalConfig.playerBefore;
    },
    after() {
      return this.modalConfig.playerAfter;
    },
    offlineStats() {
      return AwayProgressTypes.appearsInAwayModal;
    },
    headerText() {
      const timeDisplay = TimeSpan.fromSeconds(this.modalConfig.seconds).toString();
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
  <div class="c-modal-away-progress">
    <ModalCloseButton @click="emitClose" />
    <div class="c-modal-away-progress__header">
      {{ headerText }}
    </div>
    <div
      v-if="!nothingHappened"
      class="c-modal-away-progress__resources"
    >
      <AwayProgressEntry
        v-for="name of offlineStats"
        :key="name"
        :name="name"
        :player-before="before"
        :player-after="after"
        @something-happened="somethingHappened = true"
      />
    </div>
    <span v-if="!nothingHappened">Note: Click an entry to hide it in the future.</span>
  </div>
</template>
