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
    },
    amount(resource) {
      return `${resource.name} (${resource.amount} ${resource.symbol})`;
    },
    reaction(resource) {
      return `${resource.reactionText}`;
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
        <div class="alchemy-tooltip">
          {{ resource.symbol }}
          <div class="alchemy-tooltip-text">
            {{ amount(resource) }} <br>
            {{ reaction(resource) }}
          </div>
        </div>
      </div>
    </div>`
});