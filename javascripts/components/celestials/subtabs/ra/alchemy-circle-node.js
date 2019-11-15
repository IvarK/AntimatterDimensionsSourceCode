"use strict";

Vue.component("alchemy-circle-node", {
  props: {
    node: Object,
    isFocused: false
  },
  data() {
    return {
      isReactionActive: false,
      amount: 0,
      flow: 0,
      alwaysShowResource: false,
      unlocked: false
    };
  },
  computed: {
    resource() {
      return this.node.resource;
    },
    isBaseResource() {
      return this.resource.isBaseResource;
    },
    layoutStyle() {
      const scaledFlow = Math.clamp(0.4 * Math.sqrt(Math.abs(this.flow)), 0, 1);
      return {
        left: `${this.node.x}%`,
        top: `${this.node.y}%`,
        "box-shadow": `0 0 0.3rem 0.3rem
          rgba(${this.flow > 0 ? "156, 204, 101" : "204, 102, 102"}, ${scaledFlow})`
      };
    },
    classObject() {
      return {
        "o-alchemy-node--base": this.isBaseResource,
        "o-alchemy-node--active": this.isReactionActive,
        "o-alchemy-node--unfocused": !this.isFocused,
        "o-alchemy-node--locked": !this.unlocked,
      };
    },
    hintClassObject() {
      return this.isFocused ? undefined : "o-hint-text--alchemy-node--unfocused";
    }
  },
  methods: {
    update() {
      this.isReactionActive = !this.isBaseResource && this.node.resource.reaction.isActive;
      this.amount = this.resource.amount;
      this.flow = this.resource.flow;
      this.unlocked = this.resource.isUnlocked;
      this.alwaysShowResource = player.options.showAlchemyResources;
    }
  },
  template: `
    <div class="o-alchemy-node"
      :style="layoutStyle"
      :class="classObject"
      @mouseenter="$emit('mouseenter')"
      @mouseleave="$emit('mouseleave')"
      @click="emitClick"
    >
      <alchemy-resource-arc
        :resource="resource"
        :classObject="classObject"
      />
      <span v-if="unlocked">
        <div v-if="alwaysShowResource"
          class="o-alchemy-node-resource--always-visible">
          {{ amount.toFixed(1) }}
        </div>
        <hint-text v-else
          :class="hintClassObject"
          class="o-hint-text--alchemy-node l-hint-text--alchemy-node">
          {{ amount.toFixed(1) }}
        </hint-text>
      </span>
    </div>
  `
});

Vue.component("alchemy-resource-arc", {
  props: {
    resource: Object,
    classObject: Object
  },
  data() {
    return {
      amount: 0,
    };
  },
  computed: {
    spinnerTransform() {
      return {
        transform: `rotate(${this.amount / Ra.alchemyResourceCap * 360}deg)`,
        background: this.amount === Ra.alchemyResourceCap ? "#ff9800" : undefined
      };
    },
    fillerTransform() {
      return {
        opacity: this.amount / Ra.alchemyResourceCap > 0.5 ? 1 : 0,
        background: this.amount === Ra.alchemyResourceCap ? "#ff9800" : undefined
      };
    },
    maskTransform() {
      return {
        opacity: this.amount / Ra.alchemyResourceCap > 0.5 ? 0 : 1
      };
    }
  },
  methods: {
    update() {
      this.amount = this.resource.amount;
    }
  },
  template: `
      <div class="o-alchemy-resource-arc-wrapper">
        <div class="o-alchemy-resource-arc-spinner o-alchemy-resource-arc-circle" :style="spinnerTransform"></div>
        <div class="o-alchemy-resource-arc-filler o-alchemy-resource-arc-circle" :style="fillerTransform"></div>
        <div class="o-alchemy-resource-arc-mask" :style="maskTransform"></div>
        <div class="o-alchemy-node-mask" :class="classObject">
          {{ resource.symbol }}
        </div>
      </div>`
});
