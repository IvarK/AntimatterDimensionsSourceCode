"use strict";

const Theme = function Theme(name, config) {
  this.name = name;

  this.isDark = function() {
    return this.isDefault()
      ? player.options.newUI
      : config.isDark;
  };

  this.isMetro = config.isMetro;

  this.isAnimated = config.isAnimated;

  this.isSecret = config.isSecret;

  this.isDefault = function() {
    return name === "Normal";
  };

  this.isAvailable = function() {
    if (!this.isSecret) return true;
    return player.secretUnlocks.themes.countWhere(theme => theme.includes(name)) !== 0;
  };

  this.displayName = function() {
    if (!this.isSecret || !this.isAvailable()) return name;
    // Secret themes are stored as "S9Whatever", so we need to strip the SN part
    return player.secretUnlocks.themes.find(theme => theme.includes(name)).replace(/\S[0-9]*/u, "");
  };

  this.set = function() {
    // Remove all entries in the class list from the class list
    document.body.classList.remove(...document.body.classList);

    document.body.classList.add(this.cssClass());
    if (this.isMetro) document.body.classList.add("s-base--metro");
    if (this.isDark()) document.body.classList.add("s-base--dark");

    if (this.isAnimated && player.options.animations.background) {
      document.getElementById("background-animations").style.display = "block";
    } else {
      document.getElementById("background-animations").style.display = "none";
    }
    player.options.theme = name;
    ui.view.theme = name;
    window.getSelection().removeAllRanges();
    PerkNetwork.forceNetworkRemake();
  };

  this.cssClass = function() {
    return `t-${this.name.replace(/\s+/gu, "-").toLowerCase()}`;
  };
};

Theme.current = function() {
  return Themes.find(player.options.theme);
};

Theme.set = function(name) {
  const theme = Themes.find(name);
  theme.set();
  return theme;
};

Theme.secretThemeIndex = function(name) {
  const secretThemes = [
    "ef853879b60fa6755d9599fd756c94d112f987c0cd596abf48b08f33af5ff537",
    "078570d37e6ffbf06e079e07c3c7987814e03436d00a17230ef5f24b1cb93290",
    "a3d64c3d1e1749b60b2b3dba10ed5ae9425300e9600ca05bcbafe4df6c69941f",
    "d910565e1664748188b313768c370649230ca348cb6330fe9df73bcfa68d974d",
    "cb72e4a679254df5f99110dc7a93924628b916d2e069e3ad206db92068cb0883",
    "c8fac64da08d674123c32c936b14115ab384fe556fd24e431eb184a8dde21137",
    "da3b3c152083f0c70245f104f06331497b97b52ac80edec05e26a33ee704cae7",
    "1bbc0800145e72dfea5bfb218eba824c52510488b3a05ee88feaaa6683322d19",
    "dba8336cd3224649d07952b00045a6ec3c8df277aa8a0a0e3e7c2aaa77f1fbb9",
    "73de8a7f9efa1cbffc80a8effc9891a799127cd204b3a8b023bea8f513ed4753",
  ];
  const sha = sha512_256(name.toUpperCase());
  return secretThemes.indexOf(sha);
};

Theme.isSecretTheme = function(name) {
  return Theme.secretThemeIndex(name) !== -1;
};

Theme.animatedThemeUnlocked = function() {
  return Themes.all.some(theme => theme.isAvailable && theme.isAnimated);
};

Theme.tryUnlock = function(name) {
  const index = Theme.secretThemeIndex(name);
  if (index === -1) {
    return false;
  }
  const prefix = `S${index + 1}`;
  const fullName = prefix + name.capitalize();
  const isAlreadyUnlocked = player.secretUnlocks.themes.has(fullName);
  player.secretUnlocks.themes.add(fullName);
  Theme.set(prefix);
  SecretAchievement(25).unlock();
  if (!isAlreadyUnlocked) {
    GameUI.notify.success(`You have unlocked the ${name.capitalize()} theme!`);
  }
  return true;
};

Theme.create = function(name, settings) {
  const config = {
    isDark: false || settings.dark,
    isMetro: false || settings.metro,
    isAnimated: false || settings.animated,
    isSecret: false || settings.secret,
  };
  return new Theme(name, config);
};

const Themes = {
  all: [
    /* eslint-disable no-multi-spaces */
    // Note that "Normal" is a special case where dark is overridden elsewhere with whether or not the UI is New
    Theme.create("Normal",          {                                                         }),
    Theme.create("Metro",           {              metro: true,                               }),
    Theme.create("Dark",            { dark: true,                                             }),
    Theme.create("Dark Metro",      { dark: true,  metro: true,                               }),
    Theme.create("Inverted",        {                                                         }),
    Theme.create("Inverted Metro",  {              metro: true,                               }),
    Theme.create("S1",              {                           animated: true, secret: true, }),
    Theme.create("S2",              {                                           secret: true, }),
    Theme.create("S3",              {                                           secret: true, }),
    Theme.create("S4",              {                                           secret: true, }),
    Theme.create("S5",              {                                           secret: true, }),
    Theme.create("S6",              { dark: true,               animated: true, secret: true, }),
    Theme.create("S7",              {                                           secret: true, }),
    Theme.create("S8",              {              metro: true,                 secret: true, }),
    Theme.create("S9",              {                                           secret: true, }),
    Theme.create("S10",             { dark: true,  metro: true, animated: true, secret: true, }),
    /* eslint-enable no-multi-spaces */
  ],

  available() {
    return Themes.all
      .filter(theme => theme.isAvailable());
  },

  find(name) {
    return Themes.all
      .find(theme => theme.name === name);
  }
};
