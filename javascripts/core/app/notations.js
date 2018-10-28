var Notation = function Notation(name) {
    this.name = name;

    this.isCancer = function () {
        return name === "Cancer";
    };

    this.isPain = function () {
        return ["Standard", "Cancer", "Brackets"].includes(name);
    };
};

Notation.current = function () {
    return new Notation(player.options.notation);
};

Notation.set = function (name) {
    if (name === undefined) {
        name = "Standard";
    }
    if (name === "Mixed") {
        name = "Mixed scientific";
    }
    if (name === "Default") {
        name = "Brackets";
    }
    if (name === "Emojis") {
        name = "Cancer";
    }
    player.options.notation = name;
    updateLastTenRuns();
    updateLastTenEternities();
    updateLastTenRealities();
    updateTickSpeed();
    updateCosts();
    updateDilationUpgradeCosts();
    updateAutobuyers();
    updateEpMultButton();
};