import EffectDisplay from "@/components/EffectDisplay";

Vue.component("alchemy-resource-info", {
  components: {
    EffectDisplay
  },
  props: {
    resource: Object
  },
  data() {
    return {
      amount: 0,
      cap: 0,
      capped: false,
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
    resourceCap() {
      return formatFloat(this.cap, 1);
    },
    formattedFlow() {
      const sign = this.flow >= 0 ? "+" : "-";
      if (Math.abs(this.flow) < 0.01) return "None";
      const resourceText = `${sign}${format(Math.abs(this.flow), 2, 2)}/sec`;
      const color = this.flow > 0 ? "9CCC65" : "CC6666";
      return `<span style="color:#${color}">${resourceText}</span>`;
    }
  },
  methods: {
    update() {
      const resource = this.resource;
      this.amount = resource.amount;
      this.cap = resource.cap;
      this.capped = resource.capped;
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
      <span>
        {{ capped ? "Capped" : "Current" }}: {{ resourceAmount }}/{{ resourceCap }}
        (Recent change: <span v-html="formattedFlow" />)
      </span>
      <span v-if="isBaseResource">Base Resource</span>
      <span v-else>Reaction: {{ isReactionActive ? "Active" : "Inactive" }} ({{ reactionText }})</span>
      <span>
        <EffectDisplay
          label="Effect"
          :config="effectConfig"
        />
      </span>
    </div>
    <div :class="classObject" v-else>
      Unlock requirement: {{ unlockRequirement }}
    </div>`
});
