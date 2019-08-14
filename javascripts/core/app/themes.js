var Theme = function Theme(name, colors) {
    this.name = name;

    this.isDefault = function () {
        return name === undefined;
    };

    this.isSecret = function () {
        return !this.isDefault() && name.length === 2;
    };

    this.isAvailable = function () {
        if (!this.isSecret()) return true;
        return player.secretUnlocks.themes
            .some(function (theme) { return theme.includes(name); });
    };

    this.displayName = function () {
        if (this.isDefault()) return "Normal";
        if (!this.isSecret()) return name;
        if (!this.isAvailable()) {
            console.warn("Secret theme " + name + " is not unlocked yet!");
            return name;
        }
        // Secret themes are stored as "S9Whatever", so we need to strip the SN part
        return player.secretUnlocks.themes
            .find(function (theme) { return theme.includes(name); })
            .substr(2);
    };

    this.set = function () {
        for (let c of document.body.classList) {
          if (c.startsWith("t-")) {
            document.body.classList.remove(c);
          }
        }
        if (!this.isDefault()) {
          document.body.classList.add(this.cssClass());
        }
        player.options.theme = name;
        ui.view.theme = name;
        if (this.isSecret())
            player.options.secretThemeKey = this.displayName();

        Chart.defaults.global.defaultFontColor = colors.chartFont;
        normalDimChart.data.datasets[0].borderColor = colors.chartBorder;
    };

    this.cssClass = function() {
      return "t-" + this.name.replace(/\s+/g, '-').toLowerCase();
    };
};

Theme.current = function () {
    return Themes.find(player.options.theme);
};

Theme.set = function(name) {
    let theme = Themes.find(name);
    theme.set();
    return theme;
};

Theme.secretThemeIndex = function(name) {
  let secretThemes = [
    "ef853879b60fa6755d9599fd756c94d112f987c0cd596abf48b08f33af5ff537",
    "078570d37e6ffbf06e079e07c3c7987814e03436d00a17230ef5f24b1cb93290",
    "a3d64c3d1e1749b60b2b3dba10ed5ae9425300e9600ca05bcbafe4df6c69941f",
    "d910565e1664748188b313768c370649230ca348cb6330fe9df73bcfa68d974d",
    "cb72e4a679254df5f99110dc7a93924628b916d2e069e3ad206db92068cb0883",
    "c8fac64da08d674123c32c936b14115ab384fe556fd24e431eb184a8dde21137",
    "da3b3c152083f0c70245f104f06331497b97b52ac80edec05e26a33ee704cae7",
    "1bbc0800145e72dfea5bfb218eba824c52510488b3a05ee88feaaa6683322d19"
  ];
  let sha = sha512_256(name.toUpperCase());
  return secretThemes.indexOf(sha);
};

Theme.isSecretTheme = function(name) {
  return Theme.secretThemeIndex(name) !== -1;
};

Theme.tryUnlock = function(name) {
    let index = Theme.secretThemeIndex(name);
    if (index === -1) {
      return false;
    }
    let prefix = "S" + (index + 1);
    player.secretUnlocks.themes.push(prefix + name.capitalize());
    Theme.set(prefix);
    giveAchievement("Shhh... It's a secret");
    return true;
};

Theme.light = function(name) {
    let colors = {
        chartFont: '#000',
        chartBorder: '#000'
    };
    return new Theme(name, colors)
};

Theme.dark = function(name) {
    let colors = {
        chartFont: '#888',
        chartBorder: '#888'
    };
    return new Theme(name, colors)
};

var Themes = {
    all: [
        Theme.light(undefined),
        Theme.light("Metro"),
        Theme.dark("Dark"),
        Theme.dark("Dark Metro"),
        Theme.light("Inverted"),
        Theme.light("Inverted Metro"),
        Theme.light("S1"),
        Theme.light("S2"),
        Theme.light("S3"),
        Theme.light("S4"),
        Theme.light("S5"),
        Theme.dark("S6"),
        Theme.light("S7"),
        Theme.light("S8")
    ],

    available: function () {
        return Themes.all
            .filter(function (theme) { return theme.isAvailable(); })
    },

    find: function(name) {
        return Themes.all
            .find(function (theme) { return theme.name === name; });
    }
};