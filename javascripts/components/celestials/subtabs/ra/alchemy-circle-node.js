"use strict";

Vue.component("alchemy-circle-node", {
  props: {
    node: Object,
    isFocused: false
  },
  data() {
    return {
      isReactionActive: false,
      amount: 0
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
      };
    },
    classObject() {
      return {
        "o-alchemy-node--base": this.isBaseResource,
        "o-alchemy-node--active": this.isReactionActive,
        "o-alchemy-node--unfocused": !this.isFocused,
      };
    }
  },
  methods: {
    update() {
      this.isReactionActive = !this.isBaseResource && this.node.resource.reaction.isActive;
      this.amount = this.resource.amount;
    }
  },
  template: `
    <div class="o-alchemy-node"
      :class="classObject"
      :style="layoutStyle"
      @mouseenter="$emit('mouseenter')"
      @mouseleave="$emit('mouseleave')"
      @click="emitClick"
    >{{resource.symbol}}
    <hint-text
      v-if="isFocused"
      class="o-hint-text--alchemy-node l-hint-text--alchemy-node"
    >
      {{amount.toFixed(0)}}
    </hint-text>
    </div>
  `
});
