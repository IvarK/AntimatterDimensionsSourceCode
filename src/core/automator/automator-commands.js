import { standardizeAutomatorValues, tokenMap as T } from "./lexer";

/**
 * Note: the $ shorthand for the parser object is required by Chevrotain. Don't mess with it.
 */

const presetSplitter = /name[ \t]+(.+$)/ui;
const idSplitter = /id[ \t]+(\d)/ui;

function prestigeNotify(flag) {
  if (!AutomatorBackend.isOn) return;
  const state = AutomatorBackend.stack.top.commandState;
  if (state && state.prestigeLevel !== undefined) {
    state.prestigeLevel = Math.max(state.prestigeLevel, flag);
  }
}

EventHub.logic.on(GAME_EVENT.BIG_CRUNCH_AFTER, () => prestigeNotify(T.Infinity.$prestigeLevel));
EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_AFTER, () => prestigeNotify(T.Eternity.$prestigeLevel));
EventHub.logic.on(GAME_EVENT.REALITY_RESET_AFTER, () => prestigeNotify(T.Reality.$prestigeLevel));

// Used by while and until - in order to get the text corrext, we need to invert the boolean if it's an until
// eslint-disable-next-line max-params
function compileConditionLoop(evalComparison, commands, ctx, isUntil) {
  return {
    run: () => {
      const loopStr = isUntil ? "UNTIL" : "WHILE";
      if (!evalComparison()) {
        AutomatorData.logCommandEvent(`Checked ${parseConditionalIntoText(ctx)} (${isUntil}),
          exiting loop at line ${AutomatorBackend.translateLineNumber(ctx.RCurly[0].startLine + 1) - 1}
          (end of ${loopStr} loop)`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
      }
      AutomatorBackend.push(commands);
      AutomatorData.logCommandEvent(`Checked ${parseConditionalIntoText(ctx)} (${!isUntil}),
        moving to line ${AutomatorBackend.translateLineNumber(ctx.LCurly[0].startLine + 1) - 1}
        (start of ${loopStr} loop)`, ctx.startLine);
      return AUTOMATOR_COMMAND_STATUS.SAME_INSTRUCTION;
    },
    blockCommands: commands,
  };
}

// Extracts the conditional out of a command and returns it as text
function parseConditionalIntoText(ctx) {
  const comp = ctx.comparison[0].children;
  const getters = comp.compareValue.map(cv => {
    if (cv.children.AutomatorCurrency) return () => cv.children.AutomatorCurrency[0].image;
    const val = cv.children.$value;
    if (typeof val === "string") return () => val;
    return () => format(val, 2, 2);
  });
  const compareFn = comp.ComparisonOperator[0].image;
  return `${getters[0]()} ${compareFn} ${getters[1]()}`;
}

// Determines how much (prestige currency) the previous (layer) reset gave, for event logging
function findLastPrestigeRecord(layer) {
  let addedECs, gainedEP;
  switch (layer) {
    case "INFINITY":
      return `${format(player.records.recentInfinities[0][1], 2)} IP`;
    case "ETERNITY":
      addedECs = AutomatorData.lastECCompletionCount;
      gainedEP = `${format(player.records.recentEternities[0][1], 2)} EP`;
      return addedECs === 0
        ? `${gainedEP}`
        : `${gainedEP}, ${addedECs} completions`;
    case "REALITY":
      return `${format(player.records.recentRealities[0][1], 2)} RM`;
    default:
      throw Error(`Unrecognized prestige ${layer} in Automator event log`);
  }
}

export const AutomatorCommands = [
  {
    id: "auto",
    rule: $ => () => {
      $.CONSUME(T.Auto);
      $.CONSUME(T.PrestigeEvent);
      $.OR([
        { ALT: () => $.CONSUME(T.On) },
        { ALT: () => $.CONSUME(T.Off) },
        { ALT: () => $.OR1([
          { ALT: () => $.SUBRULE($.duration) },
          { ALT: () => $.SUBRULE($.xHighest) },
          { ALT: () => $.SUBRULE($.currencyAmount) },
        ]) },
      ]);
    },
    // eslint-disable-next-line complexity
    validate: (ctx, V) => {
      ctx.startLine = ctx.Auto[0].startLine;
      if (ctx.PrestigeEvent && ctx.currencyAmount) {
        const desired$ = ctx.PrestigeEvent[0].tokenType.$prestigeCurrency;
        const specified$ = ctx.currencyAmount[0].children.AutomatorCurrency[0].tokenType.name;
        if (desired$ !== specified$) {
          V.addError(ctx.currencyAmount, `AutomatorCurrency doesn't match prestige (${desired$} vs ${specified$})`,
            `Use ${desired$} for the specified prestige resource`);
          return false;
        }
      }

      if (!ctx.PrestigeEvent) return true;
      const advSetting = ctx.duration || ctx.xHighest;
      // Do not change to switch statement; T.XXX are Objects, not primitive values
      if (ctx.PrestigeEvent[0].tokenType === T.Infinity) {
        if (!Autobuyer.bigCrunch.isUnlocked) {
          V.addError(ctx.PrestigeEvent, "Infinity autobuyer is not unlocked",
            "Complete the Big Crunch Autobuyer challenge to use this command");
          return false;
        }
        if (advSetting && !EternityMilestone.bigCrunchModes.isReached) {
          V.addError((ctx.duration || ctx.xHighest)[0],
            "Advanced Infinity autobuyer settings are not unlocked",
            `Reach ${quantifyInt("Eternity", EternityMilestone.bigCrunchModes.config.eternities)}
            to use this command`);
          return false;
        }
      }
      if (ctx.PrestigeEvent[0].tokenType === T.Eternity) {
        if (!EternityMilestone.autobuyerEternity.isReached) {
          V.addError(ctx.PrestigeEvent, "Eternity autobuyer is not unlocked",
            `Reach ${quantifyInt("Eternity", EternityMilestone.autobuyerEternity.config.eternities)}
            to use this command`);
          return false;
        }
        if (advSetting && !RealityUpgrade(13).isBought) {
          V.addError((ctx.duration || ctx.xHighest)[0],
            "Advanced Eternity autobuyer settings are not unlocked",
            "Purchase the Reality Upgrade which unlocks advanced Eternity autobuyer settings");
          return false;
        }
      }
      if (ctx.PrestigeEvent[0].tokenType === T.Reality) {
        if (!RealityUpgrade(25).isBought) {
          V.addError(ctx.PrestigeEvent, "Reality autobuyer is not unlocked",
            "Purchase the Reality Upgrade which unlocks the Reality autobuyer");
          return false;
        }
        if (advSetting) {
          V.addError((ctx.duration || ctx.xHighest)[0],
            "Auto Reality cannot be set to a duration or x highest",
            "Use RM for Auto Reality");
          return false;
        }
      }

      return true;
    },
    compile: ctx => {
      const isReality = ctx.PrestigeEvent[0].tokenType === T.Reality;
      const on = Boolean(ctx.On || ctx.duration || ctx.xHighest || ctx.currencyAmount);
      const duration = ctx.duration ? ctx.duration[0].children.$value : undefined;
      const xHighest = ctx.xHighest ? ctx.xHighest[0].children.$value : undefined;
      const fixedAmount = ctx.currencyAmount ? ctx.currencyAmount[0].children.$value : undefined;
      const durationMode = ctx.PrestigeEvent[0].tokenType.$autobuyerDurationMode;
      const xHighestMode = ctx.PrestigeEvent[0].tokenType.$autobuyerXHighestMode;
      const fixedMode = ctx.PrestigeEvent[0].tokenType.$autobuyerCurrencyMode;
      const autobuyer = ctx.PrestigeEvent[0].tokenType.$autobuyer();
      return () => {
        autobuyer.isActive = on;
        let currSetting = "";
        if (duration !== undefined) {
          autobuyer.mode = durationMode;
          autobuyer.time = duration / 1000;
          // Can't do the units provided in the script because it's been parsed away like 4 layers up the call stack
          currSetting = `${autobuyer.time > 1000 ? formatInt(autobuyer.time) : quantify("second", autobuyer.time)}`;
        } else if (xHighest !== undefined) {
          autobuyer.mode = xHighestMode;
          autobuyer.xHighest = new Decimal(xHighest);
          currSetting = `${format(xHighest, 2, 2)} times highest`;
        } else if (fixedAmount !== undefined) {
          autobuyer.mode = fixedMode;
          if (isReality) {
            autobuyer.rm = new Decimal(fixedAmount);
            currSetting = `${format(autobuyer.rm, 2)} RM`;
          } else {
            autobuyer.amount = new Decimal(fixedAmount);
            currSetting = `${fixedAmount} ${ctx.PrestigeEvent[0].image === "infinity" ? "IP" : "EP"}`;
          }
        }
        // Settings are drawn from the actual automator text; it's not feasible to parse out all the settings
        // for every combination of autobuyers when they get turned off
        const settingString = (autobuyer.isActive && currSetting !== "") ? `(Setting: ${currSetting})` : "";
        AutomatorData.logCommandEvent(`Automatic ${ctx.PrestigeEvent[0].image}
          turned ${autobuyer.isActive ? "ON" : "OFF"} ${settingString}`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => {
      const duration = ctx.duration
        ? `${ctx.duration[0].children.NumberLiteral[0].image} ${ctx.duration[0].children.TimeUnit[0].image}`
        : undefined;
      const xHighest = ctx.xHighest ? ctx.xHighest[0].children.$value : undefined;
      const fixedAmount = ctx.currencyAmount
        ? `${ctx.currencyAmount[0].children.NumberLiteral[0].image}` +
          ` ${ctx.currencyAmount[0].children.AutomatorCurrency[0].image.toUpperCase()}`
        : undefined;
      const on = Boolean(ctx.On);
      let input = "";

      if (duration) input = duration;
      else if (xHighest) input = `${xHighest} x highest`;
      else if (fixedAmount) input = `${fixedAmount}`;
      else input = (on ? "ON" : "OFF");

      return {
        singleSelectionInput: ctx.PrestigeEvent[0].tokenType.name.toUpperCase(),
        singleTextInput: input,
        ...automatorBlocksMap.AUTO
      };
    }
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
        if (Enslaved.isRunning || Pelle.isDisabled("blackhole")) {
          V.addError(ctx.BlackHole[0], "Black Hole is disabled in your current Reality",
            "Return to normal Reality conditions to use this command again");
        } else {
          V.addError(ctx.BlackHole[0], "Black Hole is not unlocked",
            "Unlock the Black Hole in order to pause or unpause it");
        }
        return false;
      }
      return true;
    },
    compile: ctx => {
      const on = Boolean(ctx.On);
      return () => {
        if (on === BlackHoles.arePaused) BlackHoles.togglePause();
        AutomatorData.logCommandEvent(`Black Holes toggled ${ctx.On ? "ON" : "OFF"}`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: ctx.On ? "ON" : "OFF",
      ...automatorBlocksMap["BLACK HOLE"]
    })
  },
  {
    id: "blob",
    rule: $ => () => {
      $.CONSUME(T.Blob);
    },
    validate: ctx => {
      ctx.startLine = ctx.Blob[0].startLine;
      return true;
    },
    // This is an easter egg, it shouldn't do anything
    compile: () => () => AUTOMATOR_COMMAND_STATUS.SKIP_INSTRUCTION,
    blockify: () => ({
      ...automatorBlocksMap.BLOB,
    })
  },
  {
    id: "comment",
    rule: $ => () => {
      $.CONSUME(T.Comment);
    },
    validate: ctx => {
      ctx.startLine = ctx.Comment[0].startLine;
      return true;
    },
    // Comments should be no-ops
    compile: () => () => AUTOMATOR_COMMAND_STATUS.SKIP_INSTRUCTION,
    blockify: ctx => ({
      ...automatorBlocksMap.COMMENT,
      singleTextInput: ctx.Comment[0].image.replace(/(#|\/\/)\s?/u, ""),
    })
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
          // If the commandState is empty, it means we haven't evaluated the if yet
          if (S.commandState !== null) return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          // We use this flag to make "single step" advance to the next command after the if when the block ends
          S.commandState = {
            advanceOnPop: true,
            ifEndLine: ctx.RCurly[0].startLine
          };
          if (!evalComparison()) {
            AutomatorData.logCommandEvent(`Checked ${parseConditionalIntoText(ctx)} (false),
              skipping to line ${AutomatorBackend.translateLineNumber(ctx.RCurly[0].startLine + 1)}`, ctx.startLine);
            return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          }
          AutomatorBackend.push(commands);
          AutomatorData.logCommandEvent(`Checked ${parseConditionalIntoText(ctx)} (true),
            entering IF block`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.SAME_INSTRUCTION;
        },
        blockCommands: commands,
      };
    },
    blockify: (ctx, B) => {
      const commands = [];
      B.visit(ctx.block, commands);
      const comparison = B.visit(ctx.comparison);
      return {
        nest: commands,
        ...automatorBlocksMap.IF,
        ...comparison,
        genericInput1: standardizeAutomatorValues(comparison.genericInput1),
        genericInput2: standardizeAutomatorValues(comparison.genericInput2)
      };
    }
  },
  {
    id: "notify",
    rule: $ => () => {
      $.CONSUME(T.Notify);
      $.OR([
        { ALT: () => $.CONSUME(T.StringLiteral) },
        { ALT: () => $.CONSUME(T.StringLiteralSingleQuote) },
      ]);
    },
    validate: ctx => {
      ctx.startLine = ctx.Notify[0].startLine;
      return true;
    },
    compile: ctx => {
      const notifyText = ctx.StringLiteral || ctx.StringLiteralSingleQuote;
      return () => {
        GameUI.notify.automator(`Automator: ${notifyText[0].image}`);
        AutomatorData.logCommandEvent(`NOTIFY call: ${notifyText[0].image}`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      ...automatorBlocksMap.NOTIFY,
      singleTextInput: (ctx.StringLiteral || ctx.StringLiteralSingleQuote)[0].image,
    })
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
      let duration;
      if (ctx.Identifier) {
        if (!V.isValidVarFormat(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.DURATION)) {
          V.addError(ctx, `Constant ${ctx.Identifier[0].image} is not a valid time duration constant`,
            `Ensure that ${ctx.Identifier[0].image} is a number of seconds less than
            ${format(Number.MAX_VALUE / 1000)}`);
          return false;
        }
        const lookup = V.lookupVar(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.DURATION);
        duration = lookup ? lookup.value : lookup;
      } else {
        duration = V.visit(ctx.duration);
      }
      ctx.$duration = duration;
      return ctx.$duration !== undefined;
    },
    compile: ctx => {
      const duration = ctx.$duration;
      return S => {
        let timeString;
        if (ctx.duration) {
          const c = ctx.duration[0].children;
          timeString = `${c.NumberLiteral[0].image} ${c.TimeUnit[0].image}`;
        } else {
          // This is the case for a defined constant; its value was parsed out during validation
          timeString = TimeSpan.fromMilliseconds(duration);
        }
        if (S.commandState === null) {
          S.commandState = { timeMs: 0 };
          AutomatorData.logCommandEvent(`Pause started (waiting ${timeString})`, ctx.startLine);
        } else {
          S.commandState.timeMs += Math.max(Time.unscaledDeltaTime.milliseconds, AutomatorBackend.currentInterval);
        }
        const finishPause = S.commandState.timeMs >= duration;
        if (finishPause) {
          AutomatorData.logCommandEvent(`Pause finished (waited ${timeString})`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => {
      let blockArg;
      if (ctx.duration) {
        const c = ctx.duration[0].children;
        blockArg = `${c.NumberLiteral[0].image} ${c.TimeUnit[0].image}`;
      } else {
        blockArg = `${ctx.Identifier[0].image}`;
      }
      return {
        ...automatorBlocksMap.PAUSE,
        singleTextInput: blockArg
      };
    }
  },
  {
    id: "prestige",
    rule: $ => () => {
      $.CONSUME(T.PrestigeEvent);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.OPTION1(() => $.CONSUME(T.Respec));
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.PrestigeEvent[0].startLine;

      if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Eternity &&
        !EternityMilestone.autobuyerEternity.isReached) {
        V.addError(ctx.PrestigeEvent, "Eternity autobuyer is not unlocked",
          `Reach ${quantifyInt("Eternity", EternityMilestone.autobuyerEternity.config.eternities)}
          to use this command`);
        return false;
      }

      if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Reality && !RealityUpgrade(25).isBought) {
        V.addError(ctx.PrestigeEvent, "Reality autobuyer is not unlocked",
          "Purchase the Reality Upgrade which unlocks the Reality autobuyer");
        return false;
      }

      if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Infinity && ctx.Respec) {
        V.addError(ctx.Respec, "There's no 'respec' for infinity",
          "Remove 'respec' from the command");
      }
      return true;
    },
    compile: ctx => {
      const nowait = ctx.Nowait !== undefined;
      const respec = ctx.Respec !== undefined;
      const prestigeToken = ctx.PrestigeEvent[0].tokenType;
      return () => {
        const available = prestigeToken.$prestigeAvailable();
        if (!available) {
          if (!nowait) return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
          AutomatorData.logCommandEvent(`${ctx.PrestigeEvent.image} attempted, but skipped due to NOWAIT`,
            ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (respec) prestigeToken.$respec();
        prestigeToken.$prestige();
        const prestigeName = ctx.PrestigeEvent[0].image.toUpperCase();
        AutomatorData.logCommandEvent(`${prestigeName} triggered (${findLastPrestigeRecord(prestigeName)})`,
          ctx.startLine);
        // In the prestigeToken.$prestige() line above, performing a reality reset has code internal to the call
        // which makes the automator restart. However, in that case we also need to update the execution state here,
        // or else the restarted automator will immediately advance lines and always skip the first command
        return (prestigeName === "REALITY" && AutomatorBackend.state.forceRestart)
          ? AUTOMATOR_COMMAND_STATUS.RESTART
          : AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      ...automatorBlocksMap[
        ctx.PrestigeEvent[0].tokenType.name.toUpperCase()
      ],
      nowait: ctx.Nowait !== undefined,
      respec: ctx.Respec !== undefined
    })
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
    compile: ctx => () => {
      if (player.dilation.active) {
        AutomatorData.logCommandEvent(`Start Dilation encountered but ignored due to already being dilated`,
          ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      }
      if (startDilatedEternity(true)) {
        AutomatorData.logCommandEvent(`Dilation entered`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
      }
      return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
    },
    blockify: () => ({ singleSelectionInput: "DILATION", ...automatorBlocksMap.START })
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
        if (ec.isRunning) {
          AutomatorData.logCommandEvent(`Start EC encountered but ignored due to already being in the specified EC`,
            ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (!EternityChallenge(ecNumber).isUnlocked) {
          if (!TimeStudy.eternityChallenge(ecNumber).purchase(true)) {
            return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
          }
        }
        if (ec.start(true)) {
          AutomatorData.logCommandEvent(`Eternity Challenge ${ecNumber} started`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: "EC",
      singleTextInput: ctx.eternityChallenge[0].children.$ecNumber,
      ...automatorBlocksMap.START
    })
  },
  {
    id: "storeGameTime",
    rule: $ => () => {
      $.CONSUME(T.StoreGameTime);
      $.OR([
        { ALT: () => $.CONSUME(T.On) },
        { ALT: () => $.CONSUME(T.Off) },
        { ALT: () => $.CONSUME(T.Use) },
      ]);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.StoreGameTime[0].startLine;
      if (!Enslaved.isUnlocked) {
        V.addError(ctx.StoreGameTime[0], "You do not yet know how to store game time",
          "Unlock the ability to store game time");
        return false;
      }
      return true;
    },
    compile: ctx => {
      if (ctx.Use) return () => {
        if (Enslaved.isUnlocked) {
          Enslaved.useStoredTime(false);
          AutomatorData.logCommandEvent(`Stored game time used`, ctx.startLine);
        } else {
          AutomatorData.logCommandEvent(`Attempted to use stored game time, but failed (not unlocked yet)`,
            ctx.startLine);
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
      const on = Boolean(ctx.On);
      return () => {
        if (on !== player.celestials.enslaved.isStoring) Enslaved.toggleStoreBlackHole();
        AutomatorData.logCommandEvent(`Storing game time toggled ${ctx.On ? "ON" : "OFF"}`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      // eslint-disable-next-line no-nested-ternary
      singleSelectionInput: ctx.Use ? "USE" : (ctx.On ? "ON" : "OFF"),
      ...automatorBlocksMap["STORE GAME TIME"]
    })
  },
  {
    id: "studiesBuy",
    rule: $ => () => {
      $.CONSUME(T.Studies);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.CONSUME(T.Purchase);
      $.OR([
        { ALT: () => $.SUBRULE($.studyList) },
        { ALT: () => $.CONSUME1(T.Identifier) },
      ]);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.Studies[0].startLine;
      if (ctx.Identifier) {
        if (!V.isValidVarFormat(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.STUDIES)) {
          V.addError(ctx, `Constant ${ctx.Identifier[0].image} is not a valid Time Study constant`,
            `Ensure that ${ctx.Identifier[0].image} is a properly-formatted Time Study string`);
          return false;
        }
        const varInfo = V.lookupVar(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.STUDIES);
        ctx.$studies = varInfo.value;
        ctx.$studies.image = ctx.Identifier[0].image;
      } else if (ctx.studyList) {
        ctx.$studies = V.visit(ctx.studyList);
      }
      return true;
    },
    compile: ctx => {
      const studies = ctx.$studies;
      if (ctx.Nowait === undefined) return () => {
        let prePurchasedStudies = 0;
        let purchasedStudies = 0;
        let finalPurchasedTS;
        for (const tsNumber of studies.normal) {
          if (TimeStudy(tsNumber).isBought) prePurchasedStudies++;
          else if (TimeStudy(tsNumber).purchase(true)) purchasedStudies++;
          else finalPurchasedTS = finalPurchasedTS ?? tsNumber;
        }
        if (prePurchasedStudies + purchasedStudies < studies.normal.length) {
          if (prePurchasedStudies + purchasedStudies === 0) {
            AutomatorData.logCommandEvent(`Could not purchase any of the specified Time Studies`, ctx.startLine);
          }
          if (purchasedStudies > 0 && finalPurchasedTS) {
            AutomatorData.logCommandEvent(`Purchased ${quantifyInt("Time Study", purchasedStudies)} and stopped at
            Time Study ${finalPurchasedTS}, waiting to attempt to purchase more Time Studies`, ctx.startLine);
          }
          return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
        }
        const hasEC = studies.ec ? TimeStudy.eternityChallenge(studies.ec).isBought : false;
        if (!studies.ec || (hasEC && !studies.startEC)) {
          AutomatorData.logCommandEvent(`Purchased all specified Time Studies`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        const unlockedEC = TimeStudy.eternityChallenge(studies.ec).purchase(true);
        if (hasEC || unlockedEC) {
          if (studies.startEC) {
            EternityChallenge(studies.ec).start(true);
            if (EternityChallenge(studies.ec).isRunning) {
              AutomatorData.logCommandEvent(`Purchased all specified Time Studies, then unlocked and started running
                Eternity Challenge ${studies.ec}`, ctx.startLine);
            } else {
              AutomatorData.logCommandEvent(`Purchased all specified Time Studies and unlocked Eternity Challenge
                ${studies.ec}, but failed to start it`, ctx.startLine);
            }
          } else {
            AutomatorData.logCommandEvent(`Purchased all specified Time Studies and unlocked Eternity Challenge
              ${studies.ec}`, ctx.startLine);
          }
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
      return () => {
        for (const tsNumber of studies.normal) TimeStudy(tsNumber).purchase(true);
        if (!studies.ec || TimeStudy.eternityChallenge(studies.ec).isBought) {
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        TimeStudy.eternityChallenge(studies.ec).purchase(true);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleTextInput: ctx.$studies.image,
      nowait: ctx.Nowait !== undefined,
      ...automatorBlocksMap["STUDIES PURCHASE"]
    })
  },
  {
    id: "studiesLoad",
    rule: $ => () => {
      $.CONSUME(T.Studies);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.CONSUME(T.Load);
      $.OR([
        { ALT: () => $.CONSUME1(T.Id) },
        { ALT: () => $.CONSUME1(T.Name) },
      ]);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.Studies[0].startLine;

      if (ctx.Id) {
        const split = idSplitter.exec(ctx.Id[0].image);

        if (!split || ctx.Id[0].isInsertedInRecovery) {
          V.addError(ctx, "Missing preset id",
            "Provide the id of a saved study preset slot from the Time Studies page");
          return false;
        }

        const id = parseInt(split[1], 10);
        if (id < 1 || id > 6) {
          V.addError(ctx.Id[0], `Could not find a preset with an id of ${id}`,
            "Type in a valid id (1 - 6) for your study preset");
          return false;
        }
        ctx.$presetIndex = id;
        return true;
      }

      if (ctx.Name) {
        const split = presetSplitter.exec(ctx.Name[0].image);

        if (!split || ctx.Name[0].isInsertedInRecovery) {
          V.addError(ctx, "Missing preset name",
            "Provide the name of a saved study preset from the Time Studies page");
          return false;
        }

        // If it's a name, we check to make sure it exists:
        const presetIndex = player.timestudy.presets.findIndex(e => e.name === split[1]) + 1;
        if (presetIndex === 0) {
          V.addError(ctx.Name[0], `Could not find preset named ${split[1]} (Note: Names are case-sensitive)`,
            "Check to make sure you typed in the correct name for your study preset");
          return false;
        }
        ctx.$presetIndex = presetIndex;
        return true;
      }
      return false;
    },
    compile: ctx => {
      const presetIndex = ctx.$presetIndex;
      return () => {
        const imported = new TimeStudyTree(player.timestudy.presets[presetIndex - 1].studies);
        const beforeCount = GameCache.currentStudyTree.value.purchasedStudies.length;
        TimeStudyTree.commitToGameState(imported.purchasedStudies, true, imported.startEC);
        const afterCount = GameCache.currentStudyTree.value.purchasedStudies.length;
        // Check if there are still any unbought studies from the preset after attempting to commit it all;
        // if there are then we keep trying on this line until there aren't, unless we are given nowait
        const missingStudyCount = imported.purchasedStudies
          .filter(s => !GameCache.currentStudyTree.value.purchasedStudies.includes(s)).length;

        const presetRepresentation = ctx.Name ? ctx.Name[0].image : ctx.Id[0].image;

        if (missingStudyCount === 0) {
          AutomatorData.logCommandEvent(`Fully loaded study preset ${presetRepresentation}`, ctx.startLine);
        } else if (afterCount > beforeCount) {
          AutomatorData.logCommandEvent(`Partially loaded study preset ${presetRepresentation}
            (missing ${quantifyInt("study", missingStudyCount)})`, ctx.startLine);
        }
        return ctx.Nowait !== undefined || missingStudyCount === 0
          ? AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION
          : AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: ctx.Name ? "NAME" : "ID",
      singleTextInput: ctx.Name ? player.timestudy.presets[ctx.$presetIndex - 1].name : ctx.$presetIndex,
      nowait: ctx.Nowait !== undefined,
      ...automatorBlocksMap["STUDIES LOAD"]
    })
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
    compile: ctx => () => {
      player.respec = true;
      AutomatorData.logCommandEvent(`Turned study respec ON`, ctx.startLine);
      return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
    },
    blockify: () => automatorBlocksMap["STUDIES RESPEC"]
  },
  {
    id: "unlockDilation",
    rule: $ => () => {
      $.CONSUME(T.Unlock);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.CONSUME(T.Dilation);
    },
    validate: ctx => {
      ctx.startLine = ctx.Unlock[0].startLine;
      return true;
    },
    compile: ctx => {
      const nowait = ctx.Nowait !== undefined;
      return () => {
        if (PlayerProgress.dilationUnlocked()) {
          AutomatorData.logCommandEvent(`Skipped dilation unlock due to being already unlocked`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        const unlockedThisTick = TimeStudy.dilation.purchase(true);
        if (unlockedThisTick) {
          AutomatorData.logCommandEvent(`Unlocked Dilation`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (nowait) {
          AutomatorData.logCommandEvent(`Skipped dilation unlock due to lack of requirements (NOWAIT)`,
            ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: "DILATION",
      nowait: ctx.Nowait !== undefined,
      ...automatorBlocksMap.UNLOCK
    })
  },
  {
    id: "unlockEC",
    rule: $ => () => {
      $.CONSUME(T.Unlock);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.SUBRULE($.eternityChallenge);
    },
    validate: ctx => {
      ctx.startLine = ctx.Unlock[0].startLine;
      return true;
    },
    compile: ctx => {
      const nowait = ctx.Nowait !== undefined;
      const ecNumber = ctx.eternityChallenge[0].children.$ecNumber;
      return () => {
        if (EternityChallenge(ecNumber).isUnlocked) {
          AutomatorData.logCommandEvent(`Skipped EC ${ecNumber} unlock due to being already unlocked`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (nowait) {
          AutomatorData.logCommandEvent(`EC ${ecNumber} unlock failed and skipped (NOWAIT)`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        const purchased = TimeStudy.eternityChallenge(ecNumber).purchase(true);
        if (purchased) {
          AutomatorData.logCommandEvent(`EC ${ecNumber} unlocked`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: "EC",
      singleTextInput: ctx.eternityChallenge[0].children.$ecNumber,
      nowait: ctx.Nowait !== undefined,
      ...automatorBlocksMap.UNLOCK
    })
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
        return compileConditionLoop(() => !evalComparison(), commands, ctx, true);
      }
      const prestigeLevel = ctx.PrestigeEvent[0].tokenType.$prestigeLevel;
      let prestigeName;
      switch (ctx.PrestigeEvent[0].tokenType) {
        case T.Infinity:
          prestigeName = "Infinity";
          break;
        case T.Eternity:
          prestigeName = "Eternity";
          break;
        case T.Reality:
          prestigeName = "Reality";
          break;
        default:
          throw Error("Unrecognized prestige layer in until loop");
      }
      return {
        run: S => {
          if (S.commandState === null) {
            S.commandState = { prestigeLevel: 0 };
          }
          if (S.commandState.prestigeLevel >= prestigeLevel) {
            AutomatorData.logCommandEvent(`${prestigeName} prestige has occurred, exiting until loop`,
              ctx.startLine);
            return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          }
          AutomatorBackend.push(commands);
          AutomatorData.logCommandEvent(`${prestigeName} prestige has not occurred yet, moving to line
            ${AutomatorBackend.translateLineNumber(ctx.LCurly[0].startLine + 1)} (start of until loop)`,
          ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.SAME_INSTRUCTION;
        },
        blockCommands: commands
      };
    },
    blockify: (ctx, B) => {
      const commands = [];
      B.visit(ctx.block, commands);
      const comparison = B.visit(ctx.comparison);
      if (ctx.comparison) {
        return {
          nest: commands,
          ...automatorBlocksMap.UNTIL,
          ...comparison,
          genericInput1: standardizeAutomatorValues(comparison.genericInput1),
          genericInput2: standardizeAutomatorValues(comparison.genericInput2)
        };
      }
      return {
        genericInput1: ctx.PrestigeEvent[0].tokenType.name.toUpperCase(),
        nest: commands,
        ...automatorBlocksMap.UNTIL
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
    compile: (ctx, C) => () => {
      const evalComparison = C.visit(ctx.comparison);
      const doneWaiting = evalComparison();
      if (doneWaiting) {
        const timeWaited = TimeSpan.fromMilliseconds(Date.now() - AutomatorData.waitStart).toStringShort();
        if (AutomatorData.isWaiting) {
          AutomatorData.logCommandEvent(`Continuing after WAIT
            (${parseConditionalIntoText(ctx)} is true, after ${timeWaited})`, ctx.startLine);
        } else {
          AutomatorData.logCommandEvent(`WAIT skipped (${parseConditionalIntoText(ctx)} is already true)`,
            ctx.startLine);
        }
        AutomatorData.isWaiting = false;
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      }
      if (!AutomatorData.isWaiting) {
        AutomatorData.logCommandEvent(`Started WAIT for ${parseConditionalIntoText(ctx)}`, ctx.startLine);
        AutomatorData.waitStart = Date.now();
      }
      AutomatorData.isWaiting = true;
      return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
    },
    blockify: (ctx, B) => {
      const commands = [];
      B.visit(ctx.block, commands);
      const comparison = B.visit(ctx.comparison);
      return {
        nest: commands,
        ...automatorBlocksMap.WAIT,
        ...comparison,
        genericInput1: standardizeAutomatorValues(comparison.genericInput1),
        genericInput2: standardizeAutomatorValues(comparison.genericInput2)
      };
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
        const prestigeOccurred = S.commandState.prestigeLevel >= prestigeLevel;
        const prestigeName = ctx.PrestigeEvent[0].image.toUpperCase();
        if (prestigeOccurred) {
          const timeWaited = TimeSpan.fromMilliseconds(Date.now() - AutomatorData.waitStart).toStringShort();
          AutomatorData.logCommandEvent(`Continuing after WAIT (${prestigeName} occurred for
            ${findLastPrestigeRecord(prestigeName)}, after ${timeWaited})`, ctx.startLine);
          AutomatorData.isWaiting = false;
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (!AutomatorData.isWaiting) {
          AutomatorData.logCommandEvent(`Started WAIT for ${prestigeName}`, ctx.startLine);
          AutomatorData.waitStart = Date.now();
        }
        AutomatorData.isWaiting = true;
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      genericInput1: ctx.PrestigeEvent[0].tokenType.name.toUpperCase(),
      ...automatorBlocksMap.WAIT
    })
  },
  {
    id: "waitBlackHole",
    rule: $ => () => {
      $.CONSUME(T.Wait);
      $.CONSUME(T.BlackHole);
      $.OR([
        { ALT: () => $.CONSUME(T.Off) },
        { ALT: () => $.CONSUME(T.BlackHoleStr) },
      ]);
    },
    validate: ctx => {
      ctx.startLine = ctx.Wait[0].startLine;
      return true;
    },
    compile: ctx => () => {
      const off = Boolean(ctx.Off);
      // This input has the format "bh#"
      const holeID = ctx.BlackHoleStr ? Number(ctx.BlackHoleStr[0].image.charAt(2)) : 0;
      const bhCond = off ? !BlackHole(1).isActive : BlackHole(holeID).isActive;
      const bhStr = off ? "inactive Black Holes" : `active Black Hole ${holeID}`;
      if (bhCond) {
        const timeWaited = TimeSpan.fromMilliseconds(Date.now() - AutomatorData.waitStart).toStringShort();
        AutomatorData.logCommandEvent(`Continuing after WAIT (waited ${timeWaited} for ${bhStr})`,
          ctx.startLine);
        AutomatorData.isWaiting = false;
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      }
      if (!AutomatorData.isWaiting) {
        AutomatorData.logCommandEvent(`Started WAIT for ${bhStr}`, ctx.startLine);
        AutomatorData.waitStart = Date.now();
      }
      AutomatorData.isWaiting = true;
      return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
    },
    blockify: ctx => ({
      genericInput1: "BLACK HOLE",
      // Note: In this particular case we aren't actually storing a comparison operator. This is still okay
      // because internally this is just the variable for the second slot and has no special treatment beyond that
      compOperator: ctx.BlackHoleStr ? ctx.BlackHoleStr[0].image.toUpperCase() : "OFF",
      ...automatorBlocksMap.WAIT
    })
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
    compile: (ctx, C) => compileConditionLoop(C.visit(ctx.comparison), C.visit(ctx.block), ctx, false),
    blockify: (ctx, B) => {
      const commands = [];
      B.visit(ctx.block, commands);
      const comparison = B.visit(ctx.comparison);
      return {
        nest: commands,
        ...automatorBlocksMap.WHILE,
        ...comparison,
        genericInput1: standardizeAutomatorValues(comparison.genericInput1),
        genericInput2: standardizeAutomatorValues(comparison.genericInput2)
      };
    }
  },
  {
    id: "stop",
    rule: $ => () => {
      $.CONSUME(T.Stop);
    },
    validate: ctx => {
      ctx.startLine = ctx.Stop[0].startLine;
      return true;
    },
    compile: ctx => () => {
      AutomatorData.logCommandEvent(`Automator execution stopped with STOP command`, ctx.startLine);
      return AUTOMATOR_COMMAND_STATUS.HALT;
    },
    blockify: () => ({
      ...automatorBlocksMap.STOP,
    })
  }
];
