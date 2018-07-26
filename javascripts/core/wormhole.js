/**
 * Interval: starts at 3600, x0.8 per upgrade, upgrade cost goes x2.5, starts at 15
 * Power: starts at 5, x1.35 per upgrade, cost goes x2, starts at 20
 * Duration: starts at 10, x1.5 per upgrade, cost goes x3, starts at 10
 * 
 */

 function updateWormholeUpgrades() {
    $("#wormholeInterval").html("Speed up the wormhole up 25%<br>Current interval: "+(player.wormhole.speed).toFixed(1)+" seconds<br>Cost: "+shorten(getWormholeIntervalCost())+"RM")
    if (player.reality.realityMachines < getWormholeIntervalCost()) $("#wormholeInterval").addClass("rUpgUn")
    else $("#wormholeInterval").removeClass("rUpgUn")

    $("#wormholePower").html("Make the wormhole 35% more powerful<br>Current power: "+(player.wormhole.power).toFixed(1)+" seconds<br>Cost: "+shorten(getWormholePowerCost())+"RM")
    if (player.reality.realityMachines < getWormholePowerCost()) $("#wormholePower").addClass("rUpgUn")
    else $("#wormholePower").removeClass("rUpgUn")

    $("#wormholeDuration").html("Extend the wormhole duration by 50%<br>Current duration: "+(player.wormhole.duration).toFixed(1)+" seconds<br>Cost: "+shorten(getWormholeDurationCost())+"RM")
    if (player.reality.realityMachines < getWormholeDurationCost()) $("#wormholeDuration").addClass("rUpgUn")
    else $("#wormholeDuration").removeClass("rUpgUn")
 }

function getWormholeIntervalCost() {
    var amountOfPurchases = Math.round(Math.log(player.wormhole.speed / 3600) / Math.log(0.8))
    return Math.pow(2.5, amountOfPurchases) * 15
}

function getWormholePowerCost() {
    var amountOfPurchases = Math.round(Math.log(player.wormhole.speed / 5) / Math.log(1.35))
    return Math.pow(2, amountOfPurchases) * 20
}

function getWormholeDurationCost() {
    var amountOfPurchases = Math.round(Math.log(player.wormhole.speed / 10) / Math.log(1.5))
    return Math.pow(3, amountOfPurchases) * 10
}

function upgradeWormholeInterval() {
    var cost = getWormholeIntervalCost()
    if (cost > player.reality.realityMachines) return false
    player.reality.realityMachines -= cost
    player.wormhole.speed *= 0.8
    updateWormholeUpgrades()
}

function upgradeWormholePower() {
    var cost = getWormholePowerCost()
    if (cost > player.reality.realityMachines) return false
    player.reality.realityMachines -= cost
    player.wormhole.speed *= 1.35
    updateWormholeUpgrades()
}

function upgradeWormholeDuration() {
    var cost = getWormholeDurationCost()
    if (cost > player.reality.realityMachines) return false
    player.reality.realityMachines -= cost
    player.wormhole.speed *= 1.5
    updateWormholeUpgrades()
}

function wormHoleLoop(diff) {
    
    if (player.wormhole.active) {
        player.wormhole.phase += diff / 10 / player.wormhole.power
        if (player.wormhole.phase >= player.wormhole.duration) {
            player.wormhole.phase = 0
            player.wormhole.active = false
        }
    } else {
        player.wormhole.phase += diff / 10
        if (player.wormhole.phase >= player.wormhole.speed) {
            player.wormhole.phase = 0
            player.wormhole.active = true
        }
    }
}