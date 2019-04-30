"use strict";

var canvas4 = document.getElementById("automatorTreeCanvas");
var ctx4 = canvas4.getContext("2d");

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
    canvas4.width = 0;
    canvas4.height = 0;
    canvas4.width = document.body.scrollWidth;
    canvas4.height = document.body.scrollHeight;
    drawAutomatorTree();
}

function drawAutomatorTreeBranch(num1, num2) {
    if (document.getElementById("automation").style.display === "none") return
    var id1 = parseInt(num1.split("automator")[1])
    var id2 = parseInt(num2.split("automator")[1])
    var start = document.getElementById(num1).getBoundingClientRect();
    var end = document.getElementById(num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    ctx4.lineWidth=10;
    ctx4.beginPath();
    if (player.reality.automatorCommands.has(id1) && player.reality.automatorCommands.has(id2)) {
        ctx4.strokeStyle="#000";
    } else {
        ctx4.strokeStyle="#444";
    }
    ctx4.moveTo(x1, y1);
    ctx4.lineTo(x2, y2);
    ctx4.stroke();
}

function drawAutomatorTree() {
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height);
    drawAutomatorTreeBranch("automator11", "automator21");
    drawAutomatorTreeBranch("automator11", "automator22");
    drawAutomatorTreeBranch("automator11", "automator23");
    drawAutomatorTreeBranch("automator11", "automator32");
    drawAutomatorTreeBranch("automator11", "automator32");
    drawAutomatorTreeBranch("automator11", "automator41");
    drawAutomatorTreeBranch("automator11", "automator42");
    drawAutomatorTreeBranch("automator21", "automator31");
    drawAutomatorTreeBranch("automator42", "automator52");
    drawAutomatorTreeBranch("automator12", "automator24");
    drawAutomatorTreeBranch("automator12", "automator25");
    drawAutomatorTreeBranch("automator12", "automator26");
    drawAutomatorTreeBranch("automator26", "automator36");
    drawAutomatorTreeBranch("automator12", "automator34");
    drawAutomatorTreeBranch("automator12", "automator35");
    drawAutomatorTreeBranch("automator12", "automator43");
    drawAutomatorTreeBranch("automator12", "automator44");
    drawAutomatorTreeBranch("automator41", "automator51");
    drawAutomatorTreeBranch("automator43", "automator53");
    drawAutomatorTreeBranch("automator44", "automator54");
    drawAutomatorTreeBranch("automator51", "automator61");
    drawAutomatorTreeBranch("automator52", "automator62");
    drawAutomatorTreeBranch("automator54", "automator63");
    drawAutomatorTreeBranch("automator54", "automator64");
    drawAutomatorTreeBranch("automator61", "automator71");
    drawAutomatorTreeBranch("automator62", "automator72");
    drawAutomatorTreeBranch("automator64", "automator73");
    drawAutomatorTreeBranch("automator71", "automator81");
    drawAutomatorTreeBranch("automator71", "automator82");
    drawAutomatorTreeBranch("automator73", "automator83");
    drawAutomatorTreeBranch("automator73", "automator84");
}

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
