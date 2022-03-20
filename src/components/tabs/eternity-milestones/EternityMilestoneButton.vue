<script>
export default {
  name: "EternityMilestoneButton",
  props: {
    getMilestone: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isReached: false,
      isLocked: false,
      isDoomed: false,
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    config() {
      return this.milestone.config;
    },
    eternities() {
      return this.config.eternities;
    },
    reward() {
      const reward = this.config.reward;
      return typeof reward === "function" ? reward() : reward;
    },
    rewardClassObject() {
      return {
        "o-eternity-milestone__reward": true,
        "o-eternity-milestone__reward--locked": !this.isReached,
        "o-eternity-milestone__reward--reached": this.isReached,
        "o-eternity-milestone__reward--small-font": this.reward.length > 80
      };
    },
    activeCondition() {
      return this.config.activeCondition ? this.config.activeCondition() : null;
    },
    disabledInDoomed() {
      return this.isDoomed && this.config.pelleUseless;
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isLocked = this.isDoomed && !(this.config.pelleObsolete?.() ?? true);
      this.isReached = this.milestone.isReached && !this.isLocked;
    }
  }
};
</script>

<template>
  <div
    v-if="!config.invisible"
    class="l-eternity-milestone"
  >
    <span class="o-eternity-milestone__goal">
      {{ quantifyInt("Eternity", eternities) }}:
    </span>
    <button
      v-tooltip="activeCondition"
      :class="rewardClassObject"
    >
      <span v-if="disabledInDoomed">This milestone has no effect while in Doomed</span>
      <span v-else>
        {{ reward }} {{ isLocked ? "(Locked behind a Pelle Upgrade)" : "" }}
      </span>
    </button>
  </div>
</template>

<style scoped>

</style>
