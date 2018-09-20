var PlayerProgress = function PlayerProgress(player) {
    this.infinityUnlocked = function() {
        return player.infinitied > 0 || this.eternityUnlocked();
    };
    this.eternityUnlocked = function() {
        return player.eternities > 0 || this.realityUnlocked();
    };
    this.realityUnlocked = function() {
        return player.realities > 0;
    };
};

PlayerProgress.current = function() {
    return new PlayerProgress(player);
};

PlayerProgress.of = function(player) {
    return new PlayerProgress(player);
};

PlayerProgress.infinityUnlocked = function() {
    return PlayerProgress.current().infinityUnlocked();
};

PlayerProgress.eternityUnlocked = function() {
    return PlayerProgress.current().eternityUnlocked();
};

PlayerProgress.realityUnlocked = function() {
    return PlayerProgress.current().realityUnlocked();
};