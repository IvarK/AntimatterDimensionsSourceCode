// Note: chevrotain doesn't play well with unicode regex
/* eslint-disable require-unicode-regexp */
/* eslint-disable camelcase */
"use strict";

const AutomatorLexer = (() => {
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;

  const createCategory = name => createToken({ name, pattern: Lexer.NA, longer_alt: Identifier });

  // Shorthand for creating tokens and adding them to a list
  const tokenLists = {};
  // eslint-disable-next-line max-params
  const createInCategory = (category, name, pattern, props = {}) => {
    const categories = [category];
    if (props.extraCategories) categories.push(...props.extraCategories);
    const token = createToken({
      name,
      pattern,
      categories,
      longer_alt: Identifier,
    });
    const categoryName = Array.isArray(category) ? category[0].name : category.name;
    if (tokenLists[categoryName] === undefined) tokenLists[categoryName] = [];
    tokenLists[categoryName].push(token);
    const patternWord = pattern.toString().match(/^\/([a-zA-Z0-9]*)\/[a-zA-Z]*$/ui);
    if (patternWord && patternWord[1]) token.$autocomplete = patternWord[1];
    Object.assign(token, props);
    return token;
  };

  const HSpace = createToken({
    name: "HSpace",
    pattern: /[ \t]+/,
    group: Lexer.SKIPPED
  });

  const EOL = createToken({
    name: "EOL",
    line_breaks: true,
    pattern: /[ \t\r]*\n\s*/,
    label: "End of line",
  });

  const Comment = createToken({
    name: "Comment",
    pattern: /(#|\/\/)[^\n]*/,
    group: Lexer.SKIPPED
  });

  const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
  });

  const Identifier = createToken({
    name: "Identifier",
    pattern: /[a-zA-Z_][a-zA-Z_0-9]*/,
  });

  const ComparisonOperator = createToken({
    name: "ComparisonOperator",
    pattern: Lexer.NA,
  });

  const Currency = createCategory("Currency");
  const PrestigeEvent = createCategory("PrestigeEvent");
  const StudyPath = createCategory("StudyPath");
  const TimeUnit = createCategory("TimeUnit");
  const TTCurrency = createCategory("TTCurrency");

  createInCategory(ComparisonOperator, "OpGTE", />=/, {
    $autocomplete: ">=",
    $compare: (a, b) => Decimal.gte(a, b),
  });
  createInCategory(ComparisonOperator, "OpLTE", /<=/, {
    $autocomplete: "<=",
    $compare: (a, b) => Decimal.lte(a, b),
  });
  createInCategory(ComparisonOperator, "OpGT", />/, {
    $autocomplete: ">",
    $compare: (a, b) => Decimal.gt(a, b),
  });
  createInCategory(ComparisonOperator, "OpLT", /</, {
    $autocomplete: "<",
    $compare: (a, b) => Decimal.lt(a, b),
  });
  const OpEQ = createInCategory(ComparisonOperator, "OpEQ", /==/, {
    $compare: (a, b) => Decimal.eq(a, b),
  });
  // EqualSign is a single = which is defined for both comparisons and define
  const EqualSign = createToken({
    name: "EqualSign",
    pattern: /=/,
    categories: ComparisonOperator,
    label: "=",
    longer_alt: OpEQ,
  });
  EqualSign.$compare = (a, b) => Decimal.eq(a, b);

  createInCategory(Currency, "EP", /ep/i, {
    extraCategories: [TTCurrency],
    $buyTT: () => TimeTheorems.buyWithEP(true),
    $getter: () => player.eternityPoints
  });
  createInCategory(Currency, "IP", /ip/i, {
    extraCategories: [TTCurrency],
    $buyTT: () => TimeTheorems.buyWithIP(true),
    $getter: () => player.infinityPoints
  });
  createInCategory(Currency, "AM", /am/i, {
    extraCategories: [TTCurrency],
    $buyTT: () => TimeTheorems.buyWithAntimatter(true),
    $getter: () => player.antimatter
  });
  createInCategory(Currency, "DT", /dt/i, { $getter: () => player.dilation.dilatedTime });
  createInCategory(Currency, "TP", /tp/i, { $getter: () => player.dilation.tachyonParticles });
  createInCategory(Currency, "RG", /rg/i, { $getter: () => new Decimal(Replicanti.galaxies.total) });
  createInCategory(Currency, "RM", /rm/i, { $getter: () => player.reality.realityMachines });

  createInCategory(Currency, "PendingIP", /pending[ \t]+ip/i, {
    $autocomplete: "pending IP",
    $getter: () => (Player.canCrunch ? gainedInfinityPoints() : new Decimal(0))
  });
  createInCategory(Currency, "PendingEP", /pending[ \t]+ep/i, {
    $autocomplete: "pending EP",
    $getter: () => (Player.canEternity ? gainedEternityPoints() : new Decimal(0))
  });
  createInCategory(Currency, "PendingRM", /pending[ \t]+rm/i, {
    $autocomplete: "pending RM",
    $getter: () => (isRealityAvailable() ? gainedRealityMachines() : new Decimal(0))
  });
  createInCategory(Currency, "GlyphLevel", /glyph[ \t]+level/i, {
    $autocomplete: "glyph level",
    $getter: () => new Decimal(isRealityAvailable() ? gainedGlyphLevel().actualLevel : 0),
  });

  createInCategory(Currency, "Rep", /rep(licanti)?/i, {
    $autocomplete: "rep",
    $getter: () => player.replicanti.amount,
  });
  createInCategory(Currency, "TT", /(tt|time theorems?)/i, {
    $autocomplete: "TT",
    $getter: () => player.timestudy.theorem,
  });
  createInCategory(Currency, "Total_TT", /total tt/i, {
    $autocomplete: "total TT",
    $getter: () => player.timestudy.theorem.plus(TimeTheorems.calculateTimeStudiesCost()),
  });

  createInCategory(Currency, "TotalCompletions", /total[ \t]+completions/i, {
    $autocomplete: "total completions",
    $getter: () => EternityChallenges.completions,
  });

  createInCategory(Currency, "PendingCompletions", /pending[ \t]+completions/i, {
    $autocomplete: "pending completions",
    $getter: () => {
      // If we are not in an EC, pretend like we have a ton of completions so any check for sufficient
      // completions returns true
      if (!EternityChallenge.isRunning) return Decimal.NUMBER_MAX_VALUE;
      return EternityChallenge.current.gainedCompletionStatus.totalCompletions;
    }
  });
  for (let i = 1; i <= 12; ++i) {
    const id = i;
    createInCategory(Currency, `EC${i}`, new RegExp(`ec${i} completions`, "i"), {
      $autocomplete: `ec${i} completions`,
      // eslint-disable-next-line no-loop-func
      $getter: () => EternityChallenge(id).completions
    });
  }

  // $prestigeLevel is used by things that wait for a prestige event. Something waiting for
  // eternity will be triggered by something waiting for reality, for example.
  createInCategory(PrestigeEvent, "Infinity", /infinity/i, {
    extraCategories: [StudyPath],
    $autobuyer: Autobuyer.bigCrunch,
    $autobuyerDurationMode: AUTO_CRUNCH_MODE.TIME,
    $autobuyerXLastMode: AUTO_CRUNCH_MODE.X_LAST,
    $autobuyerCurrencyMode: AUTO_CRUNCH_MODE.AMOUNT,
    $prestigeAvailable: () => Player.canCrunch,
    $prestige: () => bigCrunchResetRequest(true),
    $prestigeLevel: 1,
    $prestigeCurrency: "IP",
    $studyPath: TIME_STUDY_PATH.INFINITY_DIM,
  });
  createInCategory(PrestigeEvent, "Eternity", /eternity/i, {
    $autobuyer: Autobuyer.eternity,
    $autobuyerDurationMode: AUTO_ETERNITY_MODE.TIME,
    $autobuyerXLastMode: AUTO_ETERNITY_MODE.X_LAST,
    $autobuyerCurrencyMode: AUTO_ETERNITY_MODE.AMOUNT,
    $prestigeAvailable: () => Player.canEternity,
    $prestigeLevel: 2,
    $prestigeCurrency: "EP",
    $prestige: () => eternity(false, true),
    $respec: () => {
      player.respec = true;
    },
  });
  createInCategory(PrestigeEvent, "Reality", /reality/i, {
    $autobuyer: Autobuyer.reality,
    $autobuyerCurrencyMode: AUTO_REALITY_MODE.RM,
    $prestigeAvailable: () => isRealityAvailable(),
    $prestigeLevel: 3,
    $prestigeCurrency: "RM",
    $prestige: () => autoReality(),
    $respec: () => {
      player.reality.respec = true;
    },
  });

  createInCategory(StudyPath, "Idle", /idle/i, { $studyPath: TIME_STUDY_PATH.IDLE });
  createInCategory(StudyPath, "Passive", /passive/i, { $studyPath: TIME_STUDY_PATH.PASSIVE });
  createInCategory(StudyPath, "Active", /active/i, { $studyPath: TIME_STUDY_PATH.ACTIVE });
  createInCategory(StudyPath, "Antimatter", /antimatter/i, { $studyPath: TIME_STUDY_PATH.ANTIMATTER_DIM });
  createInCategory(StudyPath, "Time", /time/i, { $studyPath: TIME_STUDY_PATH.TIME_DIM });

  createInCategory(TimeUnit, "Milliseconds", /ms/i, {
    $autocomplete: "ms",
    $scale: 1,
  });
  createInCategory(TimeUnit, "Seconds", /s(ec(onds?)?)?/i, {
    $autocomplete: "sec",
    $scale: 1000,
  });
  createInCategory(TimeUnit, "Minutes", /m(in(utes?)?)?/i, {
    $autocomplete: "min",
    $scale: 60 * 1000,
  });
  createInCategory(TimeUnit, "Hours", /h(ours?)?/i, {
    $autocomplete: "hours",
    $scale: 3600 * 1000,
  });

  const Keyword = createToken({
    name: "Keyword",
    pattern: Lexer.NA,
    longer_alt: Identifier,
  });

  const keywordTokens = [];
  const createKeyword = (name, pattern, props = {}) => {
    const categories = [Keyword];
    if (props.extraCategories) categories.push(...props.extraCategories);
    const token = createToken({
      name,
      pattern,
      categories,
      longer_alt: Identifier,
    });
    token.$autocomplete = name.toLocaleLowerCase();
    keywordTokens.push(token);
    Object.assign(token, props);
    return token;
  };

  createKeyword("Auto", /auto/i);
  createKeyword("Buy", /buy/i);
  createKeyword("Define", /define/i);
  createKeyword("If", /if/i);
  createKeyword("Load", /load/i);
  createKeyword("Max", /max/i, {
    extraCategories: [TTCurrency],
    $buyTT: () => TimeTheorems.buyMax(true),
  });
  createKeyword("Nowait", /nowait/i);
  createKeyword("Off", /off/i);
  createKeyword("On", /on/i);
  createKeyword("Pause", /pause/i);
  // Presets are a little special, because they can be named anything (like ec12 or wait)
  // So, we consume the label at the same time as we consume the preset. In order to report
  // errors, we also match just the word preset. And, we have to not match comments.
  createKeyword("Preset", /preset([ \t]+(\/(?!\/)|[^\s#/])*)?/i);
  createKeyword("Respec", /respec/i);
  createKeyword("Restart", /restart/i);
  createKeyword("Start", /start/i);
  createKeyword("Studies", /studies/i);
  createKeyword("Unlock", /unlock/i);
  createKeyword("Until", /until/i);
  createKeyword("Use", /use/i);
  createKeyword("Wait", /wait/i);
  createKeyword("While", /while/i);
  createKeyword("BlackHole", /black[ \t]+hole/i, {
    $autocomplete: "black hole",
  });
  createKeyword("StoreTime", /stored?[ \t]+time/i, {
    $autocomplete: "store time",
  });

  createKeyword("Dilation", /dilation/i);
  createKeyword("EC", /ec/i);
  createKeyword("XLast", /x[ \t]+last/i, {
    $autocomplete: "x last",
  });

  // We allow ECLiteral to consume lots of digits because that makes error reporting more
  // clear (it's nice to say ec123 is an invalid ec)
  const ECLiteral = createToken({
    name: "ECLiteral",
    pattern: /ec[1-9][0-9]*/i,
    longer_alt: Identifier,
  });

  const LCurly = createToken({ name: "LCurly", pattern: /[ \t]*{/ });
  const RCurly = createToken({ name: "RCurly", pattern: /[ \t]*}/ });
  const Comma = createToken({ name: "Comma", pattern: /,/ });
  const Pipe = createToken({ name: "Pipe", pattern: /\|/, label: "|" });
  const Dash = createToken({ name: "Dash", pattern: /-/, label: "-" });

  // The order here is the order the lexer looks for tokens in.
  const automatorTokens = [
    HSpace, Comment, EOL,
    ComparisonOperator, ...tokenLists.ComparisonOperator,
    LCurly, RCurly, Comma, EqualSign, Pipe, Dash,
    NumberLiteral,
    Currency, ...tokenLists.Currency,
    ECLiteral,
    Keyword, ...keywordTokens,
    PrestigeEvent, ...tokenLists.PrestigeEvent,
    StudyPath, ...tokenLists.StudyPath,
    TTCurrency,
    TimeUnit, ...tokenLists.TimeUnit,
    Identifier,
  ];

  // Labels only affect error messages and Diagrams.
  LCurly.LABEL = "'{'";
  RCurly.LABEL = "'}'";
  NumberLiteral.LABEL = "Number";
  Comma.LABEL = "❟";

  const lexer = new Lexer(automatorTokens, {
    positionTracking: "full",
    ensureOptimizations: true
  });

  // The lexer uses an ID system that's separate from indices into the token array
  const tokenIds = [];
  for (const token of lexer.lexerDefinition) {
    tokenIds[token.tokenTypeIdx] = token;
  }

  // We use this while building up the grammar
  const tokenMap = automatorTokens.mapToObject(e => e.name, e => e);

  return {
    lexer,
    tokens: automatorTokens,
    tokenIds,
    tokenMap,
  };
})();
