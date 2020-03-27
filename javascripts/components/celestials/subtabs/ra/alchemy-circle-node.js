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
      isUnlocked: false
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
      const scaledFlow = Math.clamp(0.7 * Math.sqrt(Math.abs(this.flow)), 0, 1);
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
        "o-alchemy-node--locked": !this.isUnlocked,
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
      this.isUnlocked = this.resource.isUnlocked;
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
      <span v-if="isUnlocked">
        <hint-text type="alchemy"
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
      fillFraction: 0,
    };
  },
  computed: {
    spinnerTransform() {
      return {
        transform: `rotate(${this.fillFraction * 360}deg)`,
        background: this.fillFraction === 1 ? "#ff9800" : undefined
      };
    },
    fillerTransform() {
      return {
        opacity: this.fillFraction > 0.5 ? 1 : 0,
        background: this.fillFraction === 1 ? "#ff9800" : undefined
      };
    },
    maskTransform() {
      return {
        opacity: this.fillFraction > 0.5 ? 0 : 1
      };
    }
  },
  methods: {
    update() {
      this.amount = this.resource.amount;
      this.fillFraction = Math.clamp(this.amount / estimatedAlchemyCap(), 0, 1);
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
