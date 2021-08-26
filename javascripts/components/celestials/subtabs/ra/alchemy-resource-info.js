"use strict";

Vue.component("alchemy-resource-info", {
  props: {
    resource: Object
  },
  data() {
    return {
      amount: 0,
      flow: 0,
      isReactionActive: false,
      reactionProduction: 0,
      isUnlocked: false,
      unlockRequirement: ""
    };
  },
  computed: {
    classObject() {
      return {
        "c-alchemy-resource-info": true,
        "c-alchemy-resource-info--locked": !this.isUnlocked
      };
    },
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
        effect: () => resource.effectValue,
        formatEffect: resource.config.formatEffect
      };
    },
    resourceAmount() {
      return formatFloat(this.amount, 1);
    },
    formattedFlow() {
      const sign = this.flow >= 0 ? "+" : "-";
      if (Math.abs(this.flow) < 0.01) return "None";
      return `${sign}${format(Math.abs(this.flow), 2, 2)}/sec`;
    }
  },
  methods: {
    update() {
      const resource = this.resource;
      this.amount = resource.amount;
      this.flow = resource.flow;
      this.isUnlocked = resource.isUnlocked;
      this.unlockRequirement = resource.lockText;
      if (!this.isBaseResource) {
        this.isReactionActive = this.reaction.isActive;
        this.reactionProduction = this.reaction.production;
      }
    }
  },
  template: `
    <div :class="classObject" v-if="isUnlocked">
      <span class="c-alchemy-resource-info__title">
        {{ resource.symbol }} {{ resource.name }} {{ resource.symbol }}
      </span>
      <span>Current: {{ resourceAmount }} (Recent change: {{ formattedFlow }})</span>
      <span v-if="isBaseResource">Base Resource</span>
      <span v-else>Reaction: {{ isReactionActive ? "Active" : "Inactive" }} ({{ reactionText }})</span>
      <span><effect-display title="Effect" :config="effectConfig" /></span>
    </div>
    <div :class="classObject" v-else>
      Unlock requirement: {{ unlockRequirement }}
    </div>`
});
