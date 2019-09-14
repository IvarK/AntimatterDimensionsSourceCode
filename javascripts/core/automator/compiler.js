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
          info: `Unexpected characters "${this.rawText.substr(err.offset, err.length)}"`,
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
          }
        } else if (parseError.name === "EarlyExitException") {
          err.info = "Unexpected end of command";
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

    addError(ctx, errInfo) {
      const pos = Validator.getPositionRange(ctx);
      pos.info = errInfo;
      this.errors.push(pos);
    }

    reset(rawText) {
      this.rawText = rawText;
      this.variables = {};
      this.errors = [];
    }

    checkTimeStudyNumber(token) {
      const tsNumber = parseFloat(token.image);
      if (!TimeStudy(tsNumber)) {
        this.addError(token, `Invalid time study identifier ${tsNumber}`);
        return 0;
      }
      return tsNumber;
    }

    lookupVar(identifier, type) {
      const varName = identifier.image;
      const varInfo = this.variables[varName];
      if (varInfo === undefined) {
        this.addError(identifier, `Variable ${varName} has not been defined`);
        return undefined;
      }
      if (varInfo.type === AutomatorVarTypes.UNKNOWN) {
        varInfo.firstUseLineNumber = identifier.image.startLine;
        varInfo.type = type;
        if (type === AutomatorVarTypes.STUDIES) {
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
        this.addError(identifier, `Variable ${varName} is not a ${type.name}${inferenceMessage}`);
        return undefined;
      }
      if (varInfo.value === undefined) throw new Error("Unexpected undefined Automator variable value");
      return varInfo;
    }

    duration(ctx) {
      if (ctx.$value) return ctx.$value;
      if (!ctx.TimeUnit || ctx.TimeUnit[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing time unit");
        return undefined;
      }
      const value = parseFloat(ctx.NumberLiteral[0].image) * ctx.TimeUnit[0].tokenType.$scale;
      if (isNaN(value)) {
        this.addError(ctx, "Error parsing duration");
        return undefined;
      }
      ctx.$value = value;
      return ctx.$value;
    }

    xLast(ctx) {
      if (ctx.$value) return ctx.$value;
      if (!ctx.NumberLiteral || ctx.NumberLiteral[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing multiplier");
        return undefined;
      }
      ctx.$value = new Decimal(ctx.NumberLiteral[0].image);
      return ctx.$value;
    }

    currencyAmount(ctx) {
      if (ctx.$value) return ctx.$value;
      if (!ctx.NumberLiteral || ctx.NumberLiteral[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing amount");
        return undefined;
      }
      ctx.$value = new Decimal(ctx.NumberLiteral[0].image);
      return ctx.$value;
    }

    define(ctx) {
      const varName = ctx.Identifier[0].image;
      if (this.variables[varName] !== undefined) {
        this.addError(ctx.Identifier[0],
          `Variable ${varName} already defined on line ${this.variables[varName].definitionLineNumber}`);
        return;
      }
      if (!ctx.duration && !ctx.studyList) return;
      const def = {
        name: varName,
        definitionLineNumber: ctx.Identifier[0].startLine,
        firstUseLineNumber: 0,
        type: AutomatorVarTypes.UNKNOWN,
        value: undefined,
      };
      this.variables[varName] = def;
      if (ctx.duration) {
        def.type = AutomatorVarTypes.DURATION;
        def.value = this.visit(ctx.duration);
        return;
      }
      // We don't visit studyList because it might actually be just a number in this case
      const studies = ctx.studyList[0].children.studyListEntry;
      if (studies.length > 1 || studies[0].children.studyRange ||
        studies[0].children.StudyPath || studies[0].children.Comma) {
        def.type = AutomatorVarTypes.STUDIES;
        def.value = this.visit(ctx.studyList);
        return;
      }
      // We assume the value is a number; in some cases, we might overwrite it if we see
      // this variable used in studies
      def.value = new Decimal(studies[0].children.NumberLiteral[0].image);
      if (!/^[1-9][0-9]*[1-9]$/u.test(studies[0].children.NumberLiteral[0].image)) {
        // Study numbers are pretty specific number patterns
        def.type = AutomatorVarTypes.NUMBER;
      }
    }

    studyRange(ctx, studiesOut) {
      if (!ctx.firstStudy || ctx.firstStudy[0].isInsertedInRecovery ||
        !ctx.lastStudy || ctx.lastStudy[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing time study number in range");
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
          this.addError(ctx, "Missing time study number");
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
          this.addError(ctx.Pipe[0], "Missing eternity challenge number");
        }
        const ecNumber = parseFloat(ctx.ECNumber[0].image);
        if (!Number.isInteger(ecNumber) || ecNumber < 0 || ecNumber > 12) {
          this.addError(ctx.ECNumber, `Invalid eternity challenge ID ${ecNumber}`);
        }
        ctx.$cached.ec = ecNumber;
      }
      return ctx.$cached;
    }

    compareValue(ctx) {
      if (ctx.NumberLiteral) {
        ctx.$value = new Decimal(ctx.NumberLiteral[0].image);
      } else if (ctx.Identifier) {
        const varLookup = this.lookupVar(ctx.Identifier[0], AutomatorVarTypes.NUMBER);
        if (varLookup) ctx.$value = varLookup.value;
      }
    }

    comparison(ctx) {
      super.comparison(ctx);
      if (!ctx.compareValue || ctx.compareValue[0].recoveredNode) {
        this.addError(ctx, "Missing value for comparison");
      }
      if (!ctx.Currency || ctx.Currency[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing currency for comparison");
      }
      if (!ctx.ComparisonOperator || ctx.ComparisonOperator[0].isInsertedInRecovery) {
        this.addError(ctx, "Missing comparison operator (<, >, <=, >=)");
        return;
      }
      const T = AutomatorLexer.tokenMap;
      if (ctx.ComparisonOperator[0].tokenType === T.OpEQ || ctx.ComparisonOperator[0].tokenType === T.EqualSign) {
        this.addError(ctx, "Please use an inequality comparison (>,<,>=,<=)");
      }
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
      } else if (ctx.NumberLiteral) {
        ecNumber = parseFloat(ctx.NumberLiteral[0].image);
        errToken = ctx.NumberLiteral[0];
      } else {
        this.addError(ctx, "Missing eternity challenge number");
        return;
      }
      if (!Number.isInteger(ecNumber) || ecNumber < 1 || ecNumber > 12) {
        this.addError(errToken, `Invalid eternity challenge ID ${ecNumber}`);
      }
      ctx.$ecNumber = ecNumber;
    }

    checkBlock(ctx, commandToken) {
      let hadError = false;
      if (!ctx.RCurly || ctx.RCurly[0].isInsertedInRecovery) {
        this.addError(commandToken[0], "Missing closing }");
        hadError = true;
      }
      if (!ctx.LCurly || ctx.LCurly[0].isInsertedInRecovery) {
        this.addError(commandToken[0], "Missing opening {");
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
      const flipped = ctx.Currency[0].startOffset > ctx.ComparisonOperator[0].startOffset;
      const threshold = ctx.compareValue[0].children.$value;
      const currencyGetter = ctx.Currency[0].tokenType.$getter;
      const compareFun = ctx.ComparisonOperator[0].tokenType.$compare;
      return () => {
        const currency = currencyGetter();
        return flipped ? compareFun(threshold, currency) : compareFun(currency, threshold);
      };
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
          let block = blockify(ctx, this);
          output.push({
            ...block,
            id: UIID.next()
          });
        };
      }
      this.validateVisitor();
    }

    comparison(ctx) {
      const flipped = ctx.Currency[0].startOffset > ctx.ComparisonOperator[0].startOffset;
      const valueChildren = ctx.compareValue[0].children
      const isDecimalValue = Boolean(valueChildren.$value)
      const value = isDecimalValue ? valueChildren.$value.toString() : valueChildren.NumberLiteral[0].image
      let operator = ctx.ComparisonOperator[0].image
      if (flipped) {
        switch (operator) {
          case ">": operator = "<"; break;
          case "<": operator = ">"; break;
          case ">=": operator = "<="; break;
          case "<=": operator = ">="; break;
        }
      }
      return {
        target: ctx.Currency[0].image,
        secondaryTarget: operator,
        inputValue: value,
      }
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
    const parseResult = AutomatorGrammar.parser.script()
    const validator = new Validator(input);
    validator.visit(parseResult)
    if (lexResult.errors.length == 0 && AutomatorGrammar.parser.errors.length == 0 && validator.errors.length == 0) {
      const b = new Blockifier()
      let blocks = b.visit(parseResult)
      return blocks
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
    return validator
  }

  AutomatorGrammar.validateLine = validateLine;
}());
