GameDatabase.Celestials = {} // This could probably go somewhere else but its temporary here
GameDatabase.Celestials.V = {
    mainUnlock: {
        realities: 10000,
        eternities: 1e60,
        infinities: 1e150,
        dilatedTime: 1e250,
        replicanti: new Decimal("1e250000")
    }
}

const V_UNLOCKS = {
    MAIN_UNLOCK: {
        id: 0,
        description: "Fully unlocks V, The Celestial Of Achievements",
        requirement: () => V.mainUnlockBool()
    }
}

const V = {
    mainUnlockBool() {
        const db = GameDatabase.Celestials.V.mainUnlock
        if (player.realities < db.realities) return false
        if (player.eternities < db.eternities) return false
        if (player.infinitied + player.infinitiedBank < db.infinities) return false
        if (player.dilation.dilatedTime.lt(db.dilatedTime)) return false
        if (player.replicanti.amount.lt(db.replicanti)) return false

        return true;
    },
    checkForUnlocks() {
        for (i in V_UNLOCKS) {
            const unl = V_UNLOCKS[i]
            if (unl.requirement() && !this.has(unl)) {
                player.celestials.v.unlocks.push(unl.id)
                GameUI.notify.success(unl.description);
            }
        }
    },
    has(info) {
        return player.celestials.v.unlocks.includes(info.id)
    }
}