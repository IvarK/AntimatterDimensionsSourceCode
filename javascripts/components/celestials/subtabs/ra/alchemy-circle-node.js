"use strict";

Vue.component("alchemy-circle-node", {
  props: {
    node: Object
  },
  data() {
    return {
      isReactionActive: false
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
    reactionClass() {
      if (this.isBaseResource) {
        return "c-alchemy-node--base";
      }
      if (this.isReactionActive) {
        return "c-alchemy-node--active";
      }
      return undefined;
    }
  },
  methods: {
    update() {
      this.isReactionActive = !this.isBaseResource && this.node.resource.reaction.isActive;
    }
  },
  template: `
    <div class="c-alchemy-node"
      :class="reactionClass"
      :style="layoutStyle"
      @mouseenter="$emit('hover')"
      @click="emitClick"
    >
      {{ resource.symbol }}
    </div>
  `
});
