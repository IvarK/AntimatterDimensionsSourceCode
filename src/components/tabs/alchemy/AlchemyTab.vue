<script>
import { AlchemyCircleLayout } from "./alchemy-circle-layout";
import AlchemyCircleNode from "./AlchemyCircleNode";
import AlchemyResourceInfo from "./AlchemyResourceInfo";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "AlchemyTab",
  components: {
    PrimaryButton,
    AlchemyCircleNode,
    AlchemyResourceInfo
  },
  data() {
    return {
      infoResourceId: 0,
      focusedResourceId: -1,
      reactionsAvailable: false,
      realityCreationVisible: false,
      animationTimer: 0,
      alchemyCap: 0,
      capFactor: 0,
      createdRealityGlyph: false,
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
    },
    realityGlyphCreationClass() {
      return {
        "o-primary-btn--subtab-option": true,
        "tutorial--glow": !this.createdRealityGlyph
      };
    },
  },
  methods: {
    update() {
      this.reactionsAvailable = AlchemyResources.all.filter(res => !res.isBaseResource && res.isUnlocked).length !== 0;
      this.realityCreationVisible = Ra.pets.effarig.level === 25;
      this.animationTimer += 35;
      this.alchemyCap = Ra.alchemyResourceCap;
      this.capFactor = 1 / GlyphSacrificeHandler.glyphRefinementEfficiency;
      this.createdRealityGlyph = player.reality.glyphs.createdRealityGlyph;
    },
    orbitSize(orbit) {
      const maxRadius = this.layout.orbits.map(o => o.radius).max();
      return `${(orbit.radius / maxRadius * 50)}%`;
    },
    handleMouseEnter(node) {
      this.infoResourceId = node.resource.id;
      if (node.resource.isUnlocked) {
        this.focusedResourceId = node.resource.id;
      }
    },
    handleMouseLeave() {
      this.focusedResourceId = -1;
    },
    handleClick(node) {
      const resource = node.resource;
      if (!resource.isUnlocked) return;
      if (this.infoResourceId !== resource.id) {
        this.infoResourceId = resource.id;
        this.focusedResourceId = resource.id;
        return;
      }
      if (resource.isBaseResource) return;
      resource.reaction.isActive = !resource.reaction.isActive;
      GameUI.update();
    },
    isUnlocked(reactionArrow) {
      return reactionArrow.product.resource.isUnlocked && reactionArrow.reagent.resource.isUnlocked;
    },
    isCapped(reactionArrow) {
      return reactionArrow.product.resource.amount > 0 &&
        reactionArrow.product.resource.amount >= reactionArrow.reagent.resource.amount;
    },
    isActiveReaction(reactionArrow) {
      return reactionArrow.reaction.isActive && !Pelle.isDoomed;
    },
    isFocusedReaction(reactionArrow) {
      return this.isUnlocked(reactionArrow) && reactionArrow.reaction.product.id === this.focusedResourceId;
    },
    isDisplayed(reactionArrow) {
      return this.isUnlocked(reactionArrow) &&
        (this.isActiveReaction(reactionArrow) || this.isFocusedReaction(reactionArrow));
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
      const animationTime = pathLength * 40;
      const reactionProgress = (this.animationTimer % animationTime) / animationTime;
      const leadPoint = Math.max(0, reactionProgress + 2 / pathLength);
      const trailPoint = Math.min(1, reactionProgress - 2 / pathLength);
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
        "o-alchemy-reaction-path": this.isUnlocked(reactionArrow),
        "o-alchemy-reaction-path--limited": this.isCapped(reactionArrow) && this.isDisplayed(reactionArrow),
        "o-alchemy-reaction-path--focused": !this.isCapped(reactionArrow) && this.isFocusedReaction(reactionArrow),
        "o-alchemy-reaction-path--not-focused": !this.isFocusedReaction(reactionArrow) && this.focusedResourceId !== -1
      };
    },
    reactionArrowClass(reactionArrow) {
      return {
        "o-alchemy-reaction-arrow": !this.isCapped(reactionArrow) && this.isDisplayed(reactionArrow),
        "o-alchemy-reaction-arrow--focused": this.isFocusedReaction(reactionArrow),
      };
    },
    showAlchemyHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Glyph Alchemy")[0];
      Modal.h2p.show();
    },
    toggleAllReactions() {
      const reactions = AlchemyReactions.all.compact().filter(r => r._product.isUnlocked);
      const allReactionsDisabled = reactions.every(reaction => !reaction.isActive);
      if (allReactionsDisabled) {
        for (const reaction of reactions) {
          reaction.isActive = true;
        }
      } else {
        for (const reaction of reactions) {
          reaction.isActive = false;
        }
      }
      this.$forceUpdate();
    }
  }
};
</script>

<template>
  <div class="l-ra-alchemy-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="showAlchemyHowTo"
      >
        Click for alchemy info
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="toggleAllReactions"
      >
        Toggle all reactions
      </PrimaryButton>
      <PrimaryButton
        v-if="realityCreationVisible"
        :class="realityGlyphCreationClass"
        onclick="Modal.realityGlyph.show()"
      >
        View Reality Glyph creation
      </PrimaryButton>
    </div>
    <AlchemyResourceInfo
      :key="infoResourceId"
      :resource="infoResource"
    />
    Glyphs can now be refined using your Glyph filter in the Glyphs tab.
    <br>
    When refining a Glyph, it will only give you resources up to a cap
    of {{ formatX(capFactor) }} its highest refinement value.
    <span v-if="reactionsAvailable">
      Reactions trigger once every time you Reality, unaffected by amplification from stored real time.
    </span>
    <div
      class="l-alchemy-circle"
      :style="circleStyle"
    >
      <svg class="l-alchemy-orbit-canvas">
        <circle
          v-for="(orbit, i) in layout.orbits"
          :key="i"
          cx="50%"
          cy="50%"
          class="o-alchemy-orbit"
          :r="orbitSize(orbit)"
          :class="orbitClass"
        />
      </svg>
      <AlchemyCircleNode
        v-for="(node, i) in layout.nodes"
        :key="i"
        :node="node"
        :is-focused="isFocusedNode(node)"
        @mouseenter="handleMouseEnter(node)"
        @mouseleave="handleMouseLeave"
        @click="handleClick(node)"
      />
      <svg class="l-alchemy-arrow-canvas">
        <line
          v-for="(reactionArrow, idx) in layout.reactionArrows"
          :key="'arrow-' + idx"
          v-bind="reactionArrowPaths(reactionArrow)"
          :class="reactionPathClass(reactionArrow)"
        />
        <line
          v-for="(reactionArrow, idx) in layout.reactionArrows"
          :key="'arrow2-' + idx"
          v-bind="reactionArrowPositions(reactionArrow)"
          :class="reactionArrowClass(reactionArrow)"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>

</style>
