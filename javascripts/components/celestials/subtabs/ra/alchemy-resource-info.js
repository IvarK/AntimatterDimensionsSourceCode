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
      if (this.resource === AlchemyResource.reality) return this.realityReactionText;
      const reagents = this.reaction.reagents
        .map(r => `${shorten(r.cost)}${r.resource.symbol}`)
        .join(" + ");
      return `${reagents} ➜ ${shorten(this.reaction.reactionProduction, 2, 2)}${this.resource.symbol}`;
    },
    realityReactionText() {
      const reagents = this.reaction.reagents
        .map(r => r.resource.symbol)
        .join(" + ");
      return `${reagents} ➜ ${this.resource.symbol}`;
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
      <span>Current: {{ shorten(amount, 2, 2) }}</span>
      <span v-if="isBaseResource">Base Resource</span>
      <span v-else>Reaction: {{isReactionActive ? "Active" : "Inactive"}} ({{reactionText}})</span>
      <effect-display title="Effect" :config="effectConfig" />
    </div>
  `
});
