"use strict";

Vue.component("alchemy-tab", {
  data() {
    return {
      resources: [],
      selectedResourceId: 0
    };
  },
  computed: {
    layout: () => new AlchemyCircleLayout(),
    sizeMultiplier: () => 5,
    selectedResource() {
      return AlchemyResources.all[this.selectedResourceId];
    },
    circleStyle() {
      const size = this.layout.size * this.sizeMultiplier;
      return {
        width: `${size}rem`,
        height: `${size}rem`
      };
    }
  },
  methods: {
    orbitSize(orbit) {
      const maxRadius = this.layout.orbits.map(o => o.radius).max();
      return `${(orbit.radius / maxRadius * 50)}%`;
    },
    handleHover(node) {
      this.selectedResourceId = node.resource.id;
    },
    handleClick(node) {
      const resource = node.resource;
      if (this.selectedResourceId !== resource.id) {
        this.selectedResourceId = resource.id;
        return;
      }
      if (resource.isBaseResource) return;
      resource.reaction.isActive = !resource.reaction.isActive;
      GameUI.update();
    }
  },
  template:
    `<div class="l-ra-alchemy-tab">
      <alchemy-resource-info :resource="selectedResource" />
      <div class="l-alchemy-circle" :style="circleStyle">
        <svg height="100%" width="100%" overflow="visible">
          <circle
            v-for="orbit in layout.orbits"
            :r="orbitSize(orbit)"
            cx="50%"
            cy="50%"
            stroke="black"
            stroke-width="1"
            fill="none"
          />
        </svg> 
        <alchemy-circle-node 
          v-for="(node, i) in layout.nodes"
          :key="i"
          :node="node"
          @hover="handleHover(node)"
          @click="handleClick(node)"
        />
      </div>
    </div>`
});

class AlchemyOrbitLayout {
  constructor(resources, radius, angleOffset = 0) {
    this._resources = resources;
    this._radius = radius;
    this._angleOffset = angleOffset;
  }

  get radius() {
    return this._radius;
  }

  get nodes() {
    const nodes = [];
    const step = Math.PI_2 / this._resources.length;
    let angle = this._angleOffset;
    for (const resource of this._resources) {
      nodes.push({
        resource,
        x: this._radius * Math.sin(angle),
        y: this._radius * Math.cos(angle)
      });
      angle += step;
    }
    return nodes;
  }
}

class AlchemyCircleLayout {
  constructor() {
    this.orbits = [
      new AlchemyOrbitLayout(AlchemyResources.all.slice(0, 5), 4),
      new AlchemyOrbitLayout(AlchemyResources.all.slice(5, 10), 3, Math.PI / 5),
      new AlchemyOrbitLayout(AlchemyResources.all.slice(10, 14), 2),
      new AlchemyOrbitLayout(AlchemyResources.all.slice(14, 20), 1),
      new AlchemyOrbitLayout(AlchemyResources.all.slice(20, 21), 0)
    ];
    const nodes = [];
    for (const orbitNodes of this.orbits.map(o => o.nodes)) {
      nodes.push(...orbitNodes);
    }
    const size = Math.max(
      nodes.map(p => Math.abs(p.x)).max(),
      nodes.map(p => Math.abs(p.y)).max()
    ) * 2;
    for (const node of nodes) {
      node.x = (node.x / size + 0.5) * 100;
      node.y = (node.y / size + 0.5) * 100;
    }
    this.nodes = nodes;
    this.size = size;
  }
}
