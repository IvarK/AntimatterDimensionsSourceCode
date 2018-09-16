document.getElementById("theme").onclick = function (ev) {
    let themes = Themes.available();
    let current = themes.indexOf(Theme.current());
    let next = Math.wrap(current + 1, 0, themes.length - 1);
    let theme = themes[next];
    theme.set();
};

document.getElementById("notation").onclick = function () {
    let notations = [
        "Scientific",
        "Engineering",
        "Letters",
        "Standard",
        "Cancer",
        "Mixed scientific",
        "Mixed engineering",
        "Logarithm",
        "Brackets",
        "Infinity"
    ];
    player.options.scientific = !player.options.scientific;
    let currentIndex = notations.indexOf(player.options.notation);
    let nextIndex = Math.wrap(currentIndex + 1, 0, notations.length - 1);
    Notation.set(notations[nextIndex]);
};