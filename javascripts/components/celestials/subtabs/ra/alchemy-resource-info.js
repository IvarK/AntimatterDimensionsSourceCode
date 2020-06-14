"use strict";

Vue.component("alchemy-resource-info", {
  props: {
    resource: Object
  },
  data() {
    return {
      amount: 0,
      isReactionActive: false,
      reactionProduction: 0,
      isUnlocked: false,
      unlockRequirement: ""
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
        .map(r => `${format(r.cost)}${r.resource.symbol}`)
        .join(" + ");
      return `${reagents} ➜ ${format(this.reaction.reactionProduction, 2, 2)}${this.resource.symbol}`;
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
    },
    resourceAmount() {
      return formatFloat(this.amount, 1);
    }
  },
  methods: {
    update() {
      this.amount = this.resource.amount;
      this.isUnlocked = this.resource.isUnlocked;
      this.unlockRequirement = this.resource.config.lockText;
      if (!this.isBaseResource) {
        this.isReactionActive = this.reaction.isActive;
        this.reactionProduction = this.reaction.production;
      }
    }
  },
  template: `
    <div class="c-alchemy-resource-info">
      <span>{{isUnlocked ? resource.symbol : "?"}} {{resource.name}}</span>
      <span>Current: {{ isUnlocked ? resourceAmount : "Locked!" }}</span>
      <span v-if="isBaseResource">Base Resource</span>
      <span v-else>Reaction: {{isReactionActive ? "Active" : "Inactive"}} ({{isUnlocked ? reactionText : "???"}})</span>
      <span v-if="isUnlocked"><effect-display title="Effect" :config="effectConfig" /></span>
      <span v-else>Unlock requirement: {{unlockRequirement}}</span>
    </div>
  `
});
