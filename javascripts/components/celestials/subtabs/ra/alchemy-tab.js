"use strict";

Vue.component("alchemy-tab", {
  data() {
    return {
      resources: []
    };
  },
  methods: {
    update() {
      this.resources = AlchemyResources.all;
      for (let i = 0; i < this.resources.length; i++) {
        const res = this.resources[i];
        const position = getNodePlacement(res.id);
        $(`alchemy-resource-${res.id}`).css("bottom", position.y);
        $(`alchemy-resource-${res.id}`).css("left", position.x);
      }
    },
    amount(resource) {
      return `${resource.name} (${resource.amount} ${resource.symbol})`;
    },
    reaction(resource) {
      return `${resource.reactionText}`;
    },
    id(resource) {
      return `alchemy-resource-${resource.id}`;
    }
  },
  computed: {
    alchemyResources() {
      return this.resources;
    }
  },
  template:
    `<div class="l-ra-alchemy-container">
      <div v-for="resource in alchemyResources">
        <div class="alchemy-node" v-bind:id="id(resource)">
          {{ resource.symbol }}
          <div class="alchemy-tooltip">
            {{ amount(resource) }}
            <br><br>
            {{ reaction(resource) }}
          </div>
        </div>
      </div>
    </div>`
});