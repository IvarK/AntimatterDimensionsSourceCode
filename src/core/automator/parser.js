import { EOF, Parser } from "chevrotain";

import { automatorTokens, tokenMap as T } from "./lexer";
import { AutomatorCommands } from "./automator-commands";

// ----------------- parser -----------------
class AutomatorParser extends Parser {
  constructor() {
    super(automatorTokens, {
      recoveryEnabled: true,
      outputCst: true,
      nodeLocationTracking: "full",
    });

    // eslint-disable-next-line consistent-this
    const $ = this;

    $.RULE("script", () => $.SUBRULE($.block));

    $.RULE("block", () => $.MANY_SEP({
      SEP: T.EOL,
      DEF: () => $.OPTION(() => $.SUBRULE($.command)),
    }));

    // This is a bit ugly looking. Chevrotain uses Function.toString() to do crazy
    // optimizations. That clashes with our desire to build our list of commands dynamically.
    // We are creating a function body like this one:
    //      $.RULE("command", () => {
    //          $.OR(
    //            $.c1 || ($.c1 = [
    //              { ALT: () => $.SUBRULE($.badCommand) },
    //              { ALT: () => $.SUBRULE($.auto) },
    //              { ALT: () => $.SUBRULE($.define) },
    //              { ALT: () => $.SUBRULE($.ifBlock) },

    const commandAlts = [
      "$.SUBRULE($.badCommand)",
      "$.CONSUME(EOF)",
    ];

    for (const cmd of AutomatorCommands) {
      $.RULE(cmd.id, cmd.rule($));
      commandAlts.push(`$.SUBRULE($.${cmd.id})`);
    }

    const commandOr = window.Function("$", "EOF", `
      return () => $.OR($.c1 || ($.c1 = [
        ${commandAlts.map(e => `{ ALT: () => ${e} },`).join("\n")}]));
    `);

    $.RULE("command", commandOr($, EOF));

    $.RULE("badCommand", () => $.AT_LEAST_ONE(() => $.SUBRULE($.badCommandToken)),
      { resyncEnabled: false, }
    );

    $.RULE("badCommandToken", () => $.OR([
      { ALT: () => $.CONSUME(T.Identifier) },
      { ALT: () => $.CONSUME(T.NumberLiteral) },
      { ALT: () => $.CONSUME(T.ComparisonOperator) },
    ]), { resyncEnabled: false, });

    $.RULE("comparison", () => {
      $.SUBRULE($.compareValue);
      $.CONSUME(T.ComparisonOperator);
      $.SUBRULE2($.compareValue);
    });

    $.RULE("compareValue", () => $.OR([
      { ALT: () => $.CONSUME(T.NumberLiteral) },
      { ALT: () => $.CONSUME(T.Identifier) },
      { ALT: () => $.CONSUME(T.AutomatorCurrency) },
    ]));

    $.RULE("duration", () => {
      $.CONSUME(T.NumberLiteral);
      $.CONSUME(T.TimeUnit);
    });

    $.RULE("eternityChallenge", () => $.OR([
      {
        ALT: () => {
          $.CONSUME(T.EC);
          $.CONSUME(T.NumberLiteral);
        }
      },
      { ALT: () => $.CONSUME(T.ECLiteral) }
    ]));

    $.RULE("studyList", () => {
      $.AT_LEAST_ONE(() => $.SUBRULE($.studyListEntry));
      // Support the |3 export format for EC number and optionally the ending exclamation point
      $.OPTION(() => {
        $.CONSUME(T.Pipe);
        $.CONSUME1(T.NumberLiteral, { LABEL: "ECNumber" });
        $.OPTION1(() => $.CONSUME(T.Exclamation));
      });
    }, { resyncEnabled: false });

    $.RULE("studyListEntry", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.studyRange) },
        { ALT: () => $.CONSUME(T.NumberLiteral) },
        { ALT: () => $.CONSUME(T.StudyPath) },
      ]);
      $.OPTION(() => $.CONSUME(T.Comma));
    });

    $.RULE("studyRange", () => {
      $.CONSUME(T.NumberLiteral, { LABEL: "firstStudy" });
      $.CONSUME(T.Dash);
      $.CONSUME1(T.NumberLiteral, { LABEL: "lastStudy" });
    });

    $.RULE("xHighest", () => {
      $.CONSUME(T.NumberLiteral);
      $.CONSUME(T.XHighest);
    });

    $.RULE("currencyAmount", () => {
      $.CONSUME(T.NumberLiteral);
      $.CONSUME(T.AutomatorCurrency);
    });

    // Very important to call this after all the rules have been setup.
    // otherwise the parser may not work correctly as it will lack information
    // derived from the self analysis.
    $.performSelfAnalysis();
  }
}

export const parser = new AutomatorParser();
