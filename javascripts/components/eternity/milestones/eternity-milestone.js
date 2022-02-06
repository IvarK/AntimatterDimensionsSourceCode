Vue.component("eternity-milestone", {
  props: {
    getMilestone: Function
  },
  data() {
    return {
      isReached: false,
      isObsoleteWithPelle: false
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
  },
  methods: {
    update() {
      this.isReached = this.milestone.isReached;
      this.isObsoleteWithPelle = this.config.pelleObsolete?.();
    }
  },
  template: `
    <div class="l-eternity-milestone" v-if="!this.config.invisible">
      <span class="o-eternity-milestone__goal">
        {{ quantifyInt("Eternity", eternities) }}:
      </span>
      <button
        :class="rewardClassObject"
        v-tooltip="activeCondition"
      >
        {{ reward }} {{ isObsoleteWithPelle ? "(This is already granted by Pelle)" : ""}}
      </button>
    </div>`
});
