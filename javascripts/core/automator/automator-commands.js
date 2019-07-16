"use strict";

/**
 * Note: the $ shorthand for the parser object is required by Chevrotain. Don't mess with it.
 */

const AutomatorCommands = ((() => {
  const T = AutomatorLexer.tokenMap;
  // The splitter tries to get a number 1 through 6, or anything else. Note: eslint complains
  // about lack of u flag here for some reason.
  // eslint-disable-next-line require-unicode-regexp
  const presetSplitter = new RegExp(/preset[ \t]+(?:([1-6]$)|(.+$))/ui);

  function prestigeNotify(flag) {
    if (!AutomatorBackend.isOn) return;
    const state = AutomatorBackend.stack.top.commandState;
    if (state && state.prestigeLevel !== undefined) {
      state.prestigeLevel = Math.max(state.prestigeLevel, flag);
    }
  }

  EventHub.logic.on(GameEvent.BIG_CRUNCH_AFTER, () => prestigeNotify(T.Infinity.$prestigeLevel));
  EventHub.logic.on(GameEvent.ETERNITY_RESET_AFTER, () => prestigeNotify(T.Eternity.$prestigeLevel));
  EventHub.logic.on(GameEvent.REALITY_RESET_AFTER, () => prestigeNotify(T.Reality.$prestigeLevel));

  // Used by while and until
  function compileConditionLoop(evalComparison, commands) {
    return {
      run: () => {
        if (!evalComparison()) return AutomatorCommandStatus.NEXT_TICK_NEXT_INSTRUCTION;
        AutomatorBackend.push(commands);
        return AutomatorCommandStatus.SAME_INSTRUCTION;
      },
      blockCommands: commands,
    };
  }

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
      validate: (ctx, V) => {
        ctx.startLine = ctx.Auto[0].startLine;
        if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Reality && ctx.duration) {
          V.addError(ctx.duration[0], "auto reality cannot be set to a duration");
          return false;
        }
        return true;
      },
      compile: ctx => {
        const on = Boolean(ctx.On || ctx.duration);
        const duration = ctx.duration ? ctx.duration[0].children.$value : undefined;
        const durationMode = ctx.PrestigeEvent[0].tokenType.$autobuyerDurationMode;
        const autobuyer = ctx.PrestigeEvent[0].tokenType.$autobuyer;
        return () => {
          autobuyer.isOn = on;
          if (duration !== undefined) {
            autobuyer.mode = durationMode;
            autobuyer.limit = new Decimal(1e-3 * duration);
          }
          return AutomatorCommandStatus.NEXT_INSTRUCTION;
        };
      },
    },
    {
      id: "blackHole",
      rule: $ => () => {
        $.CONSUME(T.BlackHole);
        $.OR([
          { ALT: () => $.CONSUME(T.On) },
          { ALT: () => $.CONSUME(T.Off) },
        ]);
      },
      validate: (ctx, V) => {
        ctx.startLine = ctx.BlackHole[0].startLine;
        if (!BlackHole(1).isUnlocked) {
          V.addError(ctx.BlackHole[0], "black hole is not unlocked");
          return false;
        }
        return true;
      },
      compile: ctx => {
        const on = Boolean(ctx.On);
        return () => {
          if (on === BlackHoles.arePaused) BlackHoles.togglePause();
          return AutomatorCommandStatus.NEXT_INSTRUCTION;
        };
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
      validate: (ctx, V) => {
        ctx.startLine = ctx.Define[0].startLine;
        if (!ctx.Identifier || ctx.Identifier[0].isInsertedInRecovery || ctx.Identifier[0].image === "") {
          V.addError(ctx.Define, "missing variable name");
          return false;
        }
        return true;
      },
      // Since define creates constants, they are all resolved at compile. The actual define instruction
      // doesn't have to do anything.
      compile: () => () => AutomatorCommandStatus.NEXT_INSTRUCTION,
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
      validate: (ctx, V) => {
        ctx.startLine = ctx.If[0].startLine;
        return V.checkBlock(ctx, ctx.If);
      },
      compile: (ctx, C) => {
        const evalComparison = C.visit(ctx.comparison);
        const commands = C.visit(ctx.block);
        return {
          run: S => {
            // We avoid running the same if condition twice by creating an empty object
            // on the stack.
            if (S.commandState !== null) return AutomatorCommandStatus.NEXT_INSTRUCTION;
            S.commandState = {};
            if (!evalComparison()) return AutomatorCommandStatus.NEXT_INSTRUCTION;
            AutomatorBackend.push(commands);
            return AutomatorCommandStatus.SAME_INSTRUCTION;
          },
          blockCommands: commands,
        };
      }
    },
    {
      // Note: this has to appear before pause
      id: "pauseTime",
      rule: $ => () => {
        $.CONSUME(T.Pause);
        $.OR([
          { ALT: () => $.SUBRULE($.duration) },
          { ALT: () => $.CONSUME(T.Identifier) },
        ]);
      },
      validate: (ctx, V) => {
        ctx.startLine = ctx.Pause[0].startLine;
        ctx.$duration = ctx.Identifier
          ? V.lookupVar(ctx.Identifier[0], AutomatorVarTypes.DURATION).value
          : V.visit(ctx.duration);
        return ctx.$duration !== undefined;
      },
      compile: ctx => {
        const duration = ctx.$duration;
        return S => {
          if (S.commandState === null) {
            S.commandState = { timeMs: 0 };
          } else {
            S.commandState.timeMs += Time.unscaledDeltaTime.milliseconds;
          }
          return S.commandState.timeMs >= duration
            ? AutomatorCommandStatus.NEXT_INSTRUCTION
            : AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
        };
      }
    },
    {
      id: "pause",
      rule: $ => () => {
        $.CONSUME(T.Pause);
      },
      validate: ctx => {
        ctx.startLine = ctx.Pause[0].startLine;
        return true;
      },
      compile: () => () => {
        AutomatorBackend.pause();
        return AutomatorCommandStatus.NEXT_INSTRUCTION;
      },
    },
    {
      id: "prestige",
      rule: $ => () => {
        $.CONSUME(T.PrestigeEvent);
        $.OPTION(() => $.CONSUME(T.Nowait));
      },
      validate: ctx => {
        ctx.startLine = ctx.PrestigeEvent[0].startLine;
        return true;
      },
      compile: ctx => {
        const nowait = ctx.Nowait !== undefined;
        const prestigeToken = ctx.PrestigeEvent[0].tokenType;
        return () => {
          const available = prestigeToken.$prestigeAvailable();
          if (!available) {
            return nowait
              ? AutomatorCommandStatus.NEXT_INSTRUCTION
              : AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
          }
          prestigeToken.$prestige();
          return AutomatorCommandStatus.NEXT_TICK_NEXT_INSTRUCTION;
        };
      }
    },
    {
      id: "startDilation",
      rule: $ => () => {
        $.CONSUME(T.Start);
        $.CONSUME(T.Dilation);
      },
      validate: ctx => {
        ctx.startLine = ctx.Start[0].startLine;
        return true;
      },
      compile: () => () => {
        if (player.dilation.active) return AutomatorCommandStatus.NEXT_INSTRUCTION;
        if (startDilatedEternity(true)) return AutomatorCommandStatus.NEXT_TICK_NEXT_INSTRUCTION;
        return AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
      }
    },
    {
      id: "startEC",
      rule: $ => () => {
        $.CONSUME(T.Start);
        $.SUBRULE($.eternityChallenge);
      },
      validate: ctx => {
        ctx.startLine = ctx.Start[0].startLine;
        return true;
      },
      compile: ctx => {
        const ecNumber = ctx.eternityChallenge[0].children.$ecNumber;
        return () => {
          const ec = EternityChallenge(ecNumber);
          if (ec.isRunning) return AutomatorCommandStatus.NEXT_INSTRUCTION;
          if (!EternityChallenge(ecNumber).isUnlocked) {
            if (!TimeStudy.eternityChallenge(ecNumber).purchase(true)) {
              return AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
            }
          }
          if (ec.start(true)) return AutomatorCommandStatus.NEXT_TICK_NEXT_INSTRUCTION;
          return AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
        };
      }
    },
    {
      id: "storeTime",
      rule: $ => () => {
        $.CONSUME(T.StoreTime);
        $.OR([
          { ALT: () => $.CONSUME(T.On) },
          { ALT: () => $.CONSUME(T.Off) },
          { ALT: () => $.CONSUME(T.Use) },
        ]);
      },
      validate: (ctx, V) => {
        ctx.startLine = ctx.StoreTime[0].startLine;
        if (!Enslaved.isUnlocked) {
          V.addError(ctx.StoreTime[0], "Enslaved is not unlocked");
          return false;
        }
        return true;
      },
      compile: ctx => {
        if (ctx.Use) return () => {
          Enslaved.useStoredTime(false);
          return AutomatorCommandStatus.NEXT_INSTRUCTION;
        };
        const on = Boolean(ctx.On);
        return () => {
          if (on !== player.celestials.enslaved.isStoring) Enslaved.toggleStoreBlackHole();
          return AutomatorCommandStatus.NEXT_INSTRUCTION;
        };
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
      validate: (ctx, V) => {
        ctx.startLine = ctx.Studies[0].startLine;
        if (ctx.Identifier) {
          const varInfo = V.lookupVar(ctx.Identifier[0], AutomatorVarTypes.STUDIES);
          if (!varInfo) return;
          ctx.$studies = varInfo.value;
        } else if (ctx.studyList) {
          ctx.$studies = V.visit(ctx.studyList);
        }
      },
      compile: ctx => {
        const studies = ctx.$studies;
        if (ctx.Nowait === undefined) return () => {
          for (const tsNumber of studies.normal) {
            if (TimeStudy(tsNumber).isBought) continue;
            if (!TimeStudy(tsNumber).purchase()) {
              if (tsNumber === 201 && DilationUpgrade.timeStudySplit.isBought) continue;
              return AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
            }
          }
          if (!studies.ec || TimeStudy.eternityChallenge(studies.ec).isBought) {
            return AutomatorCommandStatus.NEXT_INSTRUCTION;
          }
          return TimeStudy.eternityChallenge(studies.ec).purchase(true)
            ? AutomatorCommandStatus.NEXT_INSTRUCTION
            : AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
        };
        return () => {
          for (const tsNumber of studies.normal) TimeStudy(tsNumber).purchase();
          if (!studies.ec || TimeStudy.eternityChallenge(studies.ec).isBought) {
            return AutomatorCommandStatus.NEXT_INSTRUCTION;
          }
          TimeStudy.eternityChallenge(studies.ec).purchase(true);
          return AutomatorCommandStatus.NEXT_INSTRUCTION;
        };
      },
    },
    {
      id: "studiesLoad",
      rule: $ => () => {
        $.CONSUME(T.Studies);
        $.CONSUME(T.Load);
        $.CONSUME(T.Preset);
      },
      validate: (ctx, V) => {
        ctx.startLine = ctx.Studies[0].startLine;
        if (!ctx.Preset || ctx.Preset[0].isInsertedInRecovery || ctx.Preset[0].image === "") {
          V.addError(ctx, "Missing preset and preset name");
          return false;
        }
        const split = presetSplitter.exec(ctx.Preset[0].image);
        if (!split) {
          V.addError(ctx.Preset[0], "Missing preset name or number");
          return false;
        }
        ctx.Preset[0].splitPresetResult = split;
        let presetIndex;
        if (split[2]) {
          // We don't need to do any verification if it's a number; if it's a name, we
          // check to make sure it exists:
          presetIndex = player.timestudy.presets.findIndex(e => e.name === split[2]) + 1;
          if (presetIndex === 0) {
            V.addError(ctx.Preset[0], `Could not find preset named ${split[2]} (note: names are case sensitive)`);
            return false;
          }
        } else {
          presetIndex = parseInt(split[1], 10);
        }
        ctx.$presetIndex = presetIndex;
        return true;
      },
      compile: ctx => {
        const presetIndex = ctx.$presetIndex;
        return () => {
          importStudyTree(player.timestudy.presets[presetIndex - 1].studies);
          return AutomatorCommandStatus.NEXT_INSTRUCTION;
        };
      }
    },
    {
      id: "studiesRespec",
      rule: $ => () => {
        $.CONSUME(T.Studies);
        $.CONSUME(T.Respec);
      },
      validate: ctx => {
        ctx.startLine = ctx.Studies[0].startLine;
        return true;
      },
      compile: () => () => {
        player.respec = true;
        return AutomatorCommandStatus.NEXT_INSTRUCTION;
      }
    },
    {
      id: "tt",
      rule: $ => () => {
        $.OPTION(() => $.CONSUME(T.Buy));
        $.CONSUME(T.TT);
        $.CONSUME(T.TTCurrency);
      },
      validate: ctx => {
        ctx.startLine = (ctx.Buy || ctx.TT)[0].startLine;
        return true;
      },
      compile: ctx => {
        const buyFunction = ctx.TTCurrency[0].tokenType.$buyTT;
        return () => (buyFunction()
          ? AutomatorCommandStatus.NEXT_INSTRUCTION
          : AutomatorCommandStatus.NEXT_TICK_NEXT_INSTRUCTION);
      }
    },
    {
      id: "unlockDilation",
      rule: $ => () => {
        $.CONSUME(T.Unlock);
        $.CONSUME(T.Dilation);
      },
      validate: ctx => {
        ctx.startLine = ctx.Unlock[0].startLine;
        return true;
      },
      compile: () => () => {
        if (TimeStudy.dilation.isBought) return AutomatorCommandStatus.NEXT_INSTRUCTION;
        return TimeStudy.dilation.purchase(true)
          ? AutomatorCommandStatus.NEXT_INSTRUCTION
          : AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
      }
    },
    {
      id: "unlockEC",
      rule: $ => () => {
        $.CONSUME(T.Unlock);
        $.SUBRULE($.eternityChallenge);
      },
      validate: ctx => {
        ctx.startLine = ctx.Unlock[0].startLine;
        return true;
      },
      compile: ctx => {
        const ecNumber = ctx.eternityChallenge[0].children.$ecNumber;
        return () => {
          if (EternityChallenge(ecNumber).isUnlocked) return AutomatorCommandStatus.NEXT_INSTRUCTION;
          return TimeStudy.eternityChallenge(ecNumber).purchase(true)
            ? AutomatorCommandStatus.NEXT_INSTRUCTION
            : AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
        };
      }
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
      validate: (ctx, V) => {
        ctx.startLine = ctx.Until[0].startLine;
        return V.checkBlock(ctx, ctx.Until);
      },
      compile: (ctx, C) => {
        const commands = C.visit(ctx.block);
        if (ctx.comparison) {
          const evalComparison = C.visit(ctx.comparison);
          return compileConditionLoop(() => !evalComparison(), commands);
        }
        const prestigeLevel = ctx.PrestigeEvent[0].tokenType.$prestigeLevel;
        return {
          run: S => {
            if (S.commandState === null) {
              S.commandState = { prestigeLevel: 0 };
            }
            if (S.commandState.prestigeLevel >= prestigeLevel) return AutomatorCommandStatus.NEXT_INSTRUCTION;
            AutomatorBackend.push(commands);
            return AutomatorCommandStatus.SAME_INSTRUCTION;
          },
          blockCommands: commands
        };
      }
    },
    {
      id: "waitCondition",
      rule: $ => () => {
        $.CONSUME(T.Wait);
        $.SUBRULE($.comparison);
      },
      validate: ctx => {
        ctx.startLine = ctx.Wait[0].startLine;
        return true;
      },
      compile: (ctx, C) => {
        const evalComparison = C.visit(ctx.comparison);
        return () => (evalComparison()
          ? AutomatorCommandStatus.NEXT_INSTRUCTION
          : AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION);
      }
    },
    {
      id: "waitEvent",
      rule: $ => () => {
        $.CONSUME(T.Wait);
        $.CONSUME(T.PrestigeEvent);
      },
      validate: ctx => {
        ctx.startLine = ctx.Wait[0].startLine;
        return true;
      },
      compile: ctx => {
        const prestigeLevel = ctx.PrestigeEvent[0].tokenType.$prestigeLevel;
        return S => {
          if (S.commandState === null) {
            S.commandState = { prestigeLevel: 0 };
          }
          return S.commandState.prestigeLevel >= prestigeLevel
            ? AutomatorCommandStatus.NEXT_INSTRUCTION
            : AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
        };
      }
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
      validate: (ctx, V) => {
        ctx.startLine = ctx.While[0].startLine;
        return V.checkBlock(ctx, ctx.While);
      },
      compile: (ctx, C) => compileConditionLoop(C.visit(ctx.comparison), C.visit(ctx.block)),
    },
  ];
})());