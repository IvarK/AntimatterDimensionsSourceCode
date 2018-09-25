var lastTs = 0;
var goalX = -1;
var goalY = -1;
var particles = {}
var direction = 0;
var velocityX = 0;
var velocityY = 0;

var canvas = document.getElementById("studyTreeCanvas");
var ctx = canvas.getContext("2d");
var canvas3 = document.getElementById("dilationCanvas");
var ctx3 = canvas3.getContext("2d");
var canvas4 = document.getElementById("automatorTreeCanvas");
var ctx4 = canvas4.getContext("2d");

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
    canvas.width = 0;
    canvas.height = 0;
    canvas3.width = 0;
    canvas3.height = 0;
    canvas4.width = 0;
    canvas4.height = 0;
    canvas.width = document.body.scrollWidth;
    canvas.height = document.body.scrollHeight;
    canvas3.width = document.body.scrollWidth;
    canvas3.height = document.body.scrollHeight;
    canvas4.width = document.body.scrollWidth;
    canvas4.height = document.body.scrollHeight;
    drawStudyTree();
    drawAutomatorTree();
}

function point(x, y, ctz){
    ctz.beginPath();
    ctz.arc(x, y, 2, 0, 2 * Math.PI, true);
    ctz.fill();
  }

var tachyonAnimation = {
    running: false,
    delta: 0,
    lastTs: 0
};

function tryStartTachyonAnimation() {
    if (tachyonAnimation.running || !player.options.animations.tachyonParticles) return;
    tachyonAnimation.running = true;
    requestAnimationFrame(drawTachyonAnimationFrame);
}

function drawTachyonAnimationFrame(ts){
    let isVisible =
        document.getElementById("eternitystore").style.display !== "none" &&
        document.getElementById("dilation").style.display !== "none";
    if (!isVisible) {
        tachyonAnimation.running = false;
        return;
    }
    if (player.dilation.tachyonParticles.gte(1)) {
        ctx3.clearRect(0, 0, canvas.width, canvas.height);
        ctx3.fillStyle = Theme.current().colors.tachyons;
        for (i=0; i<player.dilation.tachyonParticles.exponent+1; i++) {
            if (typeof particles["particle"+i] === "undefined") {
                particles["particle"+i] = {}
                particles["particle"+i].goalX = Math.ceil(Math.random() * canvas3.width);
                particles["particle"+i].goalY = Math.ceil(Math.random() * canvas3.height);
                particles["particle"+i].direction = Math.ceil(Math.random() * 8);
                particles["particle"+i].velocityX = Math.ceil((Math.random() - 0.5) * 25)
                particles["particle"+i].velocityY = Math.ceil((Math.random() - 0.5) * 25)
                if (particles["particle"+i].velocityX < 0) particles["particle"+i].velocityX -= 10
                else particles["particle"+i].velocityX += 10
                if (particles["particle"+i].velocityY < 0) particles["particle"+i].velocityY -= 10
                else particles["particle"+i].velocityY += 10
                }
            goalX = particles["particle"+i].goalX
            goalY = particles["particle"+i].goalY
            if ((goalX > canvas3.width || goalX < 0) || (goalY > canvas3.height || goalY < 0)) {
                particles["particle"+i].goalX = Math.ceil(Math.random() * canvas3.width);
                particles["particle"+i].goalY = Math.ceil(Math.random() * canvas3.height);
                particles["particle"+i].direction = Math.ceil(Math.random() * 8);
                particles["particle"+i].velocityX = Math.ceil((Math.random() - 0.5) * 25)
                particles["particle"+i].velocityY = Math.ceil((Math.random() - 0.5) * 25)
                if (particles["particle"+i].velocityX < 0) particles["particle"+i].velocityX -= 10
                else particles["particle"+i].velocityX += 10
                if (particles["particle"+i].velocityY < 0) particles["particle"+i].velocityY -= 10
                else particles["particle"+i].velocityY += 10
                }
            point(particles["particle"+i].goalX, particles["particle"+i].goalY, ctx3)
            particles["particle"+i].goalX += particles["particle"+i].velocityX * tachyonAnimation.delta * 60
            particles["particle"+i].goalY += particles["particle"+i].velocityY * tachyonAnimation.delta * 60
        }
    }
    tachyonAnimation.delta = (ts - tachyonAnimation.lastTs) / 1000;
    tachyonAnimation.lastTs = ts;
    requestAnimationFrame(drawTachyonAnimationFrame);
}

function drawTreeBranch(num1, num2) {
    if (document.getElementById("timestudies").style.display === "none") return
    var name1 = parseInt(num1);
    var isECName = false;
    var isDilStudyName = false;
    if (num2.includes("ec")) {
        var a = num2.split("c")[1];
        var name2 = parseInt(a.split("u")[0]);
        var isECName = true;
    } else if (num2.includes("dilstudy")) {
        var isDilStudyName = true;
        var name2 = parseInt(num2.split("y")[1]);
    } else {
        var name2 = parseInt(num2)
    }
    var start = document.getElementById(num1).getBoundingClientRect();
    var end = document.getElementById(num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    ctx.lineWidth=15;
    ctx.beginPath();
    if ((player.timestudy.studies.includes(name1) && player.timestudy.studies.includes(name2) && !isECName) || (player.timestudy.studies.includes(name1) && (player.eternityChallUnlocked === name2 && isECName)) || (player.dilation.studies.includes(name2-1) && (player.dilation.studies.includes(name2) && isDilStudyName))) {
        if (name2 < 20 && isECName) {
            ctx.strokeStyle="#490066";
        } else if (name2 < 20) {
            ctx.strokeStyle="#64DD17";
        } else if (name2 == 71 || name2 == 81 || name2 == 91 || name2 == 101 || name1 == 101) {
            ctx.strokeStyle="#22aa48";
        } else if (name2 == 72 || name2 == 82 || name2 == 92 || name2 == 102 || name1 == 102) {
            ctx.strokeStyle="#B67F33";
        } else if (name2 == 73 || name2 == 83 || name2 == 93 || name2 == 103 || name1 == 103) {
            ctx.strokeStyle="#B241E3";
        } else if (name2 == 121 || name2 == 131 || name2 == 141 || name1 == 141) {
            ctx.strokeStyle="#FF0100";
        } else if (name2 == 122 || name2 == 132 || name2 == 142 || name1 == 142) {
            ctx.strokeStyle="#5E33B6";
        } else if (name2 == 123 || name2 == 133 || name2 == 143 || name1 == 143) {
            ctx.strokeStyle="#0080ff";
        } else {
            ctx.strokeStyle = Theme.current().colors.studyTreePath;
        }
    } else {
        if (isECName) {
            ctx.strokeStyle="#4b3753";
        } else if (isDilStudyName) {
            ctx.strokeStyle="#759362";
        } else if (name2 == 71 || name2 == 81 || name2 == 91 || name2 == 101 || name1 == 101) {
            ctx.strokeStyle="#37533f";
        } else if (name2 == 72 || name2 == 82 || name2 == 92 || name2 == 102 || name1 == 102) {
            ctx.strokeStyle="#534737";
        } else if (name2 == 73 || name2 == 83 || name2 == 93 || name2 == 103 || name1 == 103) {
            ctx.strokeStyle="#4a3753";
        } else if (name2 == 121 || name2 == 131 || name2 == 141 || name1 == 141) {
            ctx.strokeStyle="#533737";
        } else if (name2 == 122 || name2 == 132 || name2 == 142 || name1 == 142) {
            ctx.strokeStyle="#403753";
        } else if (name2 == 123 || name2 == 133 || name2 == 143 || name1 == 143) {
            ctx.strokeStyle="#374553";
        } else {
            ctx.strokeStyle="#444";
        }
    }
    if (num2 == "secretstudy") ctx.strokeStyle="#000000";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawStudyTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (document.getElementById("secretstudy").style.opacity != "0") drawTreeBranch("11", "secretstudy");
    drawTreeBranch("11", "21");
    drawTreeBranch("11", "22");
    drawTreeBranch("21", "31");
    drawTreeBranch("21", "33");
    drawTreeBranch("22", "32");
    drawTreeBranch("31", "41");
    drawTreeBranch("32", "42");
    drawTreeBranch("41", "51");
    drawTreeBranch("42", "51");
    drawTreeBranch("51", "61");
    drawTreeBranch("ec5unl", "62")
    drawTreeBranch("61", "71");
    drawTreeBranch("61", "72");
    drawTreeBranch("61", "73");
    drawTreeBranch("71", "81");
    drawTreeBranch("72", "82");
    drawTreeBranch("73", "83");
    drawTreeBranch("81", "91");
    drawTreeBranch("82", "92");
    drawTreeBranch("83", "93");
    drawTreeBranch("91", "101");
    drawTreeBranch("92", "102");
    drawTreeBranch("93", "103");
    drawTreeBranch("101", "111");
    drawTreeBranch("102", "111");
    drawTreeBranch("103", "111");
    drawTreeBranch("111", "121");
    drawTreeBranch("111", "122");
    drawTreeBranch("111", "123");
    drawTreeBranch("121", "131");
    drawTreeBranch("122", "132");
    drawTreeBranch("123", "133");
    drawTreeBranch("131", "141");
    drawTreeBranch("132", "142");
    drawTreeBranch("133", "143");
    drawTreeBranch("141", "151");
    drawTreeBranch("142", "151");
    drawTreeBranch("143", "151");
    drawTreeBranch("151", "161");
    drawTreeBranch("151", "162");
    drawTreeBranch("161", "171");
    drawTreeBranch("162", "171");
    drawTreeBranch("171", "ec1unl")
    drawTreeBranch("171", "ec2unl")
    drawTreeBranch("171", "ec3unl")
    drawTreeBranch("143", "ec4unl")
    drawTreeBranch("42", "ec5unl")
    drawTreeBranch("121", "ec6unl")
    drawTreeBranch("111", "ec7unl")
    drawTreeBranch("123", "ec8unl")
    drawTreeBranch("151", "ec9unl")
    if (!player.reality.perks.includes(4)) drawTreeBranch("ec1unl", "181")
    drawTreeBranch("ec2unl", "181")
    drawTreeBranch("ec3unl", "181")
    drawTreeBranch("181", "ec10unl")
    drawTreeBranch("ec10unl", "191")
    drawTreeBranch("ec10unl", "192")
    drawTreeBranch("ec10unl", "193")
    drawTreeBranch("191", "211")
    drawTreeBranch("191", "212")
    drawTreeBranch("192", "201")
    drawTreeBranch("193", "213")
    drawTreeBranch("193", "214")
    drawTreeBranch("211", "221")
    drawTreeBranch("211", "222")
    drawTreeBranch("212", "223")
    drawTreeBranch("212", "224")
    drawTreeBranch("213", "225")
    drawTreeBranch("213", "226")
    drawTreeBranch("214", "227")
    drawTreeBranch("214", "228")
    drawTreeBranch("221", "231")
    drawTreeBranch("222", "231")
    drawTreeBranch("223", "232")
    drawTreeBranch("224", "232")
    drawTreeBranch("225", "233")
    drawTreeBranch("226", "233")
    drawTreeBranch("227", "234")
    drawTreeBranch("228", "234")
    drawTreeBranch("231", "ec11unl")
    drawTreeBranch("232", "ec11unl")
    drawTreeBranch("233", "ec12unl")
    drawTreeBranch("234", "ec12unl")
    drawTreeBranch("ec11unl", "dilstudy1")
    drawTreeBranch("ec12unl", "dilstudy1")
    drawTreeBranch("dilstudy1", "dilstudy2")
    drawTreeBranch("dilstudy2", "dilstudy3")
    drawTreeBranch("dilstudy3", "dilstudy4")
    drawTreeBranch("dilstudy4", "dilstudy5")
    drawTreeBranch("dilstudy5", "dilstudy6")
    if (shiftDown && document.getElementById("eternitystore").style.display !== "none" && document.getElementById("timestudies").style.display !== "none") {
        for (i=0; i<all.length; i++) {
            var start = document.getElementById(all[i]).getBoundingClientRect();
            var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
            var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.font = "15px Typewriter";
            if (document.getElementById(all[i]).className.split(" ")[1] !== undefined || all[i] > 220) {
                var tempName = document.getElementById(all[i]).className.split(" ")[1];
                var name;
                if (all[i] == 222 || all[i] == 223 || all[i] == 226 || all[i] == 227 || all[i] == 232 || all[i] == 233) name = "dark"
                else if (all[i] == 221 || all[i] == 224 || all[i] == 225 || all[i] == 228 || all[i] == 231 || all[i] == 234) name = "light"
                else if (tempName.includes("normaldimstudy")) name = "normal dims"
                else if (tempName.includes("infdimstudy")) name = "infinity dims"
                else if (tempName.includes("timedimstudy")) name = "time dims"
                else if (tempName.includes("activestudy")) name = "active"
                else if (tempName.includes("passivestudy")) name = "passive"
                else if (tempName.includes("idlestudy")) name = "idle"
                ctx.strokeText(all[i]+" "+name, x1 - start.width / 2, y1 - start.height / 2 - 1);
                ctx.fillText(all[i]+" "+name, x1 - start.width / 2, y1 - start.height / 2 - 1);
            } else {
                ctx.strokeText(all[i], x1 - start.width / 2, y1 - start.height / 2 - 1);
                ctx.fillText(all[i], x1 - start.width / 2, y1 - start.height / 2 - 1);
            }
        }
    }
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
    ctx4.clearRect(0, 0, canvas.width, canvas.height);
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
var network;


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
    nodes.update([{id:0, color: getNodeColor(0, 1) }]);
    for (var i=0; i<nodes.length-1; i++) {
        var id = parseInt(Object.keys(CONNECTED_PERKS)[i])
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
    nodesArray = [{id: 0, label: "0", color: getNodeColor(0, 1), title: "You can now choose from 3 different glyphs on reality."}, //DONE
    {id: 1, label: "1", color: getNodeColor(1, 1), title: "+5 base Automator rows."}, //DONE
    {id: 2, label: "2", color: getNodeColor(2, 1), title: "+10 base Automator rows."}, //DONE
    {id: 3, label: "3", color: getNodeColor(3, 1), title: "Improve the automator row per reality scaling."}, //DONE
    {id: 4, label: "4", color: getNodeColor(4, 1), title: "EC1 requirement removed from study 181"}, //DONE
    {id: 11, label: "11", color: getNodeColor(11, 1), title: "The 2nd rebuyable dilation upgrade no longer resets your dilated time."}, //DONE
    {id: 12, label: "12", color: getNodeColor(12, 1), title: "Rebuyable dilation upgrade autobuyers."}, //DONE
    {id: 13, label: "13", color: getNodeColor(13, 1), title: "Remove the unlock requirement for Time Dilation."}, //DONE
    {id: 14, label: "14", color: getNodeColor(14, 1), title: "Gain second row of dilation upgrades on dilation unlock."}, //DONE
    {id: 15, label: "15", color: getNodeColor(15, 1), title: "Gain third row of dilation upgrades on dilation unlock."}, //DONE
    {id: 21, label: "21", color: getNodeColor(21, 1), title: "+1 to base glyph level."}, //DONE
    {id: 22, label: "22", color: getNodeColor(22, 1), title: "+1 glyph choice on reality."}, //DONE
    {id: 23, label: "23", color: getNodeColor(23, 1), title: "+5% minimum glyph rarity."}, //DONE
    {id: 24, label: "24", color: getNodeColor(24, 1), title: "+1 to base glyph level."}, //DONE
    {id: 31, label: "31", color: getNodeColor(31, 1), title: "Remove the secondary requirements for unlocking eternity challenges."}, //DONE
    {id: 32, label: "32", color: getNodeColor(32, 1), title: "You can complete multiple tiers of eternity challenges at once if you reach the goal for a higher completion of that challenge."},
    {id: 33, label: "33", color: getNodeColor(33, 1), title: "You start with 10 Tachyon Particles after unlocking dilation."},
    {id: 41, label: "41", color: getNodeColor(41, 1), title: "Start with the 1st achievement row after reality."}, //DONE
    {id: 42, label: "42", color: getNodeColor(42, 1), title: "Start with the 2nd achievement row after reality."}, //DONE
    {id: 43, label: "43", color: getNodeColor(43, 1), title: "Start with the 3rd achievement row after reality."}, //DONE
    {id: 44, label: "44", color: getNodeColor(44, 1), title: "Start with the 4th achievement row after reality."}, //DONE
    {id: 45, label: "45", color: getNodeColor(45, 1), title: "Start with the 5th achievement row after reality."}, //DONE
    {id: 46, label: "46", color: getNodeColor(46, 1), title: "Start with the 6th achievement row after reality."}, //DONE
    {id: 47, label: "47", color: getNodeColor(47, 1), title: "Start with the 7th achievement row after reality."}, //DONE
    {id: 48, label: "48", color: getNodeColor(48, 1), title: "Start with the 8th achievement row after reality."}, //DONE
    {id: 49, label: "49", color: getNodeColor(49, 1), title: "Start with the 9th achievement row after reality."}, //DONE
    {id: 410, label: "410", color: getNodeColor(410, 1), title: "Start with the 10th achievement row after reality."}, //DONE
    {id: 411, label: "411", color: getNodeColor(411, 1), title: "Start with the 11th achievement row after reality."}, //DONE
    {id: 412, label: "412", color: getNodeColor(412, 1), title: "Start with the 12th achievement row after reality."},//DONE
    {id: 413, label: "413", color: getNodeColor(413, 1), title: "Start with the 13th achievement row after reality."},//DONE
    {id: 51, label: "51", color: getNodeColor(51, 1), title: "Start with 100 antimatter after every reset"}, //DONE
    {id: 52, label: "52", color: getNodeColor(52, 1), title: "Start with 1e130 antimatter after every reset"}, //DONE
    {id: 53, label: "53", color: getNodeColor(53, 1), title: "Start with 2e15 IP after every Eternity and Reality"}, //DONE
    {id: 54, label: "54", color: getNodeColor(54, 1), title: "Start with 2e130 IP after every Eternity and Reality"}, //DONE
    {id: 55, label: "55", color: getNodeColor(55, 1), title: "Start with 10 EP after every Reality"}, //DONE
    {id: 56, label: "56", color: getNodeColor(56, 1), title: "Start with 2000 EP after every Reality"}, //DONE
    {id: 57, label: "57", color: getNodeColor(57, 1), title: "Start with 1e9 EP after every Reality"}, //DONE
    {id: 61, label: "61", color: getNodeColor(61, 1), title: "Infinity dimension autobuyers work 3 times faster."}, //DONE
    {id: 62, label: "62", color: getNodeColor(62, 1), title: "Replicanti autobuyers work 3 times faster."}, //DONE
    {id: 63, label: "63", color: getNodeColor(63, 1), title: "Dilation autobuyers work 3 times faster."}, //DONE
    {id: 64, label: "64", color: getNodeColor(64, 1), title: "Autobuyer for Time dimension 5-8 unlocks."}, //DONE
    {id: 71, label: "71", color: getNodeColor(71, 1), title: "3x replicanti doesn't require EC5."}, //DONE
    {id: 72, label: "72", color: getNodeColor(72, 1), title: "Active path EP mult is always at 50x."}, //DONE
    {id: 73, label: "73", color: getNodeColor(73, 1), title: "Idle path EP mult starts as if you have spent 15 minutes in this eternity."}, //DONE
    {id: 81, label: "81", color: getNodeColor(81, 1), title: "Get the first row of eternity upgrades after first eternity of a reality."}, //DONE
    {id: 82, label: "82", color: getNodeColor(82, 1), title: "Get the second row of eternity upgrades after first eternity of a reality."}, //DONE
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