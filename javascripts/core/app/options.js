function optionsSetNextTheme() {
    if (player.options.theme === undefined) {
        player.options.theme = "Metro";
    } else if (player.options.theme === "Metro") {
        player.options.theme = "Dark";
        Chart.defaults.global.defaultFontColor = '#888';
        normalDimChart.data.datasets[0].borderColor = '#888'
    } else if (player.options.theme === "Dark") {
        player.options.theme = "Dark Metro";
    } else if (player.options.theme === "Dark Metro") {
        player.options.theme = "Inverted";
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
    } else if (player.options.theme === "Inverted") {
        player.options.theme = "Inverted Metro";
    } else {
        player.options.theme = getNextSecretTheme();
    }

    setTheme(player.options.theme);
}

function getNextSecretTheme() {
    if (player.options.theme === "Inverted Metro") var currentThemeNum = 0
    else var currentThemeNum = parseInt(player.options.theme[1])
    var lowestThemeNum = 100;
    for (i in player.secretUnlocks.themes) {
        if (currentThemeNum < 1 && sha512_256(player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1].toUpperCase()) === "ef853879b60fa6755d9599fd756c94d112f987c0cd596abf48b08f33af5ff537") {
            if (lowestThemeNum > 1) {
                lowestThemeNum = 1;
                player.options.secretThemeKey = player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1]
            }
        } else if (currentThemeNum < 2 && sha512_256(player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1].toUpperCase()) === "078570d37e6ffbf06e079e07c3c7987814e03436d00a17230ef5f24b1cb93290") {
            if (lowestThemeNum > 2) {
                lowestThemeNum = 2;
                player.options.secretThemeKey = player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1]
            }
        } else if (currentThemeNum < 3 && sha512_256(player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1].toUpperCase()) === "a3d64c3d1e1749b60b2b3dba10ed5ae9425300e9600ca05bcbafe4df6c69941f") {
            if (lowestThemeNum > 3) {
                lowestThemeNum = 3;
                player.options.secretThemeKey = player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1]
            }
        } else if (currentThemeNum < 4 && sha512_256(player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1].toUpperCase()) === "d910565e1664748188b313768c370649230ca348cb6330fe9df73bcfa68d974d") {
            if (lowestThemeNum > 4) {
                lowestThemeNum = 4;
                player.options.secretThemeKey = player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1]
            }
        } else if (currentThemeNum < 5 && sha512_256(player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1].toUpperCase()) === "cb72e4a679254df5f99110dc7a93924628b916d2e069e3ad206db92068cb0883") {
            if (lowestThemeNum > 5) {
                lowestThemeNum = 5;
                player.options.secretThemeKey = player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1]
            }
        } else if (currentThemeNum < 6 && sha512_256(player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1].toUpperCase()) === "c8fac64da08d674123c32c936b14115ab384fe556fd24e431eb184a8dde21137") {
            if (lowestThemeNum > 6) {
                lowestThemeNum = 6;
                player.options.secretThemeKey = player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1]
            }
        } else if (currentThemeNum < 7 && sha512_256(player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1].toUpperCase()) === "da3b3c152083f0c70245f104f06331497b97b52ac80edec05e26a33ee704cae7") {
            if (lowestThemeNum > 7) {
                lowestThemeNum = 7;
                player.options.secretThemeKey = player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1]
            }
        } else if (currentThemeNum < 8 && sha512_256(player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1].toUpperCase()) === "1bbc0800145e72dfea5bfb218eba824c52510488b3a05ee88feaaa6683322d19") {
            if (lowestThemeNum > 8) {
                lowestThemeNum = 8;
                player.options.secretThemeKey = player.secretUnlocks.themes[i].split(player.secretUnlocks.themes[i][1])[1]
            }
        }
    }
    if (lowestThemeNum === 100) {
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
        return undefined
    } else {
        return "S"+lowestThemeNum
    }
}