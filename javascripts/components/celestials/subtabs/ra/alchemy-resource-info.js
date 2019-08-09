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
      const resource = this.resource;
      if (resource.reaction === null) return "Base Resource";
      const isReality = resource.reaction._product.id === ALCHEMY_RESOURCE.REALITY;
      const reagentStrings = [];
      for (const reagent of resource.reaction._reagents) {
        reagentStrings.push(`${isReality ? "" : reagent.cost}${reagent.resource.symbol}`);
      }
      const product = Math.floor(100 * resource.reaction.baseProduction * resource.reaction.reactionEfficiency) / 100;
      return `${reagentStrings.join(" + ")} ➜ ${isReality ? "" : product}${resource.reaction._product.symbol}`;
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
