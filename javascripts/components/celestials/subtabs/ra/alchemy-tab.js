"use strict";

class AlchemyOrbitLayout {
  constructor(tier, radius, angleOffset = 0) {
    this._resources = AlchemyResources.all
      .filter(y => y.config.tier === tier)
      .sort((x, y) => x.config.uiOrder - y.config.uiOrder);
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
      new AlchemyOrbitLayout(1, 4, -Math.PI / 5),
      new AlchemyOrbitLayout(2, 3),
      new AlchemyOrbitLayout(3, 2, Math.PI / 3),
      new AlchemyOrbitLayout(4, 1),
      new AlchemyOrbitLayout(5, 0)
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
    const reactionArrows = [];
    for (const reaction of AlchemyReactions.all.compact()) {
      const productNode = nodes
        .find(n => n.resource === reaction.product);
      const reagentNodes = reaction.reagents
        .map(r => nodes.find(n => n.resource === r.resource));
      for (const reagentNode of reagentNodes) {
        reactionArrows.push({
          reaction,
          reagent: reagentNode,
          product: productNode,
        });
      }
    }
    this.reactionArrows = reactionArrows;
    this.nodes = nodes;
    this.size = size;
  }
}

Vue.component("alchemy-tab", {
  data() {
    return {
      infoResourceId: 0,
      focusedResourceId: -1,
      realityCreationAvailable: false,
      alwaysShowResource: false,
      reactionProgress: 0,
    };
  },
  computed: {
    resources: () => AlchemyResources.all,
    layout: () => new AlchemyCircleLayout(),
    sizeMultiplier: () => 5,
    infoResource() {
      return this.resources[this.infoResourceId];
    },
    circleStyle() {
      const size = this.layout.size * this.sizeMultiplier;
      return {
        width: `${size}rem`,
        height: `${size}rem`
      };
    },
    orbitClass() {
      return this.focusedResourceId === -1 ? undefined : "o-alchemy-orbit--unfocused";
    }
  },
  methods: {
    update() {
      this.realityCreationAvailable = AlchemyResource.reality.amount !== 0;
      this.alwaysShowResource = player.options.showAlchemyResources;
      const animationTime = 800;
      this.reactionProgress = (player.realTimePlayed % animationTime) / animationTime;
    },
    orbitSize(orbit) {
      const maxRadius = this.layout.orbits.map(o => o.radius).max();
      return `${(orbit.radius / maxRadius * 50)}%`;
    },
    handleMouseEnter(node) {
      this.infoResourceId = node.resource.id;
      this.focusedResourceId = node.resource.id;
    },
    handleMouseLeave() {
      this.focusedResourceId = -1;
    },
    handleClick(node) {
      const resource = node.resource;
      if (this.infoResourceId !== resource.id) {
        this.infoResourceId = resource.id;
        this.focusedResourceId = resource.id;
        return;
      }
      if (resource.isBaseResource) return;
      resource.reaction.isActive = !resource.reaction.isActive;
      GameUI.update();
    },
    isCapped(reactionArrow) {
      return reactionArrow.product.resource.amount >= reactionArrow.reagent.resource.amount;
    },
    isActiveReaction(reactionArrow) {
      return reactionArrow.reaction.isActive;
    },
    isFocusedReaction(reactionArrow) {
      return reactionArrow.reaction.product.id === this.focusedResourceId;
    },
    isDisplayed(reactionArrow) {
      return this.isActiveReaction(reactionArrow) || this.isFocusedReaction(reactionArrow);
    },
    isFocusedNode(node) {
      if (this.focusedResourceId === -1) return true;
      const focusedResource = this.resources[this.focusedResourceId];
      if (focusedResource === node.resource) return true;
      if (focusedResource.isBaseResource) return false;
      return focusedResource.reaction.reagents
        .some(r => r.resource === node.resource);
    },
    reactionArrowPositions(reactionArrow) {
      if (!this.isDisplayed(reactionArrow) || this.isCapped(reactionArrow)) return undefined;
      const xStart = reactionArrow.reagent.x;
      const yStart = reactionArrow.reagent.y;
      const xEnd = reactionArrow.product.x;
      const yEnd = reactionArrow.product.y;
      const pathLength = Math.sqrt(Math.pow(xEnd - xStart, 2) + Math.pow(yEnd - yStart, 2));
      const leadPoint = Math.max(0, this.reactionProgress - 3 / pathLength);
      const trailPoint = Math.min(1, this.reactionProgress + 3 / pathLength);
      return {
        x1: `${xStart * (1 - leadPoint) + xEnd * leadPoint}%`,
        y1: `${yStart * (1 - leadPoint) + yEnd * leadPoint}%`,
        x2: `${xStart * (1 - trailPoint) + xEnd * trailPoint}%`,
        y2: `${yStart * (1 - trailPoint) + yEnd * trailPoint}%`,
      };
    },
    reactionArrowPaths(reactionArrow) {
      return {
        x1: `${reactionArrow.reagent.x}%`,
        y1: `${reactionArrow.reagent.y}%`,
        x2: `${reactionArrow.product.x}%`,
        y2: `${reactionArrow.product.y}%`,
      };
    },
    reactionPathClass(reactionArrow) {
      return {
        "o-alchemy-reaction-path": true,
        "o-alchemy-reaction-path--limited": this.isCapped(reactionArrow) && this.isDisplayed(reactionArrow),
        "o-alchemy-reaction-path--focused": !this.isCapped(reactionArrow) && this.isFocusedReaction(reactionArrow),
      };
    },
    reactionArrowClass(reactionArrow) {
      return {
        "o-alchemy-reaction-arrow": !this.isCapped(reactionArrow) && this.isDisplayed(reactionArrow),
        "o-alchemy-reaction-arrow--focused": this.isFocusedReaction(reactionArrow),
      };
    },
    toggleResourceVisibility() {
      player.options.showAlchemyResources = !player.options.showAlchemyResources;
    },
    showAlchemyHowTo() {
      Modal.message.show("You can now refine glyphs using \"Alchemy Mode\" in the glyph auto-sacrifice settings. " +
        "Refined glyphs will give 1% of their level in alchemy resources. Alchemy reactions can be toggled on " +
        "and off by clicking the respective nodes, and each resource gives its own boost to various resources " +
        "in the game. Basic resource totals are limited to the level of the refined glyph, and compound resource " +
        "totals are limited to the amount of the reactants. All active alchemy reactions are applied once per " +
        "reality, unaffected by amplification. You can show the current" +
        "totals of all alchemy resources by holding shift.");
    },
    setAllReactions(value) {
      for (const reaction of AlchemyReactions.all.compact()) {
        reaction.isActive = value;
      }
    }
  },
  template:
    `<div class="l-ra-alchemy-tab">
      <div @click="showAlchemyHowTo()" class="o-primary-btn">Click for alchemy info</div>
      <alchemy-resource-info :key="infoResourceId" :resource="infoResource" />
      <div>
        <input type="checkbox"
          id="alwaysShowResourceBox"
          v-model="alwaysShowResource"
          :value="alwaysShowResource"
          @input="toggleResourceVisibility()">
        <label for="alwaysShowResourceBox">Always show resource totals</label>
      </div>
      <div class="l-alchemy-circle" :style="circleStyle">
        <svg class="l-alchemy-orbit-canvas">
          <circle
            v-for="orbit in layout.orbits"
            cx="50%"
            cy="50%"
            class="o-alchemy-orbit"
            :r="orbitSize(orbit)"
            :class="orbitClass"
          />
        </svg> 
        <alchemy-circle-node 
          v-for="(node, i) in layout.nodes"
          :key="i"
          :node="node"
          :isFocused="isFocusedNode(node)"
          @mouseenter="handleMouseEnter(node)"
          @mouseleave="handleMouseLeave"
          @click="handleClick(node)"
        />
        <svg class="l-alchemy-arrow-canvas">
          <line
            v-for="reactionArrow in layout.reactionArrows"
            v-bind="reactionArrowPaths(reactionArrow)"
            :class="reactionPathClass(reactionArrow)"
          />
          <line
            v-for="reactionArrow in layout.reactionArrows"
            v-bind="reactionArrowPositions(reactionArrow)"
            :class="reactionArrowClass(reactionArrow)"
          />
        </svg> 
      </div>
      <button class="o-primary-btn" @click="setAllReactions(true)">Turn on all reactions</button>
      <button class="o-primary-btn" @click="setAllReactions(false)">Turn off all reactions</button>
      <primary-button
        v-if="realityCreationAvailable"
        class="o-primary-btn"
        onclick="Modal.realityGlyph.show()">Create a Reality glyph</primary-button>
    </div>`
});
