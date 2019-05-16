// Note: unicode regexp is not supported by the library's optimizations.
/* eslint-disable require-unicode-regexp */
/* eslint-disable camelcase */
"use strict";

const AutomatorGrammar = (function() {
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;
  const Parser = chevrotain.Parser;

  // Shorthand for creating tokens and adding them to a list
  const tokenLists = {};
  const createInCategory = (category, name, pattern) => {
    const token = createToken({
      name,
      pattern,
      categories: category,
      longer_alt: Identifier,
    });
    const categoryName = Array.isArray(category) ? category[0].name : category.name;
    if (tokenLists[categoryName] === undefined) tokenLists[categoryName] = [];
    tokenLists[categoryName].push(token);
    const patternWord = pattern.toString().match(/^\/([a-zA-Z0-9]*)\/[a-zA-Z]*$/ui);
    if (patternWord && patternWord[1]) token.$autocomplete = patternWord[1];
    return token;
  };

  const createCategory = name => createToken({ name, pattern: Lexer.NA, longer_alt: Identifier });

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
  });

  const DurationLiteral = createToken({
    name: "DurationLiteral",
    pattern: /([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-5]?[0-9]:[0-5][0-9])/,
    label: "Duration",
  });

  const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
    longer_alt: DurationLiteral,
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

  createInCategory(ComparisonOperator, "OpGTE", />=/);
  createInCategory(ComparisonOperator, "OpLTE", /<=/);
  createInCategory(ComparisonOperator, "OpGT", />/);
  createInCategory(ComparisonOperator, "OpLT", /</);

  const EP = createInCategory(Currency, "EP", /ep/i);
  const IP = createInCategory(Currency, "IP", /ip/i);
  const AM = createInCategory(Currency, "AM", /am/i);
  const TT = createInCategory(Currency, "TT", /(tt|time theorems?)/i);
  TT.$autocomplete = "tt";

  createInCategory([PrestigeEvent, StudyPath], "Infinity", /infinity/i).studyPath = TimeStudyPath.INFINITY_DIM;
  createInCategory(PrestigeEvent, "Eternity", /eternity/i);
  createInCategory(PrestigeEvent, "Reality", /reality/i);

  createInCategory(StudyPath, "Idle", /idle/i).studyPath = TimeStudyPath.IDLE;
  createInCategory(StudyPath, "Passive", /passive/i).studyPath = TimeStudyPath.PASSIVE;
  createInCategory(StudyPath, "Active", /active/i).studyPath = TimeStudyPath.ACTIVE;
  createInCategory(StudyPath, "Normal", /normal/i).studyPath = TimeStudyPath.NORMAL_DIM;
  createInCategory(StudyPath, "Time", /time/i).studyPath = TimeStudyPath.TIME_DIM;

  createInCategory(TimeUnit, "Seconds", /s(ec(onds?)?)?/i).$autocomplete = "sec";
  createInCategory(TimeUnit, "Minutes", /m(in(utes?)?)?/i).$autocomplete = "min";
  createInCategory(TimeUnit, "Hours", /h(ours?)?/i).$autocomplete = "hours";

  const Keyword = createToken({
    name: "Keyword",
    pattern: Lexer.NA,
    longer_alt: Identifier,
  });

  const keywordTokens = [];
  const createKeyword = (name, pattern) => {
    const token = createToken({
      name,
      pattern,
      categories: Keyword,
      longer_alt: Identifier,
    });
    token.$autocomplete = name.toLocaleLowerCase();
    keywordTokens.push(token);
    return token;
  };

  const Auto = createKeyword("Auto", /auto/i);
  const Buy = createKeyword("Buy", /buy/i);
  const Define = createKeyword("Define", /define/i);
  const If = createKeyword("If", /if/i);
  const Load = createKeyword("Load", /load/i);
  const Max = createKeyword("Max", /max/i);
  const Nowait = createKeyword("Nowait", /nowait/i);
  const Off = createKeyword("Off", /off/i);
  const On = createKeyword("On", /on/i);
  const Pause = createKeyword("Pause", /pause/i);
  // Presets are a little special, because they can be named anything (like ec12 or wait)
  // So, we consume the label at the same time as we consume the preset. In order to report
  // errors, we also match just the word preset. And, we have to not match comments.
  const Preset = createKeyword("Preset", /preset([ \t]+(\/(?!\/)|[^\s#/])*)?/i);
  const Respec = createKeyword("Respec", /respec/i);
  const Restart = createKeyword("Restart", /restart/i);
  const Start = createKeyword("Start", /start/i);
  const Studies = createKeyword("Studies", /studies/i);
  const Unlock = createKeyword("Unlock", /unlock/i);
  const Until = createKeyword("Until", /until/i);
  const Wait = createKeyword("Wait", /wait/i);
  const While = createKeyword("While", /while/i);

  const Dilation = createKeyword("Dilation", /dilation/i);
  const EC = createKeyword("EC", /ec/i);

  const LCurly = createToken({ name: "LCurly", pattern: /[ \t]*\{/ });
  const RCurly = createToken({ name: "RCurly", pattern: /[ \t]*\}/ });
  const Comma = createToken({ name: "Comma", pattern: /,/ });
  const EqualSign = createToken({ name: "EqualSign", pattern: /=/, label: "=" });
  const Ellipsis = createToken({ name: "Ellipsis", pattern: /\.\.\./, label: "..." });
  const Pipe = createToken({ name: "Pipe", pattern: /\|/, label: "|" });

  const automatorTokens = [
    HSpace, Comment, EOL,
    LCurly, RCurly, Comma, Ellipsis, EqualSign, Pipe,
    ComparisonOperator, ...tokenLists.ComparisonOperator,
    NumberLiteral,
    Keyword, ...keywordTokens,
    PrestigeEvent, ...tokenLists.PrestigeEvent,
    StudyPath, ...tokenLists.StudyPath,
    Currency, ...tokenLists.Currency,
    TimeUnit, ...tokenLists.TimeUnit,
    DurationLiteral,
    Identifier,
  ];

  const automatorLexer = new Lexer(automatorTokens, {
    // Less position info tracked, reduces verbosity of the playground output.
    positionTracking: "onlyStart",
    ensureOptimizations: true
  });

  // Labels only affect error messages and Diagrams.
  LCurly.LABEL = "'{'";
  RCurly.LABEL = "'}'";
  NumberLiteral.LABEL = "Number";
  Comma.LABEL = "❟";

  // ----------------- parser -----------------
  class AutomatorParser extends Parser {
    constructor() {
      super(automatorTokens, {
        recoveryEnabled: true,
        outputCst: true,
      });

      // eslint-disable-next-line consistent-this
      const $ = this;

      $.RULE("script", () => {
        $.MANY(() => $.SUBRULE($.command));
      });

      $.RULE("command", () => {
        $.OR(
          $.c1 || ($.c1 = [
            // This is needed to capture standalone comments
            { ALT: () => $.CONSUME(Comment) },

            { ALT: () => $.SUBRULE($.badCommand) },

            { ALT: () => $.SUBRULE($.auto) },
            { ALT: () => $.SUBRULE($.define) },
            { ALT: () => $.SUBRULE($.ifBlock) },
            { ALT: () => $.SUBRULE($.pause) },
            { ALT: () => $.SUBRULE($.prestige) },
            { ALT: () => $.CONSUME(Restart) },
            { ALT: () => $.SUBRULE($.start) },
            { ALT: () => $.SUBRULE($.studies) },
            { ALT: () => $.SUBRULE($.tt) },
            { ALT: () => $.SUBRULE($.unlock) },
            { ALT: () => $.SUBRULE($.untilLoop) },
            { ALT: () => $.SUBRULE($.wait) },
            { ALT: () => $.SUBRULE($.whileLoop) },
          ]));
        $.OPTION(() => $.CONSUME1(Comment));
        $.SUBRULE($.commandEnd);
      });

      $.RULE("commandEnd", () => {
        $.OR1([
          { ALT: () => $.CONSUME(EOL) },
          { ALT: () => $.CONSUME(chevrotain.EOF) },
        ]);
      }, { resyncEnabled: false, });

      $.RULE("badCommand", () => $.AT_LEAST_ONE(() => $.SUBRULE($.badCommandToken)),
        { resyncEnabled: false, }
      );

      $.RULE("badCommandToken", () => $.OR([
        { ALT: () => $.CONSUME(Identifier) },
        { ALT: () => $.CONSUME(DurationLiteral) },
        { ALT: () => $.CONSUME(NumberLiteral) },
        { ALT: () => $.CONSUME(ComparisonOperator) },
      ]), { resyncEnabled: false, });

      $.RULE("auto", () => {
        $.CONSUME(Auto);
        $.CONSUME(PrestigeEvent);
        $.OR([
          { ALT: () => $.CONSUME(On) },
          { ALT: () => $.CONSUME(Off) },
          { ALT: () => $.SUBRULE($.duration) },
        ]);
      });

      $.RULE("define", () => {
        $.CONSUME(Define);
        $.CONSUME(Identifier);
        $.CONSUME(EqualSign);
        $.SUBRULE($.studyList);
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

      $.RULE("prestige", () => {
        $.CONSUME(PrestigeEvent);
      });

      $.RULE("start", () => {
        $.CONSUME(Start);
        $.OR([
          { ALT: () => $.CONSUME(Dilation) },
          { ALT: () => $.SUBRULE($.eternityChallenge) },
        ]);
      });

      $.RULE("studies", () => {
        $.CONSUME(Studies);
        $.OR([
          {
            ALT: () => {
              $.CONSUME(Load);
              $.CONSUME(Preset);
            }
          },
          {
            ALT: () => {
              $.OPTION(() => $.CONSUME(Nowait));
              $.OR2([
                { ALT: () => $.SUBRULE($.studyList) },
                { ALT: () => $.CONSUME1(Identifier) },
              ]);
            }
          },
          { ALT: () => $.CONSUME(Respec) },
        ]);
      });

      $.RULE("tt", () => {
        $.OPTION(() => $.CONSUME(Buy));
        $.CONSUME(TT);
        $.OR([
          { ALT: () => $.CONSUME(Max) },
          { ALT: () => $.CONSUME(AM) },
          { ALT: () => $.CONSUME(EP) },
          { ALT: () => $.CONSUME(IP) },
        ]);
      });

      $.RULE("unlock", () => {
        $.CONSUME(Unlock);
        $.OR([
          { ALT: () => $.CONSUME(Dilation) },
          { ALT: () => $.SUBRULE($.eternityChallenge) },
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
          { ALT: () => $.SUBRULE($.comparison) },
          { ALT: () => $.CONSUME(PrestigeEvent) },
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
          {
            ALT: () => {
              $.CONSUME(Currency);
              $.CONSUME(ComparisonOperator);
              $.SUBRULE($.compareValue);
            }
          },
          {
            ALT: () => {
              $.SUBRULE1($.compareValue);
              $.CONSUME1(ComparisonOperator);
              $.CONSUME1(Currency);
            }
          },
        ]);
      });

      $.RULE("compareValue", () => {
        $.OR([
          { ALT: () => $.CONSUME(NumberLiteral) },
          { ALT: () => $.CONSUME(Identifier) },
        ])
      });

      $.RULE("duration", () => $.OR([
        {
          ALT: () => {
            $.CONSUME(NumberLiteral);
            $.CONSUME(TimeUnit);
          }
        },
        {
          ALT: () => {
            $.CONSUME(DurationLiteral);
          }
        }
      ]));

      $.RULE("eternityChallenge", () => {
        $.CONSUME(EC);
        $.CONSUME(NumberLiteral);
      });

      $.RULE("studyList", () => {
        $.AT_LEAST_ONE(() => $.SUBRULE($.studyListEntry));
        // Support the |3 export format for EC number
        $.OPTION2(() => {
          $.CONSUME(Pipe);
          $.CONSUME1(NumberLiteral);
        });
      }, { resyncEnabled: false });

      $.RULE("studyListEntry", () => {
        $.OPTION(() => $.CONSUME(Ellipsis))
        $.OR([
          { ALT: () => $.CONSUME(NumberLiteral) },
          { ALT: () => $.CONSUME(StudyPath) },
        ]);
        $.OPTION1(() => $.CONSUME(Comma));
      });
      // Very important to call this after all the rules have been setup.
      // otherwise the parser may not work correctly as it will lack information
      // derived from the self analysis.
      $.performSelfAnalysis();
    }

  }
  const tokenMap = [];
  for (const token of automatorLexer.lexerDefinition) {
    tokenMap[token.tokenTypeIdx] = token;
  }
  return {
    lexer: automatorLexer,
    parser: new AutomatorParser(),
    defaultRule: "script",
    tokenMap
  };
}());

const BaseVisitor = AutomatorGrammar.parser.getBaseCstVisitorConstructorWithDefaults();

class ValidationVisitor extends BaseVisitor {
  constructor() {
    super();
    this.validateVisitor();
    this.reset();
    // The splitter tries to get a number 1 through 6, or anything else
    this._presetSplitter = new RegExp(/preset[ \t]+(?:([1-6]$)|(.+$))/ui);
  }

  addError(ctx, errInfo) {
    //console.log(errInfo);
    console.log(ctx);
    if (ctx.$combinedErrors === undefined) {
      ctx.$combinedErrors = [];
    }
    ctx.$combinedErrors.push(errInfo);
  }

  reset() {
    this.variables = {};
  }

  define(ctx) {
    if (!ctx.Identifier || ctx.Identifier[0].isInsertedInRecovery || ctx.Identifier[0].image === "") {
      this.addError(ctx.Define, "missing variable name");
      return;
    }
    const varName = ctx.Identifier[0].image;
    if (this.variables[varName] !== undefined) {
      this.addError(ctx.Identifier[0],
        `Variable ${varName} already defined on line ${this.variables[varName].lineNumber}`);
      return;
    }
    if (!ctx.studyList || ctx.studyList[0].recoveredNode) {
      return;
    }
    const studies = ctx.studyList[0].children.studyListEntry;
    let type = null;
    if (studies.length > 1 || studies[0].Ellipsis || studies[0].StudyPath || studies[0].Comma) {
      type = "studies";
    }
    this.variables[varName] = {
      name: varName,
      lineNumber: ctx.Identifier[0].startLine,
      definition: ctx,
      type
    };
  }

  checkTimeStudies(studies) {
    for (const s of studies.children.studyListEntry) {
      if (s.children.NumberLiteral) {
        const tsNumber = parseFloat(s.children.NumberLiteral[0].image);
        if (!TimeStudy(tsNumber)) {
          this.addError(s.children.NumberLiteral[0], `Invalid time study identifier ${tsNumber}`);
        }
      }
    }
  }

  studies(ctx) {
    // Load preset uses a preset identifier or number, which is a different namespace
    if (ctx.Load) {
      if (!ctx.Preset || ctx.Preset[0].isInsertedInRecovery || ctx.Preset[0].image === "") {
        this.addError(ctx.Load[0], "Missing preset and preset name");
        return;
      }
      const split = this._presetSplitter.exec(ctx.Preset[0].image);
      if (!split) {
        this.addError(ctx.Preset[0], "Missing preset name or number");
        return;
      }
      ctx.Preset[0].splitPresetResult = split;
      if (split[2]) {
        // We don't need to do any verification if it's a number; if it's a name, we
        // check to make sure it exists:
        if (!player.timestudy.presets.some(e => e.name === split[2])) {
          this.addError(ctx.Preset[0], `Could not find preset named ${split[2]} (note: names are case sensitive)`);
        }
      }
    } else if (ctx.Identifier) {
      const varName = ctx.Identifier[0].image;
      if (this.variables[varName] === undefined) {
        this.addError(ctx.Identifier[0], `Variable ${varName} has not been defined`);
        return;
      }
      const varInfo = this.variables[varName];
      if (varInfo.type === null) {
        varInfo.type = "studies";
      } else if (varInfo.type !== "studies") {
        this.addError(ctx.Identifier[0], `Variable ${varName} isn't a list of studies`);
      }
    } else if (ctx.studyList) {
      this.checkTimeStudies(ctx.studyList[0]);
    }
  }

  compareValue(ctx) {
    if (!ctx.Identifier) return;
    const varName = ctx.Identifier[0].image;
    if (this.variables[varName] === undefined) {
      this.addError(ctx.Identifier[0], `Variable ${varName} has not been defined`);
      return;
    }
    const varInfo = this.variables[varName];
    if (varInfo.type === null) {
      varInfo.type = "number";
    } else if (varInfo.type !== "number") {
      this.addError(ctx.Identifier[0], `Variable ${varName} isn't a number`);
    }
  }

  badCommand(ctx) {
    const firstToken = ctx.badCommandToken[0].children;
    const firstTokenType = Object.keys(firstToken)[0];
    this.addError(firstToken[firstTokenType][0], `Unrecognized command ${firstToken[firstTokenType][0].image}`);
  }

  eternityChallenge(ctx) {
    const ecNumber = parseFloat(ctx.NumberLiteral[0].image);
    if (!Number.isInteger(ecNumber) || ecNumber < 1 || ecNumber > 12) {
      this.addError(ctx.NumberLiteral[0], `Invalid eternity challenge ID ${ecNumber}`);
    }
  }

  script(ctx) {
    this.reset();
    if (ctx.command) for (const cmd of ctx.command) this.visit(cmd);
    for (const varName in this.variables) {
      if (!Object.prototype.hasOwnProperty.call(this.variables, varName)) continue;
      const variable = this.variables[varName];
      if (variable.type !== "studies") continue;
      this.checkTimeStudies(variable.definition.studyList[0]);
    }
  }
}

function pushToken(input, outputTokens, token) {
  const processedInput = outputTokens.length > 0 ? outputTokens[outputTokens.length - 1].endOffset : 0;
  if (token.startOffset > processedInput) {
    outputTokens.push({
      image: input.substr(processedInput, token.startOffset - processedInput),
    });
  }
  outputTokens.push(token);
}

function postProcessTokens(tokens) {
  for (const tok of tokens) {
    tok.endOffset = tok.startOffset + tok.image.length;
  }
}

function postProcessLexerErrors(errors, input) {
  for (const err of errors) {
    err.image = input.substr(err.offset, err.length);
    err.startOffset = err.offset;
    err.endOffset = err.offset + err.length;
    err.startLine = err.line;
    err.startColumn = err.column;
    err.$combinedErrors = [
      `Unexpected characters "${err.image}"`
    ];
  }
}

function createOutputTokenArray(input, tokens, lexErrors) {
  // We build an array of tokens, plus intervening spaces and anything that the lexer skipped and
  // marked as an error
  const outputTokens = [];
  let currentTokenIndex = 0;
  let currentErrorIndex = 0;
  while (currentTokenIndex < tokens.length && currentErrorIndex < lexErrors.length) {
    if (lexErrors[currentErrorIndex].startOffset > tokens[currentTokenIndex].startOffset) {
      pushToken(input, outputTokens, tokens[currentTokenIndex]);
      currentTokenIndex++;
    } else {
      pushToken(input, outputTokens, lexErrors[currentErrorIndex]);
      currentErrorIndex++;
    }
  }
  while (currentTokenIndex < tokens.length) {
    pushToken(input, outputTokens, tokens[currentTokenIndex]);
    currentTokenIndex++;
  }
  while (currentErrorIndex < lexErrors.length) {
    pushToken(input, outputTokens, lexErrors[currentErrorIndex]);
    currentErrorIndex++;
  }
  return outputTokens;
}

function parseAutomatorScript(input) {
  const t0 = Date.now();
  const lexResult = AutomatorGrammar.lexer.tokenize(input);
  const t1 = Date.now();
  const tokens = lexResult.tokens;
  console.log(tokens);
  postProcessTokens(tokens);
  postProcessLexerErrors(lexResult.errors, input);
  AutomatorGrammar.parser.input = tokens;
  const t2 = Date.now();
  const parseResult = AutomatorGrammar.parser.script();
  const t3 = Date.now();
  const check = new ValidationVisitor();
  check.visit(parseResult);
  const t4 = Date.now();
  const outputTokens = createOutputTokenArray(input, tokens, lexResult.errors);
  const t5 = Date.now();
  console.log(AutomatorGrammar.parser.errors);
  for (const parseError of AutomatorGrammar.parser.errors) {
    let message = parseError.message;
    // Deal with literal EOL in error message:
    message = message.replace(/'\n\s*'/ui, "End of line");
    if (parseError.name === "NoViableAltException") {
      if (parseError.token.tokenType.name === "EOF" || parseError.token.tokenType.name === "EOL") {
        check.addError(parseError.previousToken, message);
      } else {
        message = `Unexpected input ${parseError.token.image}`;
        check.addError(parseError.token, message);
      }
    } else if (parseError.name === "MismatchedTokenException") {
      let targetToken = parseError.token;
      if (parseError.token.tokenType.name === "EOF" || parseError.token.tokenType.name === "EOL") {
        // In some cases, both objects can point at EOF
        if (parseError.previousToken.tokenType.name === "EOF") {
          targetToken = outputTokens[outputTokens.length - 1];
        } else {
          targetToken = parseError.previousToken;
        }
      }
      check.addError(targetToken, message);
    } else if (parseError.name === "EarlyExitException") {
      message = "Unexpected end of command";
      check.addError(parseError.previousToken, message);
    } else if (parseError.token.tokenType.name === "EOL" && parseError.previousToken &&
      parseError.previousToken.image && parseError.previousToken.image.length > 0) {
      // If the error occured on EOL, it's nicer to add the message to whatever the last
      // token was, if possible
      check.addError(parseError.previousToken, message);
    } else {
      check.addError(parseError.token, message);
    }
  }
  const t6 = Date.now();
  console.log(`lex time = ${t1 - t0}, post process tokens = ${t2 - t1}, parse time = ${t3 - t2} ` +
    `validation visit time = ${t4 - t3}, outputTokens time = ${t5 - t4}, parse error time = ${t6-t5}`);
  return outputTokens;
}

/*
const input = `~ ~ ~
pause
`;

$(document).ready(() => {
  for (let repeat = 0; repeat < 2; ++repeat) {

});
if (AutomatorGrammar.parser.errors.length > 0) {
  throw Error(
    "Sad sad panda, parsing errors detected!\n" +
    AutomatorGrammar.parser.errors[0].message
  )
}
*/