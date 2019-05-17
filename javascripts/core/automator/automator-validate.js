"use strict";

(function() {
  if (AutomatorGrammar === undefined) {
    throw crash("AutomatorGrammar must be defined here");
  }

  const parser = AutomatorGrammar.parser;
  const BaseVisitor = parser.getBaseCstVisitorConstructorWithDefaults();

  class Validator extends BaseVisitor {
    constructor() {
      super();
      this.validateVisitor();
      this.reset();
      // The splitter tries to get a number 1 through 6, or anything else. Note: eslint complains
      // about lack of u flag here for some reason.
      // eslint-disable-next-line require-unicode-regexp
      this._presetSplitter = new RegExp(/preset[ \t]+(?:([1-6]$)|(.+$))/ui);
      // Commands can provide validation hooks; we might also have some here
      for (const cmd of AutomatorCommands) {
        if (!cmd.validate) continue;
        const ownMethod = this[cmd.id];
        this[cmd.id] = ctx => {
          if (!cmd.validate(this, ctx)) return;
          if (ownMethod) ownMethod.call(this, ctx);
        };
      }
    }

    static combinePositionRanges(r1, r2) {
      return {
        startOffset: Math.min(r1.startOffset, r2.startOffset),
        endOffset: Math.max(r1.endOffset, r2.endOffset),
      };
    }

    // Chevrotain doesn't provide position ranges for higher level grammar constructs yet
    // We have to recursively figure out the range so we can highlight an error
    static getPositionRange(ctx) {
      let pos = {
        startOffset: Number.MAX_VALUE,
        endOffset: 0,
      };
      if (ctx === undefined || ctx === null) return pos;
      if (ctx.startOffset) {
        return {
          startOffset: ctx.startOffset,
          endOffset: ctx.endOffset,
        };
      }
      if (ctx.children && !Array.isArray(ctx.children)) return Validator.getPositionRange(ctx.children);
      if (Array.isArray(ctx)) {
        return ctx.reduce((prev, el) => Validator.combinePositionRanges(prev, Validator.getPositionRange(el)), pos);
      }
      for (const k in ctx) {
        if (!Object.prototype.hasOwnProperty.call(ctx, k) || !Array.isArray(ctx[k])) continue;
        pos = Validator.combinePositionRanges(pos, Validator.getPositionRange(ctx[k]));
      }
      return pos;
    }

    addError(ctx, errInfo) {
      const pos = Validator.getPositionRange(ctx);
      pos.info = errInfo;
      this.errors.push(pos);
    }

    reset() {
      this.variables = {};
      this.errors = [];
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

    checkVarUse(identifier, type) {
      const varName = identifier.image;
      const varInfo = this.variables[varName];
      if (varInfo === undefined) {
        this.addError(identifier, `Variable ${varName} has not been defined`);
        return false;
      }
      if (varInfo.type === AutomatorVarTypes.UNKNOWN) {
        varInfo.type = type;
      } else if (varInfo.type !== type) {
        this.addError(identifier, `Variable ${varName} is not a ${type}`);
        return false;
      }
      return true;
    }

    duration(ctx) {
      if (!ctx.TimeUnit || ctx.TimeUnit[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing time unit");
        return;
      }
      ctx.$durationMs = new Decimal(ctx.NumberLiteral[0].image).times(ctx.TimeUnit[0].tokenType.$scale);
      console.log(ctx.$durationMs)
    }

    define(ctx) {
      const varName = ctx.Identifier[0].image;
      if (this.variables[varName] !== undefined) {
        this.addError(ctx.Identifier[0],
          `Variable ${varName} already defined on line ${this.variables[varName].lineNumber}`);
        return;
      }
      if (!ctx.duration && !ctx.studyList) return;
      const varDefinition = {
        name: varName,
        lineNumber: ctx.Identifier[0].startLine,
        definition: ctx,
        type: AutomatorVarTypes.UNKNOWN,
      };
      if (ctx.duration) {
        this.visit(ctx.duration);
        varDefinition.type = AutomatorVarTypes.DURATION;
      } else {
        // We don't visit studyList because it might actually be just a number in this case
        const studies = ctx.studyList[0].children.studyListEntry;
        if (studies.length > 1 || studies[0].Ellipsis || studies[0].StudyPath || studies[0].Comma) {
          varDefinition.type = AutomatorVarTypes.STUDIES;
        } else if (!/^[1-9][0-9]*[1-9]$/u.test(studies[0].children.NumberLiteral[0].image)) {
          // Study numbers are pretty specific number patterns
          varDefinition.type = AutomatorVarTypes.NUMBER;
        }
      }
      this.variables[varName] = varDefinition;
    }

    studiesLoad(ctx) {
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
    }

    studiesBuy(ctx) {
      if (ctx.Identifier) {
        this.checkVarUse(ctx.Identifier[0], AutomatorVarTypes.STUDIES);
      } else if (ctx.studyList) {
        this.checkTimeStudies(ctx.studyList[0]);
      }
    }

    compareValue(ctx) {
      if (!ctx.Identifier) return;
      this.checkVarUse(ctx.Identifier[0], AutomatorVarTypes.NUMBER);
    }

    badCommand(ctx) {
      const firstToken = ctx.badCommandToken[0].children;
      const firstTokenType = Object.keys(firstToken)[0];
      this.addError(firstToken[firstTokenType][0], `Unrecognized command ${firstToken[firstTokenType][0].image}`);
    }

    eternityChallenge(ctx) {
      let errToken, ecNumber;
      if (ctx.ECLiteral) {
        ecNumber = parseFloat(ctx.ECLiteral[0].image.substr(2));
        errToken = ctx.ECLiteral[0];
      } else {
        ecNumber = parseFloat(ctx.NumberLiteral[0].image);
        errToken = ctx.NumberLiteral[0];
      }
      if (!Number.isInteger(ecNumber) || ecNumber < 1 || ecNumber > 12) {
        this.addError(errToken, `Invalid eternity challenge ID ${ecNumber}`);
      }
      ctx.ecNumber = ecNumber;
    }

    checkBlock(ctx, name) {
      if (!ctx.RCurly || ctx.RCurly[0].isInsertedInRecovery) {
        this.addError(ctx[name][0], "Missing closing }");
      }
      if (!ctx.LCurly || ctx.LCurly[0].isInsertedInRecovery) {
        this.addError(ctx[name][0], "Missing opening {");
      }
      if (ctx.block) this.visit(ctx.block);
    }

    ifBlock(ctx) {
      this.checkBlock(ctx, "If");
    }

    untlLoop(ctx) {
      this.checkBlock(ctx, "Until");
    }

    whileLoop(ctx) {
      this.checkBlock(ctx, "While");
    }

    block(ctx) {
      if (ctx.command) for (const cmd of ctx.command) this.visit(cmd);
    }

    script(ctx) {
      this.reset();
      if (ctx.block) this.visit(ctx.block);
      for (const varName in this.variables) {
        if (!Object.prototype.hasOwnProperty.call(this.variables, varName)) continue;
        const variable = this.variables[varName];
        if (variable.type !== AutomatorVarTypes.STUDIES) continue;
        this.checkTimeStudies(variable.definition.studyList[0]);
      }
      ctx.variables = this.variables;
    }
  }

  class Compiler extends BaseVisitor {
    constructor() {
      super();
      // Commands provide compilation hooks; we might also have some here
      for (const cmd of AutomatorCommands) {
        if (!cmd.compile) continue;
        const ownMethod = this[cmd.id];
        this[cmd.id] = (ctx, output) => {
          output.push(cmd.compile(this, ctx));
          if (ownMethod) ownMethod.call(this, ctx, output);
        };
      }
      this.validateVisitor();
    }

    block(ctx, output) {
      if (ctx.command) for (const cmd of ctx.command) this.visit(cmd, output);
    }

    script(ctx) {
      if (ctx.variables === undefined) {
        throw crash("Compiler called before Validator");
      }
      const output = [];
      if (ctx.block) this.visit(ctx.block, output);
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
    return errors.map(err => ({
      startOffset: err.offset,
      endOffset: err.offset + err.length,
      info: `Unexpected characters "${input.substr(err.offset, err.length)}"`,
    }));
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

  function validate(input) {
    const t0 = Date.now();
    const lexResult = AutomatorLexer.lexer.tokenize(input);
    const t1 = Date.now();
    const tokens = lexResult.tokens;
    console.log(tokens);
    postProcessTokens(tokens);
    console.log(lexResult.errors);
    const lexErrors = postProcessLexerErrors(lexResult.errors, input);
    parser.input = tokens;
    const t2 = Date.now();
    const parseResult = parser.script();
    const t3 = Date.now();
    const check = new Validator();
    check.visit(parseResult);
    const t4 = Date.now();
    const outputTokens = createOutputTokenArray(input, tokens, lexResult.errors);
    const t5 = Date.now();
    const compile = new Compiler();
    //compile.visit(parseResult);
    console.log(parser.errors);
    const parserErrors = parser.errors.map(parseError => {
      let err = Validator.combinePositionRanges(
        Validator.getPositionRange(parseError.previousToken),
        Validator.getPositionRange(parseError.token));
      // In some cases, at the end of the script we don't get any useful tokens out of the parse error
      if (parseError.token.tokenType.name === "EOF" && parseError.previousToken.tokenType.name === "EOF") {
        err = Validator.combinePositionRanges(err, Validator.getPositionRange(tokens[tokens.length - 1]));
      }
        // Deal with literal EOL in error message:
      err.info = parseError.message.replace(/'\n\s*'/ui, "End of line");
      const isEndToken = parseError.token.tokenType.name === "EOF" || parseError.token.tokenType.name === "EOL";
      if (parseError.name === "NoViableAltException") {
        if (!isEndToken) {
          err.info = `Unexpected input ${parseError.token.image}`;
        }
      } else if (parseError.name === "EarlyExitException") {
        err.info = "Unexpected end of command";
      }
      return err;
    });
    const t6 = Date.now();
    console.log(`lex time = ${t1 - t0}, post process tokens = ${t2 - t1}, parse time = ${t3 - t2} ` +
      `validation visit time = ${t4 - t3}, outputTokens time = ${t5 - t4}, parse error time = ${t6-t5}`);
    return {
      errors: check.errors.concat(lexErrors, parserErrors),
      parseResult,
    };
  }
  AutomatorGrammar.validate = validate;
}());