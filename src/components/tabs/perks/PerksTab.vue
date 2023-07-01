<script>
import { DataSet, Network } from "vis-network";

import { PERK_FAMILY } from "@/core/secret-formula";
import PerkPointLabel from "./PerkPointLabel";

export default {
  name: "PerksTab",
  components: {
    PerkPointLabel
  },
  computed: {
    showHintText() {
      return ui.view.shiftDown || player.options.showHintText.perks;
    }
  },
  watch: {
    showHintText(newValue) {
      if (ui.view.theme === "S9") PerkNetwork.setLabelVisibility(false);
      else PerkNetwork.setLabelVisibility(newValue);
    }
  },
  created() {
    EventHub.ui.on(GAME_EVENT.PERK_BOUGHT, () => PerkNetwork.updatePerkColor());
  },
  mounted() {
    PerkNetwork.initialStabilization = false;
    PerkNetwork.currentLayout = PerkLayouts[player.options.perkLayout];
    PerkNetwork.initializeIfNeeded();
    if (ui.view.theme === "S9") PerkNetwork.setLabelVisibility(false);
    else PerkNetwork.setLabelVisibility(ui.view.shiftDown || player.options.showHintText.perks);
    PerkNetwork.updatePerkColor();
    PerkNetwork.updatePerkSize();
    this.$refs.tab.appendChild(PerkNetwork.container);
    PerkNetwork.moveToDefaultLayoutPositions(player.options.perkLayout);
  }
};

// Primary is lifted from the study tree (mostly),
// secondary is primary -15% l in hsl, apart from reality which is -10%
const perkColors = () => ({
  [PERK_FAMILY.ANTIMATTER]: {
    primary: "#22aa48",
    secondary: "#156a2d"
  },
  [PERK_FAMILY.INFINITY]: {
    primary: "#b67f33",
    secondary: "#7b5623"
  },
  [PERK_FAMILY.ETERNITY]: {
    primary: "#b241e3",
    secondary: "#8b1cba"
  },
  [PERK_FAMILY.DILATION]: {
    primary: "#64dd17",
    secondary: "#449810"
  },
  [PERK_FAMILY.REALITY]: {
    primary: "#0b600e",
    secondary: "#063207"
  },
  [PERK_FAMILY.AUTOMATION]: {
    primary: "#ff0000",
    secondary: "#b30000"
  },
  [PERK_FAMILY.ACHIEVEMENT]: {
    primary: "#fdd835",
    secondary: "#e3ba02"
  },
});

// Coordinate specifications are sometimes given in a grid index, so we need to spread them out to the proper scaling.
// Positions with |x| < 20 and |y| < 12 will display well with a scale factor of 10.
// When making new layouts, the grid coordinates need to be multiplied by 5
function globalScale(vec, factor) {
  return vec.matrixTransform(factor, 0, 0, factor);
}

function positionNumToVector(num) {
  const xPart = num % 400;
  const yPart = Math.floor(num / 400);
  return new Vector(5 * (xPart - 200), 5 * (yPart - 200));
}

// Specification for different starting layouts
export const PerkLayouts = [
  {
    buttonText: "Default Untangled",
    position: config => positionNumToVector(config.layoutPosList[0]),
  },
  {
    buttonText: "Random Positions",
    position: () => new Vector(2000 * Math.random() - 1000, 1200 * Math.random() - 600),
  },
  {
    // This is the perks laid out in the same way that they're laid out in the Android version
    buttonText: "Android Layout",
    position: config => globalScale(positionNumToVector(config.layoutPosList[1]), 20),
    centerOffset: new Vector(0, 120),
    forcePhysics: false,
    straightEdges: true,
  },
  {
    buttonText: "Square",
    position: config => globalScale(positionNumToVector(config.layoutPosList[2]), 27.5),
    centerOffset: new Vector(0, 0),
    forcePhysics: false,
    straightEdges: true,
  },
  {
    buttonText: "Horizontal Grid",
    position: config => globalScale(positionNumToVector(config.layoutPosList[3]), 32.5),
    centerOffset: new Vector(-60, 0),
    forcePhysics: false,
    straightEdges: true,
  },
  {
    buttonText: "Distance from START",
    position: config => globalScale(positionNumToVector(config.layoutPosList[4]), 17.5),
    centerOffset: new Vector(0, 0),
    forcePhysics: false,
    straightEdges: true,
  },
  {
    buttonText: "Blob",
    position: config => positionNumToVector(config.layoutPosList[5]),
    centerOffset: new Vector(50, 0),
    forcePhysics: false,
    straightEdges: true,
    isUnlocked: () => Themes.available().map(t => t.name).includes("S11"),
  }
];

export const PerkNetwork = {
  container: undefined,
  network: undefined,
  nodes: undefined,
  minScale: 0.2,
  maxScale: 4,
  lastPerkNotation: "",
  pulseTimer: 0,
  initialStabilization: false,
  currentLayout: {},
  initializeIfNeeded() {
    const notation = Notations.current.name;
    if (this.container !== undefined && notation === this.lastPerkNotation) return;
    this.lastPerkNotation = notation;

    this.makeNetwork();

    this.network.on("click", params => {
      const id = params.nodes[0];
      if (!isFinite(id)) return;
      Perks.find(id).purchase();
      this.updatePerkColor();
      this.updatePerkSize();
    });

    this.network.on("dragStart", () => {
      const tooltip = this.container.getElementsByClassName("vis-tooltip")[0];
      if (tooltip !== undefined) {
        tooltip.style.visibility = "hidden";
      }
      if (!this.initialStabilization) {
        this.setPhysics(player.options.perkPhysicsEnabled);
        this.initialStabilization = true;
      }
    });

    // Change node side while dragging on Cancer theme, but skip the method otherwise because it's mildly intensive
    this.network.on("dragging", () => {
      SecretAchievement(45).tryUnlock();
      if (Theme.current().name === "S4") PerkNetwork.updatePerkSize();
    });

    this.network.on("zoom", () => {
      const scale = this.network.getScale();
      const clampedScale = Math.clamp(scale, this.minScale, this.maxScale);
      if (scale !== clampedScale) {
        this.network.moveTo({ scale: clampedScale });
      }
    });

    this.network.on("stabilizationIterationsDone", () => {
      // Centering the perk tree doesn't work until the physics-based movement has stopped after the initial creation
      if (!this.initialStabilization) {
        this.resetPosition(false);
        this.initialStabilization = true;
      }
      this.setPhysics(player.options.perkPhysicsEnabled);
    });
  },
  makeNetwork() {
    // Need to do some html to be able to apply some css for when in doomed
    function htmlTitle(html) {
      const container = document.createElement("div");
      container.innerHTML = html;
      return container;
    }
    // Just for a bit of fun, tangle it up a bit unless the player specifically chooses not to
    const isDisabled = perk => Pelle.isDoomed && Pelle.uselessPerks.includes(perk.id);
    const selectPos = config => PerkLayouts[player.options.perkLayout].position(config);
    this.nodes = new DataSet(Perks.all.map(perk => ({
      id: perk.id,
      label: perk.config.label,
      shape: perk.config.automatorPoints ? "diamond" : "dot",
      // As far as I am aware, vis.js doesn't support arbitrary CSS styling; nevertheless, we still want the original
      // description to be visible instead of being hidden by disable/lock text
      title: (isDisabled(perk)
        ? htmlTitle(
          `<span style='text-decoration: line-through;'>${perk.config.description}</span>`
        )
        : `${perk.config.description} ${perk.config.automatorPoints && !isDisabled(perk)
          ? `(+${formatInt(perk.config.automatorPoints)} AP)`
          : ""}`
      ),
      x: selectPos(perk.config).x,
      y: selectPos(perk.config).y,
    })));

    const edges = [];
    for (const perk of Perks.all) {
      for (const connectedPerk of perk.connectedPerks) {
        const from = Math.min(perk.id, connectedPerk.id);
        const to = Math.max(perk.id, connectedPerk.id);
        if (edges.find(edge => edge.from === from && edge.to === to)) continue;
        edges.push({ from, to });
      }
    }

    const nodeData = {
      nodes: this.nodes,
      edges
    };

    const nodeOptions = {
      interaction: {
        hover: true,
        hoverConnectedEdges: false,
        selectConnectedEdges: false,
        tooltipDelay: 0,
      },
      nodes: {
        shape: "dot",
        size: 18,
        font: {
          size: 0
        },
        borderWidth: 2,
        shadow: true
      },
      edges: {
        width: 2,
        shadow: true,
        hoverWidth: width => width,
        selectionWidth: width => width,
        color: {
          inherit: "both"
        },
        hidden: ui.view.theme === "S9"
      },
    };

    const container = document.createElement("div");
    container.className = "c-wide-canvas-element vis-network c-perk-network";
    container.tabIndex = 900;
    const canvas = document.createElement("canvas");
    canvas.className = "c-perk-network__canvas";
    container.appendChild(canvas);
    this.container = container;

    this.network = new Network(container, nodeData, nodeOptions);
  },
  setPhysics(state) {
    const newState = this.currentLayout.forcePhysics === undefined ? state : this.currentLayout.forcePhysics;
    this.network.setOptions({ physics: { enabled: newState } });
  },
  setEdgeCurve(state) {
    const newState = this.currentLayout.straightEdges === undefined ? state : !this.currentLayout.straightEdges;
    this.network.setOptions({ edges: { smooth: { enabled: newState } } });
  },
  moveToDefaultLayoutPositions(layoutIndex) {
    // Things go wonky if we don't turn these off before moving
    this.setPhysics(false);
    this.setEdgeCurve(false);

    for (const key of Object.keys(PerkNetwork.network.getPositions())) {
      const id = Number(key);
      const config = Perks.all.find(p => p.id === id).config;
      const target = PerkLayouts[layoutIndex].position(config);
      this.network.moveNode(id, target.x, target.y);
    }

    // Properly set attributes and window after all the movement
    this.initialStabilization = false;
    this.resetPosition(false);
    this.setEdgeCurve(true);
  },
  forceNetworkRemake() {
    this.container = undefined;
    this.initializeIfNeeded();
    // Tangled trees use physics to bring it to a semi-usable state; it gets set properly again after stabilization
    this.setPhysics(true);
  },
  resetPosition(centerOnStart) {
    const center = centerOnStart
      ? PerkNetwork.network.body.nodes[GameDatabase.reality.perks.firstPerk.id]
      : (PerkLayouts[player.options.perkLayout].centerOffset ?? new Vector(0, 0));
    this.network.moveTo({ position: { x: center.x, y: center.y }, scale: 0.4, offset: { x: 0, y: 0 } });
  },
  setLabelVisibility(areVisible) {
    const options = {
      nodes: {
        font: {
          size: areVisible ? 20 : 0,
          color: Theme.current().isDark() ? "#DDDDDD" : "#222222",
        }
      }
    };
    this.network.setOptions(options);
  },
  updatePerkColor() {
    this.perkColorList = this.perkColorList ?? perkColors();
    const perkColorList = this.perkColorList;

    function nodeColor(perk) {
      const perkColor = perkColorList[perk.config.family];
      const primaryColor = perkColor.primary;
      const secondaryColor = perkColor.secondary;

      const pelleUseless = Pelle.isDoomed && Pelle.uselessPerks.includes(perk.id);
      if (pelleUseless) {
        const backgroundColor = "#00bcd4";
        const hoverColor = "crimson";
        const borderColor = secondaryColor;
        return {
          background: backgroundColor,
          border: borderColor,
          hover: {
            background: hoverColor,
            border: borderColor
          },
          highlight: {
            background: backgroundColor,
            border: borderColor
          }
        };
      }
      const canBeBought = perk.canBeBought;
      const isBought = perk.isBought;

      let backgroundColor;
      if (canBeBought) {
        if (Theme.current().isDark()) backgroundColor = "#EEEEEE";
        else backgroundColor = "#111111";
      } else if (isBought) backgroundColor = primaryColor;
      else if (Theme.current().isDark()) backgroundColor = "#333333";
      else backgroundColor = "#CCCCCC";

      const hoverColor = canBeBought || isBought ? primaryColor : "#656565";
      const borderColor = secondaryColor;

      return {
        background: backgroundColor,
        border: borderColor,
        hover: {
          background: hoverColor,
          border: borderColor
        },
        highlight: {
          background: backgroundColor,
          border: borderColor
        }
      };
    }

    const data = Perks.all
      .map(perk => ({ id: perk.id, color: nodeColor(perk) }));
    this.nodes.update(data);
  },
  updatePerkSize() {
    function nodeSize(perk) {
      PerkNetwork.pulseTimer += 0.1;
      // Make the nodes pulse continuously on Cancer theme
      const mod = Theme.current().name === "S4"
        ? 10 * Math.sin(5 * PerkNetwork.pulseTimer + 0.1 * perk._config.id)
        : 0;
      if (perk._config.label === "START") return 35 + mod;
      if (perk.isBought) return 25 + mod;
      if (perk.canBeBought) return 20 + mod;
      return 12 + mod;
    }

    const data = Perks.all
      .map(perk => ({ id: perk.id, size: nodeSize(perk) }));
    this.nodes.update(data);
  }
};
</script>

<template>
  <div
    ref="tab"
    class="c-perk-tab"
  >
    <PerkPointLabel />
  </div>
</template>

<style scoped>

</style>
