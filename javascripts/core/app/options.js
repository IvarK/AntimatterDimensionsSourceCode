function optionsSetNextTheme() {
    let themes = [
        undefined,
        "Metro",
        "Dark",
        "Dark Metro",
        "Inverted",
        "Inverted Metro"
    ];

    let currentThemeIndex = themes.indexOf(player.options.theme);
    if (currentThemeIndex === themes.length - 1 || currentThemeIndex === -1) {
        player.options.theme = getNextSecretTheme();
    } else {
        let nextTheme = themes[currentThemeIndex + 1];
        if (nextTheme === "Dark") {
            Chart.defaults.global.defaultFontColor = '#888';
            normalDimChart.data.datasets[0].borderColor = '#888';
        }
        if (nextTheme === "Dark Metro") {
            Chart.defaults.global.defaultFontColor = 'black';
            normalDimChart.data.datasets[0].borderColor = '#000';
        }
        player.options.theme = nextTheme;
    }

    setTheme(player.options.theme);
}

function getNextSecretTheme() {
    function setDefaultTheme() {
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000';
        return undefined;
    }
    function setTheme(theme) {
        player.options.secretThemeKey = theme.substr(2);
        return theme.substr(0, 2);
    }

    if (player.secretUnlocks.themes.length === 0)
        return setDefaultTheme();

    let unlockedThemes = player.secretUnlocks.themes.distinct().sort();
    let currentTheme = player.options.theme;
    if (currentTheme === "Inverted Metro")
        return setTheme(unlockedThemes[0]);

    let currentThemeIndex = unlockedThemes
        .map(function (value) { return value.substr(0, 2); })
        .indexOf(currentTheme);
    if (currentThemeIndex === unlockedThemes.length - 1)
        return setDefaultTheme();

    return setTheme(unlockedThemes[currentThemeIndex + 1]);
}