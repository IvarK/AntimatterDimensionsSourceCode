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
    if (player.reality.automatorCommands.includes(id1) && player.reality.automatorCommands.includes(id2)) {
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

var nodes = []
var edges = []
var nodeContainer = $(".vis-network")[0];
var nodeData = {}
var nodeOptions = {}
var network = null;


function getNodeColor(id, cost) {
  if (canBuyPerk(id, cost)) var tempColor = "#000000"
  else if (player.reality.perks.includes(id)) var tempColor = "#0b600e"
  else var tempColor = "#656565"
  if (canBuyPerk(id, cost) || player.reality.perks.includes(id)) var tempHoverColor = "#0b600e"
  else var tempHoverColor = "#656565"
  if (player.reality.perks.includes(id)) var tempBorderColor = "#094E0B"
  else var tempBorderColor = "#0b600e"
  return {background: tempColor, border: tempBorderColor, hover: {background: tempHoverColor, border: tempBorderColor}, highlight: {background: tempColor, border: tempBorderColor}}
}

function updatePerkColors() {
  for (let id of Object.keys(CONNECTED_PERKS)) {
    id = parseInt(id);
    nodes.update([{id:id, color: getNodeColor(id, 1) }]);
  }
}

function hidePerkLabels() {
    network.setOptions({nodes: {font: {size: 0}}});
}

function showPerkLabels() {
    network.setOptions({nodes: {font: {size: 20}}});
}

//0: automator
//10: dilation
//20: glyphs
//30: ecs
function drawPerkNetwork() {
    if (network) {
      updatePerkColors();
      return;
    }
    nodesArray = [{id: 0, label: "0", color: getNodeColor(0, 1), title: "You can now choose from 3 different glyphs on Reality."}, //DONE
    {id: 1, label: "1", color: getNodeColor(1, 1), title: "+5 base Automator rows."}, //DONE
    {id: 2, label: "2", color: getNodeColor(2, 1), title: "+10 base Automator rows."}, //DONE
    {id: 3, label: "3", color: getNodeColor(3, 1), title: "Improve the Automator row per Reality scaling."}, //DONE
    {id: 4, label: "4", color: getNodeColor(4, 1), title: "Remove the EC1 requirement from study 181."}, //DONE
    {id: 5, label: "5", color: getNodeColor(5, 1), title: "Every 10 seconds automatically buy max TT."}, //DONE
    {id: 6, label: "6", color: getNodeColor(6, 1), title: "Every 5 seconds automatically buy max TT."}, //DONE
    {id: 7, label: "7", color: getNodeColor(7, 1), title: "Every 3 seconds automatically buy max TT."}, //DONE
    {id: 8, label: "8", color: getNodeColor(8, 1), title: "Every second automatically buy max TT."}, //DONE
    {id: 11, label: "11", color: getNodeColor(11, 1), title: "The 2nd rebuyable Dilation upgrade no longer resets your Dilated Time."}, //DONE
    {id: 12, label: "12", color: getNodeColor(12, 1), title: "Rebuyable Dilation upgrade autobuyers."}, //DONE
    {id: 13, label: "13", color: getNodeColor(13, 1), title: "Remove the unlock requirement for Time Dilation."}, //DONE
    {id: 14, label: "14", color: getNodeColor(14, 1), title: "Gain the second row of Dilation upgrades on Dilation unlock."}, //DONE
    {id: 15, label: "15", color: getNodeColor(15, 1), title: "Gain the third row of Dilation upgrades on Dilation unlock."}, //DONE
    {id: 21, label: "21", color: getNodeColor(21, 1), title: "+1 to base glyph level."}, //DONE
    {id: 22, label: "22", color: getNodeColor(22, 1), title: "+1 glyph choice on Reality."}, //DONE
    {id: 23, label: "23", color: getNodeColor(23, 1), title: "+5% minimum glyph rarity."}, //DONE
    {id: 24, label: "24", color: getNodeColor(24, 1), title: "+1 to base glyph level."}, //DONE
    {id: 31, label: "31", color: getNodeColor(31, 1), title: "Remove the secondary requirements for unlocking Eternity Challenges."}, //DONE
    {id: 32, label: "32", color: getNodeColor(32, 1), title: "You can complete multiple tiers of Eternity Challenges at once if you reach the goal for a higher completion of that challenge."}, //DONE
    {id: 33, label: "33", color: getNodeColor(33, 1), title: "You start with 10 Tachyon Particles after unlocking Dilation."}, //DONE
    {id: 34, label: "34", color: getNodeColor(34, 1), title: "When buying the 3 times more TP gain upgrade, multiply your TP by 1.5."}, //DONE
    {id: 35, label: "35", color: getNodeColor(35, 1), title: "When buying the 3 times more TP gain upgrade, multiply your TP by 2."}, //DONE
    {id: 36, label: "36", color: getNodeColor(36, 1), title: "When buying the 3 times more TP gain upgrade, multiply your TP by 2.5."}, //DONE
    {id: 37, label: "37", color: getNodeColor(37, 1), title: "When buying the 3 times more TP gain upgrade, multiply your TP by 3."}, //DONE
    {id: 41, label: "41", color: getNodeColor(41, 1), title: "Start with the 1st achievement row after Reality."}, //DONE
    {id: 42, label: "42", color: getNodeColor(42, 1), title: "Start with the 2nd achievement row after Reality."}, //DONE
    {id: 43, label: "43", color: getNodeColor(43, 1), title: "Start with the 3rd achievement row after Reality."}, //DONE
    {id: 44, label: "44", color: getNodeColor(44, 1), title: "Start with the 4th achievement row after Reality."}, //DONE
    {id: 45, label: "45", color: getNodeColor(45, 1), title: "Start with the 5th achievement row after Reality."}, //DONE
    {id: 46, label: "46", color: getNodeColor(46, 1), title: "Start with the 6th achievement row after Reality."}, //DONE
    {id: 47, label: "47", color: getNodeColor(47, 1), title: "Start with the 7th achievement row after Reality."}, //DONE
    {id: 48, label: "48", color: getNodeColor(48, 1), title: "Start with the 8th achievement row after Reality."}, //DONE
    {id: 49, label: "49", color: getNodeColor(49, 1), title: "Start with the 9th achievement row after Reality."}, //DONE
    {id: 410, label: "410", color: getNodeColor(410, 1), title: "Start with the 10th achievement row after Reality."}, //DONE
    {id: 411, label: "411", color: getNodeColor(411, 1), title: "Start with the 11th achievement row after Reality."}, //DONE
    {id: 412, label: "412", color: getNodeColor(412, 1), title: "Start with the 12th achievement row after Reality."},//DONE
    {id: 413, label: "413", color: getNodeColor(413, 1), title: "Start with the 13th achievement row after Reality."},//DONE
    {id: 51, label: "51", color: getNodeColor(51, 1), title: "Start with 100 antimatter after every reset"}, //DONE
    {id: 52, label: "52", color: getNodeColor(52, 1), title: "Start with 1e130 antimatter after every reset"}, //DONE
    {id: 53, label: "53", color: getNodeColor(53, 1), title: "Start with 2e15 IP after every Eternity and Reality"}, //DONE
    {id: 54, label: "54", color: getNodeColor(54, 1), title: "Start with 2e130 IP after every Eternity and Reality"}, //DONE
    {id: 55, label: "55", color: getNodeColor(55, 1), title: "Start with 10 EP after every Reality"}, //DONE
    {id: 56, label: "56", color: getNodeColor(56, 1), title: "Start with 2,000 EP after every Reality"}, //DONE
    {id: 57, label: "57", color: getNodeColor(57, 1), title: "Start with 1e9 EP after every Reality"}, //DONE
    {id: 61, label: "61", color: getNodeColor(61, 1), title: "Infinity dimension autobuyers work 3 times faster."}, //DONE
    {id: 62, label: "62", color: getNodeColor(62, 1), title: "Replicanti autobuyers work 3 times faster."}, //DONE
    {id: 63, label: "63", color: getNodeColor(63, 1), title: "Dilation autobuyers work 3 times faster."}, //DONE
    {id: 64, label: "64", color: getNodeColor(64, 1), title: "Autobuyer for Time Dimension 5-8 unlocks."}, //DONE
    {id: 65, label: "65", color: getNodeColor(65, 1), title: "Automatically unlock TT generation when you have 1e15 DT."}, //DONE
    {id: 66, label: "66", color: getNodeColor(66, 1), title: "Automatically unlock Reality at e4000 EP."}, //DONE
    {id: 67, label: "67", color: getNodeColor(67, 1), title: "Infinity Dimensions no longer have antimatter requirements."}, //DONE
    {id: 71, label: "71", color: getNodeColor(71, 1), title: "Remove the EC5 requirement from study 62."}, //DONE
    {id: 72, label: "72", color: getNodeColor(72, 1), title: "Active path EP mult is always at 50x."}, //DONE
    {id: 73, label: "73", color: getNodeColor(73, 1), title: "Idle path EP mult starts as if you have spent 15 minutes in this Eternity." }, //DONE
    {id: 74, label: "74", color: getNodeColor(74, 1), title: "Remove the EC2 requirement from study 181." }, //DONE
    {id: 75, label: "75", color: getNodeColor(75, 1), title: "Remove the EC3 requirement from study 181." }, //DONE
    {id: 81, label: "81", color: getNodeColor(81, 1), title: "Get the first row of Eternity upgrades after first Eternity of a Reality."}, //DONE
    {id: 82, label: "82", color: getNodeColor(82, 1), title: "Get the second row of Eternity upgrades after first Eternity of a Reality."}, //DONE
    {id: 91, label: "91", color: getNodeColor(91, 1), title: "Automatically complete one EC every 6 hours."}, //DONE
    {id: 92, label: "92", color: getNodeColor(92, 1), title: "Automatically complete one EC every 4 hours."}, //DONE
    {id: 93, label: "93", color: getNodeColor(93, 1), title: "Automatically complete one EC every 2 hours."}, //DONE
    {id: 94, label: "94", color: getNodeColor(94, 1), title: "Automatically complete one EC every 1 hour."}, //DONE
    {id: 95, label: "95", color: getNodeColor(95, 1), title: "Automatically complete one EC every 30 minutes."}, //DONE
    ]; 
    nodes = new vis.DataSet(nodesArray);

    // This creates the edges based on CONNECTED_PERKS in perks.js
    edges = []
    for (key in CONNECTED_PERKS) {
      CONNECTED_PERKS[key].map(function(id) {
        if (!edges.some(function(edge) {
          return edge.from == id && edge.to == parseInt(key) // Check if edges has the edge other way around
        })) edges.push({from: parseInt(key), to: id})
      })
    }

    nodeData = {
        nodes: nodes,
        edges: edges
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
            shadow: true
        },
    };
    network = new vis.Network(nodeContainer, nodeData, nodeOptions);

    //buying perks TODO: lower the cost.
    network.on("click", function(params) {
        var id = params.nodes[0]
        if (isFinite(id)) {
            buyPerk(id, 1);
            updatePerkColors()
        }
    });
    //hide tooltips on drag
    network.on("dragStart", function(params) {
        if(document.getElementsByClassName("vis-tooltip")[0] !== undefined) document.getElementsByClassName("vis-tooltip")[0].style.visibility = "hidden"
    });
    //secret ach check
    network.on("dragging", function(params) {
        player.secretUnlocks.dragging++;
        if(player.secretUnlocks.dragging / 100 >= 60) giveAchievement("This dragging is dragging on")
    });
    //set min and max zoom
    network.on("zoom",function(){
        if(network.getScale() <= 0.2 ) {
            network.moveTo({scale: 0.2,});
        }
        if(network.getScale() >= 4 ) {
            network.moveTo({scale: 4,});
        }
    })
}