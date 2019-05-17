"use strict";

/**
 * Note: the $ shorthand for the parser object is required by Chevrotain. Don't mess with it.
 */

const AutomatorCommands = ((() => {
  const T = AutomatorLexer.tokenMap;
  return [
    {
      id: "auto",
      rule: $ => () => {
        $.CONSUME(T.Auto);
        $.CONSUME(T.PrestigeEvent);
        $.OR([
          { ALT: () => $.CONSUME(T.On) },
          { ALT: () => $.CONSUME(T.Off) },
          { ALT: () => $.SUBRULE($.duration) },
        ]);
      },
      validate: (V, ctx) => {
        if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Reality && ctx.duration) {
          V.addError(ctx.duration[0], "auto reality cannot be set to a duration");
          return false;
        }
        return true;
      },
      compile: (C, ctx) => {
        const on = ctx.On || ctx.duration;
        const autobuyer = ctx.PrestigeEvent[0].tokenType.$autobuyer;
        autobuyer.isOn = on;
        if (ctx.duration) autobuyer.mode = ctx.PrestigeEvent[0].tokenType.$autobuyerDurationMode;
      },
    },
    {
      id: "define",
      rule: $ => () => {
        $.CONSUME(T.Define);
        $.CONSUME(T.Identifier);
        $.CONSUME(T.EqualSign);
        $.OR([
          { ALT: () => $.SUBRULE($.duration) },
          { ALT: () => $.SUBRULE($.studyList) },
        ]);
      },
      validate: (V, ctx) => {
        if (!ctx.Identifier || ctx.Identifier[0].isInsertedInRecovery || ctx.Identifier[0].image === "") {
          V.addError(ctx.Define, "missing variable name");
          return false;
        }
        return true;
      }
    },
    {
      id: "ifBlock",
      rule: $ => () => {
        $.CONSUME(T.If);
        $.SUBRULE($.comparison);
        $.CONSUME(T.LCurly);
        $.CONSUME(T.EOL);
        $.SUBRULE($.block);
        $.CONSUME(T.RCurly);
      },
    },
    {
      // Note: this has to appear before pause
      id: "pauseTime",
      rule: $ => () => {
        $.CONSUME(T.Pause);
        $.OR([
          { ALT: () => $.SUBRULE($.duration) },
          { ALT: () => $.CONSUME(Identifier) },
        ])
      },
      validate: (V, ctx) => {
        return ctx.Identifier
          ? V.checkVarUse(ctx.Identifier[0], AutomatorVarTypes.DURATION)
          : true;
      },
      compile: (C, ctx) => S => {
        if (S.commandState === null) {
          S.commandState = { timeMs: 0 };
        } else {
          S.commandState.timeMs += Time.unscaledDeltaTime.milliseconds;
        }
        return AutomatorBackend.variables.resolveNumber(command.timeMs).gte(state.commandState.timeMs)
        ? AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION
        : AutomatorCommandStatus.NEXT_INSTRUCTION;
      },
    },
    {
      id: "pause",
      rule: $ => () => {
        $.CONSUME(T.Pause);
      },
      compile: (C, ctx) => {
        if (ctx.duration) {
          return S => {
            if (S.commandState === null) {
              S.commandState = { timeMs: 0 };
            } else {
              S.commandState.timeMs += Time.unscaledDeltaTime.milliseconds;
            }
          };
        } else {

        }
        const on = ctx.On || ctx.duration;
        const autobuyer = ctx.PrestigeEvent[0].tokenType.$autobuyer;
        autobuyer.isOn = on;
        if (ctx.duration) autobuyer.mode = ctx.PrestigeEvent[0].tokenType.$autobuyerDurationMode;
      },
    },
    {
      id: "prestige",
      rule: $ => () => {
        $.CONSUME(T.PrestigeEvent);
        $.OPTION(() => $.CONSUME(T.Nowait));
      },
      compile: (C, ctx) => {
        
      }
    },
    {
      id: "startDilation",
      rule: $ => () => {
        $.CONSUME(T.Start);
        $.CONSUME(T.Dilation);
      },
    },
    {
      id: "startEC",
      rule: $ => () => {
        $.CONSUME(T.Start);
        $.SUBRULE($.eternityChallenge);
      },
    },
    {
      id: "studiesBuy",
      rule: $ => () => {
        $.CONSUME(T.Studies);
        $.OPTION(() => $.CONSUME(T.Nowait));
        $.OR([
          { ALT: () => $.SUBRULE($.studyList) },
          { ALT: () => $.CONSUME1(T.Identifier) },
        ]);
      },
    },
    {
      id: "studiesLoad",
      rule: $ => () => {
        $.CONSUME(T.Studies);
        $.CONSUME(T.Load);
        $.CONSUME(T.Preset);
      },
      validate: (V, ctx) => {
        if (!ctx.Preset || ctx.Preset[0].isInsertedInRecovery || ctx.Preset[0].image === "") {
          V.addError(ctx, "Missing preset and preset name");
          return false;
        }
        return true;
      }
    },
    {
      id: "studiesRespec",
      rule: $ => () => {
        $.CONSUME(T.Studies);
        $.CONSUME(T.Respec);
      },
    },
    {
      id: "tt",
      rule: $ => () => {
        $.OPTION(() => $.CONSUME(T.Buy));
        $.CONSUME(T.TT);
        $.OR([
          { ALT: () => $.CONSUME(T.Max) },
          { ALT: () => $.CONSUME(T.AM) },
          { ALT: () => $.CONSUME(T.EP) },
          { ALT: () => $.CONSUME(T.IP) },
        ]);
      },
    },
    {
      id: "unlockDilation",
      rule: $ => () => {
        $.CONSUME(T.Unlock);
        $.CONSUME(T.Dilation);
      },
    },
    {
      id: "unlockEC",
      rule: $ => () => {
        $.CONSUME(T.Unlock);
        $.SUBRULE($.eternityChallenge);
      },
    },
    {
      id: "untilLoop",
      rule: $ => () => {
        $.CONSUME(T.Until);
        $.OR([
          { ALT: () => $.SUBRULE($.comparison) },
          { ALT: () => $.CONSUME(T.PrestigeEvent) },
        ]);
        $.CONSUME(T.LCurly);
        $.CONSUME(T.EOL);
        $.SUBRULE($.block);
        $.CONSUME(T.RCurly);
      },
    },
    {
      id: "waitCondition",
      rule: $ => () => {
        $.CONSUME(T.Wait);
        $.SUBRULE($.comparison);
      },
    },
    {
      id: "waitEvent",
      rule: $ => () => {
        $.CONSUME(T.Wait);
        $.CONSUME(T.PrestigeEvent);
      },
    },
    {
      id: "whileLoop",
      rule: $ => () => {
        $.CONSUME(T.While);
        $.SUBRULE($.comparison);
        $.CONSUME(T.LCurly);
        $.CONSUME(T.EOL);
        $.SUBRULE($.block);
        $.CONSUME(T.RCurly);
      },
    },

  ]
})());