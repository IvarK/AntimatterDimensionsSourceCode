"use strict";

var player = {};

function changestate(n) {
    var classes = document.getElementById('div'+n).classList
    if(classes.contains('hidden')){
		classes.remove('hidden');
	    classes.add('shown');
	}
    else{
		classes.remove('shown');
		classes.add('hidden');
	}
}

if (localStorage.getItem("howToSpoilers") !== null) var spoilers = parseInt(localStorage.getItem("howToSpoilers"))
else var spoilers = 0

if (spoilers === 0) document.getElementById("showspoilersbtn").innerHTML = "View: <br> Avoid spoilers"
else document.getElementById("showspoilersbtn").innerHTML= "View: <br> Show spoilers"

function save() {
	localStorage.setItem("howToSpoilers", spoilers)
}

function get_save(name) {
    if (localStorage.getItem("dimensionSave") !== null) {
        return JSON.parse(atob(localStorage.getItem(name), function(k, v) { return (v === Infinity) ? "Infinity" : v; }))
	}
}

function load_game() {
    var save_data = get_save('dimensionSave');
    if (!save_data) return;
	player = save_data;
}

function showspoilers() {
	if (spoilers === 0) {
		spoilers = 1;
		document.getElementById("showspoilersbtn").innerHTML= "View: <br> Show spoilers"
	} else {
		spoilers = 0;
		document.getElementById("showspoilersbtn").innerHTML = "View: <br> Avoid spoilers"
	}
	save()
	updateSpoilers();
}

function updateSpoilers() {
	if (spoilers === 0) {
    for (let i = 1; i < 25; i++) {
			let displayed = 0;
			if (i < 5) {
				displayed = 1 - displayed;
			}
			if (i === 5 && (DimBoost.totalBoosts >= 4 || player.infinitied.gte(1) || PlayerProgress.eternityUnlocked())) {
				displayed = 1 - displayed;
			}
			if (i === 7 && (player.galaxies >= 1 || player.infinitied.gte(1) || PlayerProgress.eternityUnlocked())) {
				displayed = 1 - displayed;
			}
			if ((i >= 8 && i <= 10) && (player.infinitied.gte(1) || PlayerProgress.eternityUnlocked())) {
				displayed = 1 - displayed;
			}
			if (i === 11 && (player.auto.bigCrunch.interval > 100 || PlayerProgress.eternityUnlocked())) {
				displayed = 1 - displayed;
			}
			if (i === 12 && (player.infDimensionsUnlocked[0] || PlayerProgress.eternityUnlocked())) {
				displayed = 1 - displayed;
			}
			if (i === 13 && (player.postChallUnlocked >= 5 || PlayerProgress.eternityUnlocked())) {
				displayed = 1 - displayed;
			}
			if ((i >= 14 && i <= 17) && (player.replicanti.unl || PlayerProgress.eternityUnlocked())) {
				displayed = 1 - displayed;
			}
			if (i === 18 && (PlayerProgress.eternityUnlocked())) {
				displayed = 1 - displayed;
				 }
			if (i === 19 && player.eternityChalls.eterc11 === 5 || player.eternityChalls.eterc12 === 5) { 
				displayed = 1 - displayed;
			} 
			if (i === 20 && player.dilation.studies.length === 5) {
				displayed = 1 - displayed;
			}
			if ((i === 21 || i === 22) && player.realities >= 1) {
				displayed = 1 - displayed;
			}
			if (i === 23 && player.realities >= 4) {
				displayed = 1 - displayed;
			}
			if (i === 24 && player.reality.realityMachines >= 50 || player.reality.blackHole[0].unlocked) {
				displayed = 1 - displayed;
			}
			if (i === 25 && RealityUpgrades.allBought) {
				displayed = 1 - displayed;
			}

			if (displayed === 1) {
				document.getElementById("div"+i+"btn").style.display = "block";
				document.getElementById("div"+i+"hr").style.display = "block";
			} else {
				document.getElementById("div"+i+"btn").style.display = "none";
				document.getElementById("div"+i+"hr").style.display = "none";
			}
		}
	} else {
    for (let i = 1; i < 25; i++) {
			document.getElementById("div"+i+"btn").style.display = "block";
			document.getElementById("div"+i+"hr").style.display = "block";
		}
	}
}

document.getElementById("importbtn").onclick = function () {
    var save_data = prompt("Input your save.");
	save_data = JSON.parse(atob(save_data), function(k, v) { return (v === Infinity) ? "Infinity" : v; });
	if (!save_data) {
		alert('could not load the save..');
		return;
	}
	player = save_data;
	updateSpoilers()
};

load_game();
save()
updateSpoilers()
