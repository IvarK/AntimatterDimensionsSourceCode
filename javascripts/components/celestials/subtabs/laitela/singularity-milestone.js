"use strict";

Vue.component("singularity-milestone", {
    props: ["milestone"],
    methods: {
        milestoneProgressStyles() {
            if (this.milestone.isMaxed) return { background: "#38ca38", width: "100%" };
            return { width: this.milestone.progressToNext };
        }
    },
    template: `
    <div class="c-laitela-milestone">
        <div class="c-laitela-milestone__progress" :style="milestoneProgressStyles()"></div>
        <b v-if="!milestone.isMaxed"> In {{ format(milestone.remainingSingularities, 2, 0) }} Singularities</b>
        <p> {{ milestone.description }}</p>
        <br>
        <b>
            {{ milestone.effectDisplay }} 
            <span v-if="!milestone.isUnique && !milestone.isMaxed">-> {{milestone.nextEffectDisplay}}</span>
        </b>
        <div class="c-laitela-milestone__completions">
            {{ milestone.completions }}/{{milestone.limit === 0 ? "∞" : milestone.limit }} completions
        </div>
    </div>
    `
});