"use strict";

const chevrotain = require("chevrotain");
const Parser = require("chevrotain").Parser;

const myParser = (function() {
  // ----------------- Lexer -----------------
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;

  const tokenLists = {};
  const createInCategory = (category, name, pattern, longer_alt) => {
    const token = createToken({
      name,
      pattern,
      categories: category,
      longer_alt: Identifier,
    });
    const categoryName = Array.isArray(category) ? category[0].name : category.name;
    if (tokenLists[categoryName] === undefined) tokenLists[categoryName] = [];
    tokenLists[categoryName].push(token);
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
  });

  const Comment = createToken({
    name: "Comment",
    pattern: /(#|\/\/)[^\n]*/,
    group: Lexer.SKIPPED
  });

  const Identifier = createToken({
    name: "Identifier",
    pattern: /[a-zA-Z_][a-zA-Z_0-9]*/,
  });

  const PrestigeEvent = createToken({
    name: "PrestigeEvent",
    pattern: Lexer.NA,
    longer_alt: Identifier,
  });

  const StudyPath = createToken({
    name: "StudyPath",
    pattern: Lexer.NA,
    longer_alt: Identifier,
  });

  const Infinity = createInCategory([PrestigeEvent, StudyPath], "Infinity", /infinity/i);
  const Eternity = createInCategory(PrestigeEvent, "Eternity", /eternity/i);
  const Reality = createInCategory(PrestigeEvent, "Reality", /reality/i);

  const Idle = createInCategory(StudyPath, "Idle", /idle/i);
  const Passive = createInCategory(StudyPath, "Passive", /passive/i);
  const Active = createInCategory(StudyPath, "Active", /active/i);
  const Normal = createInCategory(StudyPath, "Normal", /normal/i);
  const Time = createInCategory(StudyPath, "Time", /time/i);
  
  const Keyword = createToken({
    name: "Keyword",
    pattern: Lexer.NA,
    longer_alt: Identifier,
  });

  const keywords = [];
  const createKeyword = (name, pattern) => {
    const token = createToken({
      name,
      pattern,
      categories: Keyword,
      longer_alt: Identifier,
    });
    keywords.push(token);
    return token;
  };

  const Pause = createKeyword("Pause", /pause/i);
  const Wait = createKeyword("Wait", /wait/i);
  const If = createKeyword("If", /if/i);
  const Until = createKeyword("Until", /until/i);	
  const While = createKeyword("While", /while/i);
  const Unlock = createKeyword("Unlock", /unlock/i);
  const Start = createKeyword("Start", /start/i);
  const Define = createKeyword("Define", /define/i);
  const Buy = createKeyword("Buy", /buy/i);
  const Max = createKeyword("Max", /max/i);
  const Set = createKeyword("Set", /set/i);
  const Enable = createKeyword("Enable", /enable +/i);
  const Disable = createKeyword("Disable", /disable +/i);
  const Auto = createKeyword("Auto", /auto/i);
  const Autobuyer = createKeyword("Autobuyer", /autobuyer +/i);
  const On = createKeyword("On", /on/i);
  const Off = createKeyword("Off", /off/i);
  const Study = createKeyword("Study", /study/i);
  const Studies = createKeyword("Studies", /studies/i);
  const Preset = createKeyword("Preset", /preset/i);
  const Import = createKeyword("Import", /import/i);
  const Load = createKeyword("Load", /load/i);
  const Nowait = createKeyword("Nowait", /nowait/i);
  const Restart = createKeyword("Restart", /restart/i);

  const TimeUnit = createToken({
    name: "TimeUnit",
    pattern: Lexer.NA,
    longer_alt: Identifier,
  });

  const Seconds = createInCategory(TimeUnit, "Seconds", /s(ec(onds?)?)?/i);
  const Minutes = createInCategory(TimeUnit, "Minutes", /m(in(utes?)?)?/i);
  const Hours  = createInCategory(TimeUnit, "Hours", /h(ours?)?/i);
	
  const Currency = createToken({
    name: "Currency",
    pattern: Lexer.NA,
    longer_alt: Identifier,
  });

  const EP = createInCategory(Currency, "EP", /ep/i);
  const IP = createInCategory(Currency, "IP", /ip/i);
  const AM = createInCategory(Currency, "AM", /am/i);
  const TT = createInCategory(Currency, "TT", /(tt|time theorems?)/i);

  const ComparisonOperator = createToken({
    name: "ComparisonOperator",
    pattern: Lexer.NA,
  });

  const OpGT = createInCategory(ComparisonOperator, "OpGT", /\>/);
  const OpLT = createInCategory(ComparisonOperator, "OpLT", /\</);
  const OpGTE = createInCategory(ComparisonOperator, "OpGTE", /\>=/);
  const OpLTE = createInCategory(ComparisonOperator, "OpLTE", /\<=/); 
  
  const Dilation = createToken({
    name: "Dilation",
    pattern: /dilation/i,
    longer_alt: Identifier,
  });
  
  const EC = createToken({
    name: "EC",
    pattern: /ec/i,
  });

  const LCurly = createToken({name: "LCurly", pattern: /[ \t]*{/});
  const RCurly = createToken({name: "RCurly", pattern: /[ \t]*}/});
  const Comma = createToken({name: "Comma", pattern: /,/});
  const EqualSign = createToken({name: "EqualSign", pattern: /=/, label: "=" });
  const Ellipsis = createToken({ name: "Ellipsis", pattern: /\.\.\./, label: "..." });

  const DurationLiteral = createToken({
    name: "DurationLiteral",
    pattern: /([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-5]?[0-9]:[0-5][0-9])/
  });
  const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
    longer_alt: DurationLiteral,
  });

  const jsonTokens = [
    HSpace, Comment, EOL,
    LCurly, RCurly, Comma, Ellipsis, EqualSign,
    ComparisonOperator, ...tokenLists.ComparisonOperator,
    NumberLiteral,
    Keyword, ...keywords,
    Dilation, EC,
    PrestigeEvent, ...tokenLists.PrestigeEvent,
    StudyPath, ...tokenLists.StudyPath,
    Currency, ...tokenLists.Currency,
    TimeUnit, ...tokenLists.TimeUnit,
    DurationLiteral,
    Identifier,
  ];

  const JsonLexer = new Lexer(jsonTokens, {
    // Less position info tracked, reduces verbosity of the playground output.
    positionTracking: "onlyStart",
    ensureOptimizations: true
  });

  // Labels only affect error messages and Diagrams.
  LCurly.LABEL = "'{'";
  RCurly.LABEL = "'}'";
  OpGT.LABEL = ">";
  OpLT.LABEL = "<";
  OpGTE.LABEL = "≥";
  OpLTE.LABEL = "≤";
  NumberLiteral.LABEL = "Number";
  Comma.LABEL = "❟";
  // ----------------- parser -----------------
  // ----------------- parser -----------------
  const Parser = chevrotain.Parser;

  class JsonParser extends Parser {
    constructor() {
      super(jsonTokens, {
        recoveryEnabled: true
      })

      const $ = this;

      $.RULE("script", () => {
        $.MANY(() => $.SUBRULE($.command));
      });

      $.RULE("command", () => {
        $.OR(
          $.c1 || ($.c1 = [
            { ALT: () => $.SUBRULE($.badCommand) },

            { ALT: () => $.SUBRULE($.auto) },
            { ALT: () => $.SUBRULE($.define) },
            { ALT: () => $.SUBRULE($.ifBlock) },
            { ALT: () => $.SUBRULE($.pause) },
            { ALT: () => $.CONSUME(Restart) },
            { ALT: () => $.SUBRULE($.start) },
            { ALT: () => $.SUBRULE($.studies) },
            { ALT: () => $.SUBRULE($.tt) },
            { ALT: () => $.SUBRULE($.unlock) },
            { ALT: () => $.SUBRULE($.untilLoop) },
            { ALT: () => $.SUBRULE($.wait) },
            { ALT: () => $.SUBRULE($.whileLoop) },
          ]));
        $.OR1([
          { ALT: () => $.CONSUME(EOL) },
          { ALT: () => $.CONSUME(chevrotain.EOF) },
        ]);
      });

      $.RULE("badCommand", () => {
        $.AT_LEAST_ONE(() => $.OR([
          { ALT: () => $.CONSUME(Identifier) },
          { ALT: () => $.CONSUME(NumberLiteral) },
          { ALT: () => $.CONSUME(ComparisonOperator) },
        ]));
      });

      $.RULE("auto", () => {
        $.CONSUME(Auto);
        $.CONSUME(PrestigeEvent);
        $.OR([
          {ALT: () => $.CONSUME(On) },
          {ALT: () => $.CONSUME(Off) },
          {ALT: () => $.SUBRULE($.duration) },
        ]);
      });

      $.RULE("define", () => {
        $.CONSUME(Define);
        $.CONSUME(Identifier);
        $.CONSUME(EqualSign);
        $.OR([
          { ALT: () => $.CONSUME(NumberLiteral) },
          { ALT: () => $.SUBRULE($.studyList) },
        ]);
      });

      $.RULE("ifBlock", () => {
        $.CONSUME(If);
        $.SUBRULE($.comparison);
        $.CONSUME(LCurly);
        $.CONSUME(EOL);
        $.SUBRULE($.script);
        $.CONSUME(RCurly);
      });

      $.RULE("pause", () => {
        $.CONSUME(Pause);
        $.OPTION(() => $.SUBRULE($.duration));
      });
      
      $.RULE("start", () => {
        $.CONSUME(Start);
        $.OR([
          {ALT: () => $.CONSUME(Dilation)},
          {ALT: () => $.SUBRULE($.eternityChallenge)},
        ]);
      });

      $.RULE("studies", () => {
        $.CONSUME(Studies);
        $.OR([
          {ALT: () => {
            $.CONSUME(Load);
            $.CONSUME(Preset);
            $.OR1([
              { ALT: () => $.CONSUME(NumberLiteral) },
              { ALT: () => $.CONSUME(Identifier) },
            ]);
          }},
          {ALT: () => {
            $.OPTION(() => $.CONSUME(Nowait));
            $.SUBRULE($.studyList);
          }},
        ]);
      });

      $.RULE("tt", () => {
        $.OPTION(() => $.CONSUME(Buy));
        $.CONSUME(TT);
        $.OR([
          {ALT: () => $.CONSUME(Max) },
          {ALT: () => $.CONSUME(AM) },
          {ALT: () => $.CONSUME(EP) },
          {ALT: () => $.CONSUME(IP) },
        ]);
      });

      $.RULE("unlock", () => {
        $.CONSUME(Unlock);
        $.OR([
          {ALT: () => $.CONSUME(Dilation)},
          {ALT: () => $.SUBRULE($.eternityChallenge)},
        ]);
      });

      $.RULE("untilLoop", () => {
        $.CONSUME(Until);
        $.OR([
          { ALT: () => $.SUBRULE($.comparison) },
          { ALT: () => $.CONSUME(PrestigeEvent) },
        ]);
        $.CONSUME(LCurly);
        $.CONSUME(EOL);
        $.SUBRULE($.script);
        $.CONSUME(RCurly);
      });
      
      $.RULE("wait", () => {
        $.CONSUME(Wait);
        $.OR([
          {ALT: () => $.SUBRULE($.comparison) },
          {ALT: () => $.CONSUME(PrestigeEvent) },
        ]);          
      });
      
      $.RULE("whileLoop", () => {
        $.CONSUME(While);
        $.SUBRULE($.comparison);
        $.CONSUME(LCurly);
        $.CONSUME(EOL);
        $.SUBRULE($.script);
        $.CONSUME(RCurly);
      });
      
      $.RULE("comparison", () => {
        $.OR([
          {ALT: () => {
            $.CONSUME(Currency);
            $.CONSUME(ComparisonOperator);
            $.SUBRULE($.compareValue);
          }},
          {ALT: () => {
            $.SUBRULE1($.compareValue);
            $.CONSUME1(ComparisonOperator);
            $.CONSUME1(Currency);
          }},
        ]);
      });
      
      $.RULE("compareValue", () => {
        $.OR([
          {ALT: () => $.CONSUME(NumberLiteral) },
          {ALT: () => $.CONSUME(Identifier) },
        ])
      });
      
      $.RULE("duration", () => $.OR([
        {ALT: () => {
          $.CONSUME(NumberLiteral);
          $.CONSUME(TimeUnit);
        }},
        {ALT: () => {
          $.CONSUME(DurationLiteral);
        }}
      ]));
      
      $.RULE("eternityChallenge", () => {
        $.CONSUME(EC);
        $.CONSUME(NumberLiteral);
      });
          
      $.RULE("studyList", () => {
        $.AT_LEAST_ONE(() => {
          $.OPTION(() => $.CONSUME(Ellipsis));
          $.OR([
            { ALT: () => $.CONSUME(NumberLiteral) },
            { ALT: () => $.CONSUME(StudyPath) },
          ]);
          $.OPTION1(() => $.CONSUME(Comma));
        });
      });
      // very important to call this after all the rules have been setup.
      // otherwise the parser may not work correctly as it will lack information
      // derived from the self analysis.
      this.performSelfAnalysis();
    }

  }

  JsonLexer.lex = function(inputText) {
    const lexingResult = JsonLexer.tokenize(inputText);

    if (lexingResult.errors.length > 0) {
      throw Error("Sad Sad Panda, lexing errors detected");
    }

    return lexingResult;
  };
  // for the playground to work the returned object must contain these fields
  return {
    lexer: JsonLexer,
    parser: new JsonParser(),
    defaultRule: "script"
  };
}());

const input = "pause 0.1s\n";
const tokens = myParser.lexer.lex(input).tokens;
myParser.parser.input = tokens;
myParser.parser.script();

if (myParser.parser.errors.length > 0) {
  throw Error(
      "Sad sad panda, parsing errors detected!\n" +
      myParser.parser.errors[0].message
  )
}