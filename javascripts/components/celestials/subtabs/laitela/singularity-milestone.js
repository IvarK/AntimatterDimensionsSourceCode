"use strict";

Vue.component("singularity-milestone", {
  props: ["milestone"],
  data: () => ({
    isMaxed: false,
    progressToNext: "",
    remainingSingularities: 0,
    description: "",
    effectDisplay: "",
    isUnique: false,
    nextEffectDisplay: "",
    completions: 0,
    limit: 0
  }),
  methods: {
    update() {
      this.isMaxed = this.milestone.isMaxed;
      this.progressToNext = this.milestone.progressToNext;
      this.remainingSingularities = this.milestone.remainingSingularities;
      this.description = this.milestone.description;
      this.effectDisplay = this.milestone.effectDisplay;
      this.isUnique = this.milestone.isUnique;
      if (!this.isUnique && !this.isMaxed) this.nextEffectDisplay = this.milestone.nextEffectDisplay;
      this.completions = this.milestone.completions;
      this.limit = this.milestone.limit;
    },
  },
  computed: {
    milestoneProgressStyles() {
      if (this.isMaxed) return { background: "#38ca38", width: "100%" };
      return { width: this.progressToNext };
    }
  },
  template: `
    <div class="c-laitela-milestone">
        <div class="c-laitela-milestone__progress" :style="milestoneProgressStyles"></div>
        <b v-if="!isMaxed">
          In {{ format(remainingSingularities, 2, 0) }} 
          {{ "Singularity" | pluralize(remainingSingularities, "Singularities")}}
        </b>
        <p> {{ description }}</p>
        <br>
        <b>
            {{ effectDisplay }} 
            <span v-if="!isUnique && !isMaxed">-> {{ nextEffectDisplay }}</span>
        </b>
        <div class="c-laitela-milestone__completions">
            {{ completions }}/{{ limit === 0 ? "∞" : limit }} completions
        </div>
    </div>
    `
});
