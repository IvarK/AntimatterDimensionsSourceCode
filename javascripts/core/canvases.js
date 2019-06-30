"use strict";

let nodes = [];
let edges = [];
const nodeContainer = $(".vis-network")[0];
let nodeData = {};
let nodeOptions = {};
let network = null;


// Primary is lifted from the study tree (mostly),
// secondary is primary -15% l in hsl, apart from reality which is -10%
const perkColors = {
  [PerkFamily.NORMAL]: {
    primary: "#22aa48",
    secondary: "#156a2d"
  },
  [PerkFamily.INFINITY]: {
    primary: "#b67f33",
    secondary: "#7b5623"
  },
  [PerkFamily.ETERNITY]: {
    primary: "#b241e3",
    secondary: "#8b1cba"
  },
  [PerkFamily.DILATION]: {
    primary: "#64dd17",
    secondary: "#449810"
  },
  [PerkFamily.REALITY]: {
    primary: "#0b600e",
    secondary: "#063207"
  },
  [PerkFamily.AUTOMATOR]: {
    primary: "#ff0000",
    secondary: "#b30000"
  },
  [PerkFamily.ACHIEVEMENT]: {
    primary: "#fdd835",
    secondary: "#e3ba02"
  },
};

function getNodeColor(perk) {
  const canBeBought = perk.canBeBought;
  const isBought = perk.isBought;

  const perkColor = perkColors[perk.config.family];
  const primaryColor = perkColor.primary;
  const secondaryColor = perkColor.secondary;

  let backgroundColor;
  if (canBeBought) backgroundColor = "#000000";
  else if (isBought) backgroundColor = primaryColor;
  else backgroundColor = "#656565";

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

function updatePerkColors() {
  const data = Perk.all
    .map(perk => ({ id: perk.id, color: getNodeColor(perk) }));
  nodes.update(data);
}

function hidePerkLabels() {
    network.setOptions({ nodes: { font: { size: 0 } } });
}

function showPerkLabels() {
    network.setOptions({ nodes: { font: { size: 20 } } });
}

function drawPerkNetwork() {
    if (network) {
      updatePerkColors();
      return;
    }
    nodes = Perk.all.map(perk => ({ id: perk.id, label: perk.config.label, title: perk.config.description }));
    nodes = new vis.DataSet(nodes);

    edges = [];
    for (const perk of Perk.all) {
      for (const connectedPerk of perk.connectedPerks) {
        const from = Math.min(perk.id, connectedPerk.id);
        const to = Math.max(perk.id, connectedPerk.id);
        if (edges.find(edge => edge.from === from && edge.to === to)) continue;
        edges.push({ from, to });
      }
    }

    nodeData = {
        nodes,
        edges
    };
    nodeOptions = {
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
              inherit: "to"
            }
        },
    };
    network = new vis.Network(nodeContainer, nodeData, nodeOptions);

    // Buying perks
    network.on("click", params => {
      const id = params.nodes[0];
      if (!isFinite(id)) return;
      Perk.find(id).purchase();
      updatePerkColors();
    });
    // Hide tooltips on drag
    network.on("dragStart", () => {
        if (document.getElementsByClassName("vis-tooltip")[0] !== undefined) {
          document.getElementsByClassName("vis-tooltip")[0].style.visibility = "hidden";
        }
    });
    network.on("dragging", () => SecretAchievement(45).tryUnlock());
    // Set min and max zoom
    network.on("zoom", () => {
        if (network.getScale() <= 0.2) {
            network.moveTo({ scale: 0.2 });
        }
        if (network.getScale() >= 4) {
          network.moveTo({ scale: 4 });
        }
    });
}
