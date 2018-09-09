/**
 * Interval: starts at 3600, x0.8 per upgrade, upgrade cost goes x3.5, starts at 15
 * Power: starts at 5, x1.35 per upgrade, cost goes x2, starts at 20
 * Duration: starts at 10, x1.5 per upgrade, cost goes x4, starts at 10
 * 
 */

 function updateWormholeUpgrades() {
    $("#wormholeinterval").html("Speed up the wormhole up 25%<br>Current interval: "+(player.wormhole.speed).toFixed(1)+" seconds<br>Cost: "+shortenDimensions(getWormholeIntervalCost())+"RM")
    if (player.reality.realityMachines < getWormholeIntervalCost()) $("#wormholeinterval").addClass("rUpgUn")
    else $("#wormholeinterval").removeClass("rUpgUn")

    $("#wormholepower").html("Make the wormhole 35% more powerful<br>Current power: "+(player.wormhole.power).toFixed(1)+"x<br>Cost: "+shortenDimensions(getWormholePowerCost())+"RM")
    if (player.reality.realityMachines < getWormholePowerCost()) $("#wormholepower").addClass("rUpgUn")
    else $("#wormholepower").removeClass("rUpgUn")

    $("#wormholeduration").html("Extend the wormhole duration by 30%<br>Current duration: "+(player.wormhole.duration).toFixed(1)+" seconds<br>Cost: "+shortenDimensions(getWormholeDurationCost())+"RM")
    if (player.reality.realityMachines < getWormholeDurationCost()) $("#wormholeduration").addClass("rUpgUn")
    else $("#wormholeduration").removeClass("rUpgUn")
 }

function unlockWormhole() {
    if (player.reality.realityMachines.lt(50)) return false
    if (player.wormhole.unlocked) return false
    player.wormhole.unlocked = true
    player.reality.realityMachines = player.reality.realityMachines.minus(50)
    $("#wormholecontainer").show()
    $("#wormholeunlock").hide()
}

function getWormholeIntervalCost() {
    var amountOfPurchases = Math.round(Math.log(player.wormhole.speed / 3600) / Math.log(0.8))
    return Math.ceil(Math.pow(3.5, amountOfPurchases) * 15)
}

function getWormholePowerCost() {
    var amountOfPurchases = Math.round(Math.log(player.wormhole.power / 180) / Math.log(1.35))
    return Math.ceil(Math.pow(2, amountOfPurchases) * 20)
}

function getWormholeDurationCost() {
    var amountOfPurchases = Math.round(Math.log(player.wormhole.duration / 10) / Math.log(1.5))
    return Math.ceil(Math.pow(4, amountOfPurchases) * 10)
}

function upgradeWormholeInterval() {
    var cost = getWormholeIntervalCost()
    if (player.reality.realityMachines.lt(cost)) return false
    player.reality.realityMachines = player.reality.realityMachines.minus(cost)
    player.wormhole.speed *= 0.8
    updateWormholeUpgrades()
}

function upgradeWormholePower() {
    var cost = getWormholePowerCost()
    if (player.reality.realityMachines.lt(cost)) return false
    player.reality.realityMachines = player.reality.realityMachines.minus(cost)
    player.wormhole.power *= 1.35
    updateWormholeUpgrades()
}

function upgradeWormholeDuration() {
    var cost = getWormholeDurationCost()
    if (player.reality.realityMachines.lt(cost)) return false
    player.reality.realityMachines = player.reality.realityMachines.minus(cost)
    player.wormhole.duration *= 1.3
    updateWormholeUpgrades()
}

function wormHoleLoop(diff) {
    
    if (player.wormhole.active) {
        player.wormhole.phase += diff / 1000 / player.wormhole.power
        if (player.wormhole.phase >= player.wormhole.duration) {
            player.wormhole.phase = 0
            player.wormhole.active = false
        }
    } else {
        player.wormhole.phase += diff / 1000
        if (player.wormhole.phase >= player.wormhole.speed) {
            player.wormhole.phase = 0
            player.wormhole.active = true
        }
    }

    var rotation = player.wormhole.phase / player.wormhole.speed * 180
    if (player.wormhole.active ) {
        $('.radial-progress .inset').css("background-color", "red")
        var rotation = player.wormhole.phase / player.wormhole.duration * 180
        $('.circle .fill').css("background-color", 'red');
    }
    else {
        $('.radial-progress .inset').css("background-color", "#fbfbfb")
        $('.circle .fill').css("background-color", "#97a71d")
    }
    $('.circle .fill').css("transform", 'rotate(' + rotation + 'deg)');
    $('.circle .full').css("transform", 'rotate(' + rotation + 'deg)');
    $('.circle .fill .fix').css("transform", 'rotate(' + (rotation * 2) + 'deg)');
}

