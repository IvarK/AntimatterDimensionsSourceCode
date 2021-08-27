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

  EventHub.logic.on(GAME_EVENT.BIG_CRUNCH_AFTER, () => prestigeNotify(T.Infinity.$prestigeLevel));
  EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_AFTER, () => prestigeNotify(T.Eternity.$prestigeLevel));
  EventHub.logic.on(GAME_EVENT.REALITY_RESET_AFTER, () => prestigeNotify(T.Reality.$prestigeLevel));

  // Used by while and until
  function compileConditionLoop(evalComparison, commands, ctx) {
    return {
      run: () => {
        if (!evalComparison()) {
          AutomatorData.logCommandEvent(`Checked ${parseConditionalIntoText(ctx)} (false), 
            exiting loop at line ${ctx.RCurly[0].startLine + 1} (end of loop)`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
        }
        AutomatorBackend.push(commands);
        AutomatorData.logCommandEvent(`Checked ${parseConditionalIntoText(ctx)} (true), 
          moving to line ${ctx.LCurly[0].startLine + 1} (start of loop)`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.SAME_INSTRUCTION;
      },
      blockCommands: commands,
    };
  }

  // Extracts the conditional out of a command and returns it as text
  function parseConditionalIntoText(ctx) {
    const comp = ctx.comparison[0].children;
    const getters = comp.compareValue.map(cv => (
      cv.children.AutomatorCurrency
        ? () => cv.children.AutomatorCurrency[0].image
        : () => format(cv.children.$value, 2, 2)
    ));
    const compareFn = comp.ComparisonOperator[0].image;
    return `${getters[0]()} ${compareFn} ${getters[1]()}`;
  }

  // Determines how much (prestige currency) the previous (layer) reset gave, for event logging
  function findLastPrestigeRecord(layer) {
    let addedECs, gainedEP;
    switch (layer) {
      case "INFINITY":
        return `${format(player.records.lastTenInfinities[0][1], 2)} IP`;
      case "ETERNITY":
        addedECs = AutomatorData.lastECCompletionCount;
        gainedEP = `${format(player.records.lastTenEternities[0][1], 2)} EP`;
        return addedECs === 0
          ? `${gainedEP}`
          : `${gainedEP}, ${addedECs} completions`;
      case "REALITY":
        return `${format(player.records.lastTenRealities[0][1], 2)} RM`;
      default:
        throw Error(`Unrecognized prestige ${layer} in Automator event log`);
    }
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
        if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Reality && (ctx.duration || ctx.xHighest)) {
          V.addError((ctx.duration || ctx.xHighest)[0],
            "Auto Reality cannot be set to a duration or x highest",
            "Use RM for Auto Reality");
          return false;
        }
        if (ctx.PrestigeEvent && ctx.currencyAmount) {
          const desired$ = ctx.PrestigeEvent[0].tokenType.$prestigeCurrency;
          const specified$ = ctx.currencyAmount[0].children.AutomatorCurrency[0].tokenType.name;
          if (desired$ !== specified$) {
            V.addError(ctx.currencyAmount, `AutomatorCurrency doesn't match prestige (${desired$} vs ${specified$})`,
              `Use ${desired$} for the specified prestige resource`);
            return false;
          }
        }

        if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Infinity &&
          (ctx.duration || ctx.xHighest) && !EternityMilestone.bigCrunchModes.isReached) {
          V.addError((ctx.duration || ctx.xHighest)[0],
            "Advanced Infinity autobuyer settings are not unlocked",
            `Reach ${EternityMilestone.bigCrunchModes.config.eternities} Eternities to use this command`);
          return false;
        }

        if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Eternity &&
          (ctx.duration || ctx.xHighest) && !RealityUpgrade(13).isBought) {
          V.addError((ctx.duration || ctx.xHighest)[0],
            "Advanced Eternity autobuyer settings are not unlocked",
            "Purchase the Reality Upgrade which unlocks advanced Eternity autobuyer settings");
          return false;
        }

        if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Eternity &&
          !EternityMilestone.autobuyerEternity.isReached) {
          V.addError(ctx.PrestigeEvent, "Eternity autobuyer is not unlocked",
            `Reach ${EternityMilestone.autobuyerEternity.config.eternities} Eternities to use this command`);
          return false;
        }

        if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Infinity && !NormalChallenge(12).isCompleted) {
          V.addError(ctx.PrestigeEvent, "Infinity autobuyer is not unlocked",
            "Complete the Big Crunch Autobuyer challenge to use this command");
          return false;
        }

        if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Reality && !RealityUpgrade(25).isBought) {
          V.addError(ctx.PrestigeEvent, "Reality autobuyer is not unlocked",
            "Purchase the Reality Upgrade which unlocks the Reality autobuyer");
          return false;
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
        const autobuyer = ctx.PrestigeEvent[0].tokenType.$autobuyer;
        return () => {
          autobuyer.isActive = on;
          let currSetting = "";
          if (duration !== undefined) {
            autobuyer.mode = durationMode;
            autobuyer.time = duration / 1000;
            // Can't do the units provided in the script because it's been parsed away like 4 layers up the call stack
            currSetting = `${autobuyer.time > 1000 ? formatInt(autobuyer.time) : format(autobuyer.time)} seconds`;
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
          ? `${ctx.currencyAmount[0].children.NumberLiteral[0].image}
            ${ctx.currencyAmount[0].children.AutomatorCurrency[0].image}`
          : undefined;
        const on = Boolean(ctx.On);
        let input = "";

        if (duration) input = duration;
        else if (xHighest) input = `${xHighest} x highest`;
        else if (fixedAmount) input = `${fixedAmount}`;
        else input = (on ? "ON" : "OFF");

        return {
          target: ctx.PrestigeEvent[0].tokenType.name.toUpperCase(),
          inputValue: input,
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
          V.addError(ctx.BlackHole[0], "Black Hole is not unlocked",
            "Unlock the Black Hole in order to pause or unpause it");
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
        target: ctx.On ? "ON" : "OFF",
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
      compile: () => () => AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION,
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
      compile: () => () => AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION,
      blockify: ctx => ({
        ...automatorBlocksMap.COMMENT,
        inputValue: ctx.Comment[0].image.replace(/(#|\/\/)\s?/u, ""),
      })
    },
    {
      id: "define",
      block: null,
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
          V.addError(ctx.Define, "Missing variable name",
            "Provide a variable name that isn't a command name between DEFINE and =");
          return false;
        }
        return true;
      },
      // Since define creates constants, they are all resolved at compile. The actual define instruction
      // doesn't have to do anything.
      compile: () => () => AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION,
      blockify: ctx => {
        const studyListData = ctx.studyList[0].children.studyListEntry;
        const studyList = [];
        for (const entry of studyListData) {
          if (entry.children.NumberLiteral) {
            // Single study ID or numerical value
            studyList.push(entry.children.NumberLiteral[0].image);
          } else if (entry.children.TriadStudy && Ra.pets.v.level >= 5) {
            // Triad study (this also should be prevented by the general "can't convert errored scripts" if locked)
            studyList.push(`T${entry.children.TriadStudy[0].image}`);
          } else {
            // Study range (eg. "41-71")
            const range = entry.children.studyRange[0].children;
            studyList.push(`${range.firstStudy[0].image}-${range.lastStudy[0].image}`);
          }
        }
        return {
          ...automatorBlocksMap.DEFINE,
          inputValue: `${ctx.Identifier[0].image} = ${studyList.join(",")}`,
        };
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
                skipping to line ${ctx.RCurly[0].startLine + 1}`, ctx.startLine);
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
          target: comparison.target.toUpperCase()
        };
      }
    },
    {
      id: "notify",
      rule: $ => () => {
        $.CONSUME(T.Notify);
        $.CONSUME(T.StringLiteral);
      },
      validate: ctx => {
        ctx.startLine = ctx.Notify[0].startLine;
        return true;
      },
      compile: ctx => {
        const notifyText = ctx.StringLiteral;
        return () => {
          GameUI.notify.info(`Automator: ${notifyText[0].image}`);
          AutomatorData.logCommandEvent(`NOTIFY call: ${notifyText[0].image}`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        };
      },
      blockify: ctx => ({
        ...automatorBlocksMap.NOTIFY,
        inputValue: ctx.StringLiteral[0].image,
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
          const dur = ctx.duration[0].children;
          const timeString = `${dur.NumberLiteral[0].image} ${dur.TimeUnit[0].image.replace("\\s", "")}`;
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
        const c = ctx.duration[0].children;
        return {
          ...automatorBlocksMap.PAUSE,
          inputValue: `${c.NumberLiteral[0].image} ${c.TimeUnit[0].image}`
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
            `Reach ${EternityMilestone.autobuyerEternity.config.eternities} Eternities to use this command`);
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
            AutomatorData.logCommandEvent(`Auto-${ctx.PrestigeEvent.image} attempted, but skipped due to NOWAIT`,
              ctx.startLine);
            return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          }
          if (respec) prestigeToken.$respec();
          prestigeToken.$prestige();
          const prestigeName = ctx.PrestigeEvent[0].image.toUpperCase();
          AutomatorData.logCommandEvent(`Auto-${prestigeName} triggered 
            (${findLastPrestigeRecord(prestigeName)})`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
        };
      },
      blockify: ctx => automatorBlocksMap[
        ctx.PrestigeEvent[0].tokenType.name.toUpperCase()
      ]
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
      blockify: () => ({ target: "DILATION", ...automatorBlocksMap.START })
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
        target: "EC",
        inputValue: ctx.eternityChallenge[0].children.$ecNumber,
        ...automatorBlocksMap.START
      })
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
          V.addError(ctx.StoreTime[0], "You do not yet know how to store time",
            "Unlock the ability to store time");
          return false;
        }
        return true;
      },
      compile: ctx => {
        if (ctx.Use) return () => {
          if (Enslaved.isUnlocked) {
            Enslaved.useStoredTime(false);
            AutomatorData.logCommandEvent(`Stored time used`, ctx.startLine);
          } else {
            AutomatorData.logCommandEvent(`Attempted to use stored time, but failed (not unlocked yet)`,
              ctx.startLine);
          }
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        };
        const on = Boolean(ctx.On);
        return () => {
          if (on !== player.celestials.enslaved.isStoring) Enslaved.toggleStoreBlackHole();
          AutomatorData.logCommandEvent(`Storing time toggled ${ctx.On ? "ON" : "OFF"}`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        };
      },
      blockify: ctx => ({
        // eslint-disable-next-line no-nested-ternary
        target: ctx.Use ? "USE" : (ctx.On ? "ON" : "OFF"),
        ...automatorBlocksMap["STORE TIME"]
      })
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
          const varInfo = V.lookupVar(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.STUDIES);
          if (!varInfo) return;
          ctx.$studies = varInfo.value;
        } else if (ctx.studyList) {
          ctx.$studies = V.visit(ctx.studyList);
        }
      },
      compile: ctx => {
        const studies = ctx.$studies;
        if (ctx.Nowait === undefined) return () => {
          let purchasedStudies = 0;
          for (const tsNumber of studies.normal) {
            if (TimeStudy(tsNumber).isBought) continue;
            if (!TimeStudy(tsNumber).purchase()) {
              if (tsNumber === 201 && DilationUpgrade.timeStudySplit.isBought) continue;
              if (purchasedStudies > 0) {
                AutomatorData.logCommandEvent(`Purchased ${purchasedStudies} time 
                  ${pluralize("study", purchasedStudies, "studies")} and stopped at study 
                  ${tsNumber}, waiting to attempt to purchase more studies`, ctx.startLine);
              }
              return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
            }
            purchasedStudies++;
          }
          if (!studies.ec || TimeStudy.eternityChallenge(studies.ec).isBought) {
            AutomatorData.logCommandEvent(`Purchased all specified time studies`, ctx.startLine);
            return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          }
          const unlockedEC = TimeStudy.eternityChallenge(studies.ec).purchase(true);
          if (unlockedEC) {
            AutomatorData.logCommandEvent(`Purchased all specified time studies and unlocked Eternity Challenge 
              ${studies.ec}`, ctx.startLine);
            return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          }
          return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
        };
        return () => {
          for (const tsNumber of studies.normal) TimeStudy(tsNumber).purchase();
          if (!studies.ec || TimeStudy.eternityChallenge(studies.ec).isBought) {
            return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          }
          TimeStudy.eternityChallenge(studies.ec).purchase(true);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        };
      },
      blockify: ctx => ({
        inputValue: ctx.$studies.image,
        ...automatorBlocksMap.STUDIES
      })
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
          V.addError(ctx, "Missing preset and preset name",
            `Provide the name of a saved study preset from the Time Studies page. Note this command will not work
              with presets with purely numerical names.`);
          return false;
        }
        const split = presetSplitter.exec(ctx.Preset[0].image);
        if (!split) {
          V.addError(ctx.Preset[0], "Missing preset name or number",
            "Provide the name or index (1-6) of a saved study preset from the Time Studies page");
          return false;
        }
        ctx.Preset[0].splitPresetResult = split;
        let presetIndex;
        if (split[2]) {
          // We don't need to do any verification if it's a number; if it's a name, we
          // check to make sure it exists:
          presetIndex = player.timestudy.presets.findIndex(e => e.name === split[2]) + 1;
          if (presetIndex === 0) {
            V.addError(ctx.Preset[0], `Could not find preset named ${split[2]} (Note: Names are case-sensitive)`,
              "Check to make sure you typed in the correct name for your study preset");
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
          importStudyTree(player.timestudy.presets[presetIndex - 1].studies, true);
          AutomatorData.logCommandEvent(`Loaded study ${ctx.Preset[0].image}`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        };
      },
      blockify: ctx => ({
        inputValue: ctx.$presetIndex,
        ...automatorBlocksMap.LOAD
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
      blockify: () => automatorBlocksMap.RESPEC
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
        return () => {
          const boughtTT = buyFunction();
          if (boughtTT) {
            AutomatorData.logCommandEvent(`${formatInt(boughtTT)} TT purchased with ${ctx.TTCurrency[0].image}`,
              ctx.startLine);
            return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          }
          AutomatorData.logCommandEvent(`Attempted to purchase TT with ${ctx.TTCurrency[0].image} 
            but could not afford any`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
        };
      },
      blockify: ctx => ({
        target: ctx.TTCurrency[0].tokenType.name.toUpperCase(),
        ...automatorBlocksMap.TT
      })
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
      blockify: () => ({
        target: "DILATION",
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
        target: "EC",
        inputValue: ctx.eternityChallenge[0].children.$ecNumber,
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
          return compileConditionLoop(() => !evalComparison(), commands, ctx);
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
            AutomatorData.logCommandEvent(`${prestigeName} prestige has not occurred yet,
              moving to line ${ctx.LCurly[0].startLine + 1} (start of until loop)`, ctx.startLine);
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
            target: comparison.target.toUpperCase()
          };
        }
        return {
          target: ctx.PrestigeEvent[0].tokenType.name.toUpperCase(),
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
          target: comparison.target.toUpperCase()
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
        target: ctx.PrestigeEvent[0].tokenType.name.toUpperCase(),
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
      compile: (ctx, C) => compileConditionLoop(C.visit(ctx.comparison), C.visit(ctx.block), ctx),
      blockify: (ctx, B) => {
        const commands = [];
        B.visit(ctx.block, commands);
        return {
          nest: commands,
          ...automatorBlocksMap.WHILE,
          ...B.visit(ctx.comparison)
        };
      }
    }
  ];
})());
