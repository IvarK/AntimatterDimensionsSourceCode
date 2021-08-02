"use strict";

(function() {
  if (AutomatorGrammar === undefined) {
    throw new Error("AutomatorGrammar must be defined here");
  }

  const parser = AutomatorGrammar.parser;
  const BaseVisitor = parser.getBaseCstVisitorConstructorWithDefaults();

  class Validator extends BaseVisitor {
    constructor(rawText) {
      super();
      this.validateVisitor();
      this.reset(rawText);
      // Commands can provide validation hooks; we might also have some here
      for (const cmd of AutomatorCommands) {
        if (!cmd.validate) continue;
        const ownMethod = this[cmd.id];
        this[cmd.id] = ctx => {
          if (!cmd.validate(ctx, this)) return;
          if (ownMethod) ownMethod.call(this, ctx);
        };
      }
    }

    addLexerErrors(errors) {
      for (const err of errors) {
        this.errors.push({
          startLine: err.line,
          startOffset: err.offset,
          endOffset: err.offset + err.length,
          info: `Unexpected characters: ${this.rawText.substr(err.offset, err.length)}`,
          tip: `${this.rawText.substr(err.offset, err.length)} cannot be part of a command, remove them`
        });
      }
    }

    static combinePositionRanges(r1, r2) {
      return {
        startLine: Math.min(r1.startLine, r2.startLine),
        startOffset: Math.min(r1.startOffset, r2.startOffset),
        endOffset: Math.max(r1.endOffset, r2.endOffset),
      };
    }

    addParserErrors(errors, tokens) {
      for (const parseError of errors) {
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
            err.tip = `Remove ${parseError.token.image}`;
          }
        } else if (parseError.name === "EarlyExitException") {
          err.info = "Unexpected end of command";
          err.tip = "Complete the command by adding the other parameters";
        }
        this.errors.push(err);
      }
    }

    static getPositionRange(ctx) {
      let pos = {
        startLine: Number.MAX_VALUE,
        startOffset: Number.MAX_VALUE,
        endOffset: 0,
      };
      if (ctx === undefined || ctx === null) return pos;
      if (ctx.startOffset !== undefined) {
        return {
          startLine: ctx.startLine,
          startOffset: ctx.startOffset,
          endOffset: ctx.endOffset,
        };
      }
      if (ctx.location !== undefined && ctx.location.startOffset !== undefined) {
        return ctx.location;
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

    addError(ctx, errInfo, errTip) {
      const pos = Validator.getPositionRange(ctx);
      pos.info = errInfo;
      pos.tip = errTip;
      this.errors.push(pos);
    }

    // There are a few errors generated internally in chevrotain.js which are scanned for and modified in here and
    // given appropriate fixing tips and minor formatting adjustments. This isn't necessarily comprehensive, but
    // should hopefully cover the most common cases.
    generateMissingTips() {
      for (const err of this.errors) {
        if (err.info.match(/Expecting/gu)) {
          err.info = err.info.replaceAll("--> ", "[").replaceAll(" <--", "]");
          err.tip = "Use the appropriate type of data in the command as specified in the command help";
        }
        if (err.info.match(/End of line/gu)) {
          err.tip = "Provide the remaining arguments to complete the incomplete command";
        }
      }
    }

    reset(rawText) {
      this.rawText = rawText;
      this.variables = {};
      this.errors = [];
    }

    checkTimeStudyNumber(token) {
      const tsNumber = parseFloat(token.image);
      if (!TimeStudy(tsNumber)) {
        this.addError(token, `Invalid Time Study identifier ${tsNumber}`,
          `Make sure you copied or typed in your time study IDs correctly`);
        return 0;
      }
      return tsNumber;
    }

    lookupVar(identifier, type) {
      const varName = identifier.image;
      const varInfo = this.variables[varName];
      if (varInfo === undefined) {
        this.addError(identifier, `Variable ${varName} has not been defined`,
          `Use DEFINE to define ${varName} in order to reference it`);
        return undefined;
      }
      if (varInfo.type === AUTOMATOR_VAR_TYPES.UNKNOWN) {
        varInfo.firstUseLineNumber = identifier.image.startLine;
        varInfo.type = type;
        if (type === AUTOMATOR_VAR_TYPES.STUDIES) {
          // The only time we have an unknown studies is if there was only one listed
          varInfo.value = {
            normal: [varInfo.value.toNumber()],
            ec: 0
          };
        }
      } else if (varInfo.type !== type) {
        const inferenceMessage = varInfo.firstUseLineNumber
          ? `\nIts use on line ${varInfo.firstUseLineNumber} identified it as a ${varInfo.type.name}`
          : "";
        this.addError(identifier, `Variable ${varName} is not a ${type.name}${inferenceMessage}`,
          "Defined variables cannot be used as both studies and numbers - define a second variable instead");
        return undefined;
      }
      if (varInfo.value === undefined) throw new Error("Unexpected undefined Automator variable value");
      return varInfo;
    }

    duration(ctx) {
      if (ctx.$value) return ctx.$value;
      if (!ctx.TimeUnit || ctx.TimeUnit[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing time unit", "Provide a unit of time (eg. seconds or minutes)");
        return undefined;
      }
      const value = parseFloat(ctx.NumberLiteral[0].image) * ctx.TimeUnit[0].tokenType.$scale;
      if (isNaN(value)) {
        this.addError(ctx, "Error parsing duration", "Provide a properly-formatted number for time");
        return undefined;
      }
      ctx.$value = value;
      return ctx.$value;
    }

    xCurrent(ctx) {
      if (ctx.$value) return ctx.$value;
      if (!ctx.NumberLiteral || ctx.NumberLiteral[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing multiplier", "Provide a multiplier to set the autobuyer to");
        return undefined;
      }
      ctx.$value = new Decimal(ctx.NumberLiteral[0].image);
      return ctx.$value;
    }

    currencyAmount(ctx) {
      if (ctx.$value) return ctx.$value;
      if (!ctx.NumberLiteral || ctx.NumberLiteral[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing amount", "Provide a threshold to set the autobuyer to");
        return undefined;
      }
      ctx.$value = new Decimal(ctx.NumberLiteral[0].image);
      return ctx.$value;
    }

    define(ctx) {
      const varName = ctx.Identifier[0].image;
      if (this.variables[varName] !== undefined) {
        this.addError(ctx.Identifier[0],
          `Variable ${varName} already defined on line ${this.variables[varName].definitionLineNumber}`,
          "Variables cannot be defined twice; remove or rename the second DEFINE");
        return;
      }
      if (!ctx.duration && !ctx.studyList) return;
      const def = {
        name: varName,
        definitionLineNumber: ctx.Identifier[0].startLine,
        firstUseLineNumber: 0,
        type: AUTOMATOR_VAR_TYPES.UNKNOWN,
        value: undefined,
      };
      this.variables[varName] = def;
      if (ctx.duration) {
        def.type = AUTOMATOR_VAR_TYPES.DURATION;
        def.value = this.visit(ctx.duration);
        return;
      }
      // We don't visit studyList because it might actually be just a number in this case
      const studies = ctx.studyList[0].children.studyListEntry;
      if (studies.length > 1 || studies[0].children.studyRange ||
        studies[0].children.StudyPath || studies[0].children.Comma) {
        def.type = AUTOMATOR_VAR_TYPES.STUDIES;
        def.value = this.visit(ctx.studyList);
        return;
      }
      // We assume the value is a number; in some cases, we might overwrite it if we see
      // this variable used in studies
      def.value = new Decimal(studies[0].children.NumberLiteral[0].image);
      if (!/^[1-9][0-9]*[1-9]$/u.test(studies[0].children.NumberLiteral[0].image)) {
        // Study numbers are pretty specific number patterns
        def.type = AUTOMATOR_VAR_TYPES.NUMBER;
      }
    }

    studyRange(ctx, studiesOut) {
      if (!ctx.firstStudy || ctx.firstStudy[0].isInsertedInRecovery ||
        !ctx.lastStudy || ctx.lastStudy[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing Time Study number in range",
          "Provide starting and ending IDs for Time Study number ranges");
        return;
      }
      const first = this.checkTimeStudyNumber(ctx.firstStudy[0]);
      const last = this.checkTimeStudyNumber(ctx.lastStudy[0]);
      if (!first || !last || !studiesOut) return;
      for (let id = first; id <= last; ++id) {
        if (TimeStudy(id)) studiesOut.push(id);
      }
    }

    studyListEntry(ctx, studiesOut) {
      if (ctx.studyRange) {
        this.visit(ctx.studyRange, studiesOut);
        return;
      }
      if (ctx.NumberLiteral) {
        if (ctx.NumberLiteral[0].isInsertedInRecovery) {
          this.addError(ctx, "Missing Time Study number", "Provide a Time Study ID to purchase");
          return;
        }
        const id = this.checkTimeStudyNumber(ctx.NumberLiteral[0]);
        if (id) studiesOut.push(id);
        return;
      }
      if (ctx.StudyPath) {
        const pathId = ctx.StudyPath[0].tokenType.$studyPath;
        const pathStudies = NormalTimeStudies.paths[pathId];
        studiesOut.push(...pathStudies);
      }
    }

    studyList(ctx) {
      if (ctx.$cached !== undefined) return ctx.$cached;
      const studiesOut = [];
      for (const sle of ctx.studyListEntry) this.visit(sle, studiesOut);
      const positionRange = Validator.getPositionRange(ctx);
      ctx.$cached = {
        normal: studiesOut,
        image: this.rawText.substr(positionRange.startOffset, positionRange.endOffset - positionRange.startOffset + 1),
        ec: 0
      };
      if (ctx.ECNumber) {
        if (ctx.ECNumber.isInsertedInRecovery) {
          this.addError(ctx.Pipe[0], "Missing Eternity Challenge number",
            "Specify which Eternity Challenge is being referred to");
        }
        const ecNumber = parseFloat(ctx.ECNumber[0].image);
        if (!Number.isInteger(ecNumber) || ecNumber < 0 || ecNumber > 12) {
          this.addError(ctx.ECNumber, `Invalid Eternity Challenge ID ${ecNumber}`,
            `Eternity Challenge ${ecNumber} does not exist, use an integer between ${format(1)} and ${format(12)}`);
        }
        ctx.$cached.ec = ecNumber;
      }
      return ctx.$cached;
    }

    compareValue(ctx) {
      if (ctx.NumberLiteral) {
        ctx.$value = new Decimal(ctx.NumberLiteral[0].image);
      } else if (ctx.Identifier) {
        const varLookup = this.lookupVar(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.NUMBER);
        if (varLookup) ctx.$value = varLookup.value;
      }
    }

    comparison(ctx) {
      super.comparison(ctx);
      if (!ctx.compareValue || ctx.compareValue[0].recoveredNode ||
        ctx.compareValue.length !== 2 || ctx.compareValue[1].recoveredNode) {
        this.addError(ctx, "Missing value for comparison", "Ensure that the comparison has two values");
      }
      if (!ctx.ComparisonOperator || ctx.ComparisonOperator[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing comparison operator (<, >, <=, >=)", "Insert the appropriate comparison operator");
        return;
      }
      const T = AutomatorLexer.tokenMap;
      if (ctx.ComparisonOperator[0].tokenType === T.OpEQ || ctx.ComparisonOperator[0].tokenType === T.EqualSign) {
        this.addError(ctx, "Please use an inequality comparison (>,<,>=,<=)",
          "Comparisons cannot be done with equality, only with inequality operators");
      }
    }

    badCommand(ctx) {
      const firstToken = ctx.badCommandToken[0].children;
      const firstTokenType = Object.keys(firstToken)[0];
      this.addError(firstToken[firstTokenType][0], `Unrecognized command "${firstToken[firstTokenType][0].image}"`,
        "Check to make sure you have typed in the command name correctly");
    }

    eternityChallenge(ctx) {
      let errToken, ecNumber;
      if (ctx.ECLiteral) {
        ecNumber = parseFloat(ctx.ECLiteral[0].image.substr(2));
        errToken = ctx.ECLiteral[0];
      } else if (ctx.NumberLiteral) {
        ecNumber = parseFloat(ctx.NumberLiteral[0].image);
        errToken = ctx.NumberLiteral[0];
      } else {
        this.addError(ctx, "Missing Eternity Challenge number",
          "Specify which Eternity Challenge is being referred to");
        return;
      }
      if (!Number.isInteger(ecNumber) || ecNumber < 1 || ecNumber > 12) {
        this.addError(errToken, `Invalid Eternity Challenge ID ${ecNumber}`,
          `Eternity Challenge ${ecNumber} does not exist, use an integer between ${format(1)} and ${format(12)}`);
      }
      ctx.$ecNumber = ecNumber;
    }

    checkBlock(ctx, commandToken) {
      let hadError = false;
      if (!ctx.RCurly || ctx.RCurly[0].isInsertedInRecovery) {
        this.addError(commandToken[0], "Missing closing }",
          "Your loop has a mismatched brackets, add a corresponding } to close the loop");
        hadError = true;
      }
      if (!ctx.LCurly || ctx.LCurly[0].isInsertedInRecovery) {
        this.addError(commandToken[0], "Missing opening {",
          "You have a } closing a loop which does not exist, remove the }");
        hadError = true;
      }
      return !hadError;
    }

    script(ctx) {
      if (ctx.block) this.visit(ctx.block);
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
        // eslint-disable-next-line no-loop-func
        this[cmd.id] = (ctx, output) => {
          // For the compiler, we don't bother doing the default recursive visitation behavior
          if (ownMethod && ownMethod !== super[cmd.id]) ownMethod.call(this, ctx, output);
          let compiled = cmd.compile(ctx, this);
          if (typeof compiled === "function") compiled = { run: compiled };
          compiled.lineNumber = ctx.startLine;
          output.push(compiled);
        };
      }
      this.validateVisitor();
    }

    comparison(ctx) {
      const getters = ctx.compareValue.map(cv => (
        cv.children.AutomatorCurrency ? cv.children.AutomatorCurrency[0].tokenType.$getter : () => cv.children.$value
      ));
      const compareFun = ctx.ComparisonOperator[0].tokenType.$compare;
      return () => compareFun(getters[0](), getters[1]());
    }

    block(ctx) {
      const output = [];
      if (ctx.command) for (const cmd of ctx.command) this.visit(cmd, output);
      return output;
    }

    script(ctx) {
      if (ctx.variables === undefined) {
        throw new Error("Compiler called before Validator");
      }
      return ctx.block ? this.visit(ctx.block) : [];
    }
  }

  class Blockifier extends BaseVisitor {
    constructor() {
      super();
      for (const cmd of AutomatorCommands) {
        const blockify = cmd.blockify;
        if (!blockify) continue;
        const ownMethod = this[cmd.id];
        // eslint-disable-next-line no-loop-func
        this[cmd.id] = (ctx, output) => {
          if (ownMethod && ownMethod !== super[cmd.id]) ownMethod.call(this, ctx, output);
          const block = blockify(ctx, this);
          output.push({
            ...block,
            id: UIID.next()
          });
        };
      }
      this.validateVisitor();
    }

    comparison(ctx) {
      const isCurrency = ctx.compareValue.map(cv => Boolean(cv.children.AutomatorCurrency));
      // eslint-disable-next-line no-bitwise
      if (!(isCurrency[0] ^ isCurrency[1])) {
        throw new Error("arbitrary comparisons are not supported in block mode yet");
      }
      const currencyIndex = isCurrency[0] ? 0 : 1;
      const flipped = currencyIndex === 1;
      const valueChildren = ctx.compareValue[1 - currencyIndex].children;
      const isDecimalValue = Boolean(valueChildren.$value);
      const value = isDecimalValue ? valueChildren.$value.toString() : valueChildren.NumberLiteral[0].image;
      let operator = ctx.ComparisonOperator[0].image;
      if (flipped) {
        switch (operator) {
          case ">":
            operator = "<";
            break;
          case "<":
            operator = ">";
            break;
          case ">=":
            operator = "<=";
            break;
          case "<=":
            operator = ">=";
            break;
        }
      }
      return {
        target: ctx.compareValue[currencyIndex].children.AutomatorCurrency[0].image,
        secondaryTarget: operator,
        inputValue: value,
      };
    }

    script(ctx) {
      const output = [];
      if (ctx.block) this.visit(ctx.block, output);
      return output;
    }

    block(ctx, output) {
      if (ctx.command) {
        for (const cmd of ctx.command) {
          this.visit(cmd, output);
        }
      }
    }
  }

  function compile(input, validateOnly = false) {
    const lexResult = AutomatorLexer.lexer.tokenize(input);
    const tokens = lexResult.tokens;
    parser.input = tokens;
    const parseResult = parser.script();
    const validator = new Validator(input);
    validator.visit(parseResult);
    validator.addLexerErrors(lexResult.errors);
    validator.addParserErrors(parser.errors, tokens);
    validator.generateMissingTips();
    let compiled;
    if (validator.errors.length === 0 && !validateOnly) {
      compiled = new Compiler().visit(parseResult);
    }
    return {
      errors: validator.errors,
      compiled,
    };
  }
  AutomatorGrammar.compile = compile;

  function blockifyTextAutomator(input) {
    const lexResult = AutomatorLexer.lexer.tokenize(input);
    const tokens = lexResult.tokens;

    AutomatorGrammar.parser.input = tokens;
    const parseResult = AutomatorGrammar.parser.script();
    const validator = new Validator(input);
    validator.visit(parseResult);
    if (lexResult.errors.length === 0 && AutomatorGrammar.parser.errors.length === 0 && validator.errors.length === 0) {
      const b = new Blockifier();
      const blocks = b.visit(parseResult);
      return blocks;
    }

    return null;
  }
  AutomatorGrammar.blockifyTextAutomator = blockifyTextAutomator;

  function validateLine(input) {
    const lexResult = AutomatorLexer.lexer.tokenize(input);
    const tokens = lexResult.tokens;
    AutomatorGrammar.parser.input = tokens;
    const parseResult = AutomatorGrammar.parser.script();
    const validator = new Validator(input);
    validator.visit(parseResult);
    validator.addLexerErrors(lexResult.errors);
    validator.addParserErrors(parser.errors, tokens);
    validator.generateMissingTips();
    return validator;
  }

  AutomatorGrammar.validateLine = validateLine;
}());
