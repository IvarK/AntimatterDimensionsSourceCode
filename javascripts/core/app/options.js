document.getElementById("theme").onclick = function (ev) {
    let themes = Themes.available();
    let current = themes.indexOf(Theme.current());
    let next = Math.wrap(current + 1, 0, themes.length - 1);
    let theme = themes[next];
    theme.set();
};

document.getElementById("notation").onclick = function () {
    player.options.scientific = !player.options.scientific;
    if (player.options.notation === "Infinity") {
        player.options.notation = "Scientific";
        document.getElementById("notation").textContent = ("Notation: Scientific")
    } else if (player.options.notation === "Scientific") {
        player.options.notation = "Engineering";
        document.getElementById("notation").textContent = ("Notation: Engineering")
    } else if (player.options.notation === "Engineering") {
        player.options.notation = "Letters";
        document.getElementById("notation").textContent = ("Notation: Letters")
    } else if (player.options.notation === "Letters") {
        player.options.notation = "Standard";
        document.getElementById("notation").textContent = ("Notation: Standard")
    } else if (player.options.notation === "Standard") {
        player.options.notation = "Cancer";
        document.getElementById("notation").textContent = ("Notation: Cancer")
    } else if (player.options.notation === "Cancer") {
        player.options.notation = "Mixed scientific";
        document.getElementById("notation").textContent = ("Notation: Mixed scientific")
    } else if (player.options.notation === "Mixed scientific") {
        player.options.notation = "Mixed engineering";
        document.getElementById("notation").textContent = ("Notation: Mixed engineering")
    } else if (player.options.notation === "Mixed engineering") {
        player.options.notation = "Logarithm";
        document.getElementById("notation").textContent = ("Notation: Logarithm")
    } else if (player.options.notation === "Logarithm") {
        player.options.notation = "Brackets";
        document.getElementById("notation").textContent = ("Notation: Brackets")
    } else if (player.options.notation === "Brackets") {
        player.options.notation = "Infinity";
        document.getElementById("notation").textContent = ("Notation: Infinity")
    }

    updateLastTenRuns();
    updateLastTenEternities();
    updateLastTenRealities();
    updateTickSpeed();
    setAchieveTooltip();
    updateCosts();
    updateDilationUpgradeCosts();
    updateAutobuyers();
    document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"
};