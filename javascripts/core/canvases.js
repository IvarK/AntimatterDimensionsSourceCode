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

function animationOnOff(name) {
    if (player.options.animations[name]) player.options.animations[name] = false;
    else player.options.animations[name] = true;
    if (name == "floatingText") document.getElementById("floatingTextAnimBtn").textContent = "Floating text: " + ((player.options.animations.floatingText) ? "ON" : "OFF")
    else if (name == "bigCrunch") document.getElementById("bigCrunchAnimBtn").textContent = "Big crunch: " + ((player.options.animations.bigCrunch) ? "ON" : "OFF")
    else if (name == "tachyonParticles") document.getElementById("tachyonParticleAnimBtn").textContent = "Tachyon particles: " + ((player.options.animations.tachyonParticles) ? "ON" : "OFF")
    else if (name == "reality") document.getElementById("realityAnimBtn").textContent = "Reality: " + ((player.options.animations.reality) ? "ON" : "OFF")
    if (player.options.animations[name] && name == "tachyonParticles") requestAnimationFrame(drawAnimations);
}

function drawAnimations(ts){
    if (player.dilation.tachyonParticles.gte(1) && document.getElementById("eternitystore").style.display !== "none" && document.getElementById("dilation").style.display !== "none" && player.options.animations.tachyonParticles) {
        ctx3.clearRect(0, 0, canvas.width, canvas.height);
        if (player.options.theme == "Dark" || player.options.theme == "Dark Metro" || player.options.theme == "S6") ctx3.fillStyle="#FFF";
        else ctx3.fillStyle="#000";
        for (i=0; i<player.dilation.tachyonParticles.exponent+1; i++) {
            if (typeof particles["particle"+i] == "undefined") {
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
            particles["particle"+i].goalX += particles["particle"+i].velocityX
            particles["particle"+i].goalY += particles["particle"+i].velocityY
        }
    }
    delta = (ts - lastTs) / 1000;
    lastTs = ts;
    if (player.options.animations.tachyonParticles) requestAnimationFrame(drawAnimations);
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
            if (player.options.theme === "S6") ctx.strokeStyle="#DDDDDD";
            else ctx.strokeStyle="#000000";
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
    drawTreeBranch("ec1unl", "181")
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
    if (document.getElementById("timestudies").style.display === "none") return
    var start = document.getElementById(num1).getBoundingClientRect();
    var end = document.getElementById(num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    ctx4.lineWidth=10;
    ctx4.beginPath();
    //TODO: add purchases/locked colors to the lines based on commands unlocked
    ctx4.strokeStyle="#000000";
    ctx4.moveTo(x1, y1);
    ctx4.lineTo(x2, y2);
    ctx4.stroke();
}

function drawAutomatorTree() {
    ctx4.clearRect(0, 0, canvas.width, canvas.height);
    drawAutomatorTreeBranch("automator11", "automator21");
    drawAutomatorTreeBranch("automator11", "automator22");
    drawAutomatorTreeBranch("automator11", "automator31");
    drawAutomatorTreeBranch("automator11", "automator32");
    drawAutomatorTreeBranch("automator11", "automator41");
    drawAutomatorTreeBranch("automator11", "automator42");
    drawAutomatorTreeBranch("automator42", "automator51");
    drawAutomatorTreeBranch("automator12", "automator23");
    drawAutomatorTreeBranch("automator12", "automator24");
    drawAutomatorTreeBranch("automator12", "automator33");
    drawAutomatorTreeBranch("automator12", "automator34");
    drawAutomatorTreeBranch("automator12", "automator43");
    drawAutomatorTreeBranch("automator12", "automator44");
}