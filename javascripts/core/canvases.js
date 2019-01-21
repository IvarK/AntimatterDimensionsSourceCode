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
    nodesArray = [
        {id: PERKS.GLYPH_CHOOSE3, label: "G0", title: "You can now choose from 3 different glyphs on Reality."},
        {id: PERKS.START_AM1, label: "S1", title: "Start with 100 antimatter after every reset"},
        {id: PERKS.START_AM2, label: "S2", title: "Start with 1e130 antimatter after every reset"},
        {id: PERKS.START_IP1, label: "S3", title: "Start with 2e15 IP after every Eternity and Reality"},
        {id: PERKS.START_IP2, label: "S4", title: "Start with 2e130 IP after every Eternity and Reality"},
        {id: PERKS.START_EP1, label: "S5", title: "Start with 10 EP after every Reality"},
        {id: PERKS.START_EP2, label: "S6", title: "Start with 2000 EP after every Reality"},
        {id: PERKS.START_EP3, label: "S7", title: "Start with 1e9 EP after every Reality"},
        {id: PERKS.START_TP, label: "S8", title: "Start with 10 TP after unlocking Dilation"},
        {id: PERKS.GLYPH_LEVEL_INC1, label: "G1", title: "+1 to base glyph level"},
        {id: PERKS.GLYPH_LEVEL_INC2, label: "G2", title: "+1 to base glyph level"},
        {id: PERKS.GLYPH_CHOOSE4, label: "G3", title: "+1 glyph choice on Reality"},
        {id: PERKS.GLYPH_RARITY_INC, label: "G4", title: "+5% minimum glyph rarity"},
        {id: PERKS.AUTOMATION_ROW_INC1, label: "AR1", title: "+5 base automator rows"},
        {id: PERKS.AUTOMATION_ROW_INC2, label: "AR2", title: "+10 base automator rows"},
        {id: PERKS.AUTOMATION_ROW_SCALING, label: "AR3", title: "Improve the Automator row per Reality scaling"},
        {id: PERKS.AUTOUNLOCK_EU1, label: "AU1", title: "Auto-unlock the first row of Eternity upgrades after first Eternity of a Reality"},
        {id: PERKS.AUTOUNLOCK_EU2, label: "AU2", title: "Auto-unlock the second row of Eternity upgrades after first Eternity of a Reality"},
        {id: PERKS.AUTOUNLOCK_DILATION1, label: "AU3", title: "Auto-unlock the second row of Dilation upgrades on Dilation unlock"},
        {id: PERKS.AUTOUNLOCK_DILATION2, label: "AU4", title: "Auto-unlock the third row of Dilation upgrades on Dilation unlock"},
        {id: PERKS.AUTOUNLOCK_DILATION3, label: "AU5", title: "Auto-unlock Dilation TT generation when you have 1e15 DT"},
        {id: PERKS.AUTOUNLOCK_TD, label: "AU6", title: "Auto-unlock Time Dimensions 5-8 when you have enough TT"},
        {id: PERKS.AUTOUNLOCK_REALITY, label: "AU7", title: "Auto-unlock Reality at e4000 EP"},
        {id: PERKS.BYPASS_ID_AM, label: "B1", title: "Infinity Dimensions no longer have antimatter requirements"},
        {id: PERKS.BYPASS_DG_RESET, label: "B2", title: "The 2nd rebuyable Dilation upgrade no longer resets your Dilated Time"},
        {id: PERKS.BYPASS_EC_DILATION, label: "B3", title: "Remove the EC11/EC12 requirement for Time Dilation"},
        {id: PERKS.BYPASS_EC1_LOCK, label: "B4", title: "Remove the EC1 requirement from study 181"},
        {id: PERKS.BYPASS_EC2_LOCK, label: "B5", title: "Remove the EC2 requirement from study 181"},
        {id: PERKS.BYPASS_EC3_LOCK, label: "B6", title: "Remove the EC3 requirement from study 181"},
        {id: PERKS.BYPASS_EC5_LOCK, label: "B7", title: "Remove the EC5 requirement from study 62"},
        {id: PERKS.AUTOCOMPLETE_EC1, label: "AE1", title: "Auto-complete one EC every 6 hours"},
        {id: PERKS.AUTOCOMPLETE_EC2, label: "AE2", title: "Auto-complete one EC every 4 hours"},
        {id: PERKS.AUTOCOMPLETE_EC3, label: "AE3", title: "Auto-complete one EC every 2 hours"},
        {id: PERKS.AUTOCOMPLETE_EC4, label: "AE4", title: "Auto-complete one EC every 1 hour"},
        {id: PERKS.AUTOCOMPLETE_EC5, label: "AE5", title: "Auto-complete one EC every 30 minutes"},
        {id: PERKS.TS_ACTIVE_EP, label: "TS1", title: "Active path EP is always 50x"},
        {id: PERKS.TS_IDLE_EP, label: "TS2", title: "Idle path EP starts as if you have spent 15 minutes in this Eternity"},
        {id: PERKS.TS_EC_REQ, label: "TS3", title: "Remove non-TT requirements for unlocking Eternity Challenges"},
        {id: PERKS.TS_EC_BULK, label: "TS4", title: "You can complete multiple tiers of Eternity Challenges at once if you reach the goal for a higher completion of that challenge"},
        {id: PERKS.RETROACTIVE_TP1, label: "TP1", title: "When buying the 3xTP gain upgrade, multiply your TP by 1.5"},
        {id: PERKS.RETROACTIVE_TP2, label: "TP2", title: "When buying the 3xTP gain upgrade, multiply your TP by 2"},
        {id: PERKS.RETROACTIVE_TP3, label: "TP3", title: "When buying the 3xTP gain upgrade, multiply your TP by 2.5"},
        {id: PERKS.RETROACTIVE_TP4, label: "TP4", title: "When buying the 3xTP gain upgrade, multiply your TP by 3"},
        {id: PERKS.AUTOBUYER_DILATION, label: "AB1", title: "Unlock autobuyers for repeatable dilation upgrades"},
        {id: PERKS.AUTOBUYER_FASTER_ID, label: "AB2", title: "Infinity Dimension autobuyers work 3 times faster"},
        {id: PERKS.AUTOBUYER_FASTER_REPLICANTI, label: "AB3", title: "Replicanti autobuyers work 3 times faster"},
        {id: PERKS.AUTOBUYER_FASTER_DILATION, label: "AB4", title: "Dilation autobuyers work 3 times faster"},
        {id: PERKS.AUTOBUYER_TT1, label: "AB5", title: "Autobuy max TT every 10 seconds"},
        {id: PERKS.AUTOBUYER_TT2, label: "AB6", title: "Autobuy max TT every 5 seconds"},
        {id: PERKS.AUTOBUYER_TT3, label: "AB7", title: "Autobuy max TT every 3 seconds"},
        {id: PERKS.AUTOBUYER_TT4, label: "AB8", title: "Autobuy max TT every second"},
        {id: PERKS.ACHIEVEMENT_ROW1, label: "ACH1", title: "Start with the 1st achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW2, label: "ACH2", title: "Start with the 2nd achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW3, label: "ACH3", title: "Start with the 3rd achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW4, label: "ACH4", title: "Start with the 4th achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW5, label: "ACH5", title: "Start with the 5th achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW6, label: "ACH6", title: "Start with the 6th achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW7, label: "ACH7", title: "Start with the 7th achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW8, label: "ACH8", title: "Start with the 8th achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW9, label: "ACH9", title: "Start with the 9th achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW10, label: "ACH10", title: "Start with the 10th achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW11, label: "ACH11", title: "Start with the 11th achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW12, label: "ACH12", title: "Start with the 12th achievement row after Reality"},
        {id: PERKS.ACHIEVEMENT_ROW13, label: "ACH13", title: "Start with the 13th achievement row after Reality"},
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