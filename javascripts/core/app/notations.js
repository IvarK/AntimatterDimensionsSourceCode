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
    return new Notation(typeof player !== "undefined" ? player.options.notation : undefined);
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
    setAchieveTooltip();
    updateCosts();
    updateDilationUpgradeCosts();
    updateAutobuyers();
    document.getElementById("epmult").innerHTML =
        "You gain 5 times more EP<p>Currently: " + shortenDimensions(player.epmult) +
        "x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP";
};