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
      flow: 0
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
      return {
        left: `${this.node.x}%`,
        top: `${this.node.y}%`,
        "box-shadow": `0px 0px 3px 3px
          rgb(${this.flow > 0 ? 255 - Math.floor(Math.clamp(100 * Math.sqrt(this.flow), 0, 255)) : 255},
          ${255 - Math.floor(Math.clamp(100 * Math.sqrt(Math.abs(this.flow)), 0, 255))},
          ${this.flow < 0 ? 255 - Math.floor(Math.clamp(100 * Math.sqrt(-this.flow), 0, 255)) : 255})`
      };
    },
    classObject() {
      return {
        "o-alchemy-node--base": this.isBaseResource,
        "o-alchemy-node--active": this.isReactionActive,
        "o-alchemy-node--unfocused": !this.isFocused,
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
    }
  },
  template: `
    <div class="o-alchemy-node"
      :class="classObject"
      :style="layoutStyle"
      @mouseenter="$emit('mouseenter')"
      @mouseleave="$emit('mouseleave')"
      @click="emitClick">
    {{resource.symbol}}
    <hint-text
      :class="hintClassObject"
      class="o-hint-text--alchemy-node l-hint-text--alchemy-node">
      {{ amount.toFixed(1) }}
    </hint-text>
    </div>
  `
});
