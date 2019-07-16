"use strict";

Vue.component("alchemy-resource-info", {
  props: {
    resource: Object
  },
  data() {
    return {
      amount: 0,
      isReactionActive: false,
      reactionProduction: 0
    };
  },
  computed: {
    reaction() {
      return this.resource.reaction;
    },
    isBaseResource() {
      return this.resource.isBaseResource;
    },
    reactionText() {
      return this.resource.reactionText;
    },
    effectConfig() {
      const resource = this.resource;
      return {
        effect: () => resource.config.effect(resource.amount),
        formatEffect: resource.config.formatEffect
      };
    }
  },
  methods: {
    update() {
      this.amount = this.resource.amount;
      if (!this.isBaseResource) {
        this.isReactionActive = this.reaction.isActive;
        this.reactionProduction = this.reaction.production;
      }
    }
  },
  template: `
    <div class="c-alchemy-resource-info">
      <span>{{resource.symbol}} {{resource.name}}</span>
      <span>Current: {{ amount.toFixed(2) }}</span>
      <span v-if="isBaseResource">Base Resource</span>
      <span v-else>Reaction: {{isReactionActive ? "Active" : "Inactive"}} ({{reactionText}})</span>
      <effect-display title="Effect" :config="effectConfig" />
    </div>
  `
});
