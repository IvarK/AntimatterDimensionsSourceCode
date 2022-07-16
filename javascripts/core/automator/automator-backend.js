/** @abstract */
class AutomatorCommandInterface {
  constructor(id) {
    AutomatorCommandInterface.all[id] = this;
  }

  /** @abstract */
  // eslint-disable-next-line no-unused-vars
  run(command) { throw new NotImplementedError(); }
}

AutomatorCommandInterface.all = [];

export function AutomatorCommand(id) {
  return AutomatorCommandInterface.all[id];
}

export const AUTOMATOR_COMMAND_STATUS = Object.freeze({
  NEXT_INSTRUCTION: 0,
  NEXT_TICK_SAME_INSTRUCTION: 1,
  NEXT_TICK_NEXT_INSTRUCTION: 2,
  // This is used to handle some special cases, like branches/loops:
  SAME_INSTRUCTION: 3,
  SKIP_INSTRUCTION: 4,
});

export const AUTOMATOR_MODE = Object.freeze({
  PAUSE: 1,
  RUN: 2,
  SINGLE_STEP: 3,
});


export const AUTOMATOR_VAR_TYPES = {
  NUMBER: { id: 0, name: "number" },
  STUDIES: { id: 1, name: "studies" },
  DURATION: { id: 2, name: "duration" },
  UNKNOWN: { id: -1, name: "unknown" },
};

export const AUTOMATOR_TYPE = Object.freeze({
  TEXT: 0,
  BLOCK: 1
});

/**
 * This object represents a single entry on the execution stack. It's a combination
 * of transient and persistent values -- we don't store the compiled script or indices
 * in the player object, but they are part of the stack.
 */
class AutomatorStackEntry {
  constructor(stackIndex) {
    this._stackIndex = stackIndex;
    this._commandIndex = 0;
  }

  // This is used when a new thing is put on the stack (rather than us creating objects
  // when loading a game)
  initializeNew(commands) {
    this._commands = commands;
    this._commandIndex = 0;
    this.persistent = {
      lineNumber: commands[0].lineNumber,
      commandState: null,
    };
  }

  get commandIndex() {
    return this._commandIndex;
  }

  set commandIndex(value) {
    this._commandIndex = value;
    this.lineNumber = this._commands[value].lineNumber;
  }

  get lineNumber() {
    return this.persistent.lineNumber;
  }

  set lineNumber(value) {
    this.persistent.lineNumber = value;
  }

  /**
  * @returns {object|null} commandState used by commands to track their own data, such as remaining wait time
  */
  get commandState() {
    return this.persistent.commandState;
  }

  set commandState(value) {
    this.persistent.commandState = value;
  }

  get persistent() {
    return player.reality.automator.state.stack[this._stackIndex];
  }

  set persistent(value) {
    player.reality.automator.state.stack[this._stackIndex] = value;
  }

  get commands() {
    return this._commands;
  }

  set commands(value) {
    this._commands = value;
  }
}

export class AutomatorScript {
  constructor(id) {
    this._id = id;
    this.compile();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.persistent.name;
  }

  set name(value) {
    this.persistent.name = value;
  }

  get persistent() {
    return player.reality.automator.scripts[this._id];
  }

  get commands() {
    return this._compiled;
  }

  get text() {
    return this.persistent.content;
  }

  save(content) {
    if (AutomatorData.isWithinLimit()) this.persistent.content = content;
    this.compile();
  }

  compile() {
    this._compiled = AutomatorGrammar.compile(this.text).compiled;
  }

  static create(name, content = "") {
    const scripts = Object.keys(player.reality.automator.scripts);
    const missingIndex = scripts.findIndex((x, y) => y + 1 !== Number(x));
    let id = 1 + (missingIndex === -1 ? scripts.length : missingIndex);
    // On a fresh save, this executes before player is properly initialized
    if (!player.reality.automator.scripts || id === 0) id = 1;
    player.reality.automator.scripts[id] = {
      id,
      name,
      content,
    };
    return new AutomatorScript(id);
  }
}

export const AutomatorData = {
  // Used for getting the correct EC count in event log
  lastECCompletionCount: 0,
  // Used as a flag to make sure that wait commands only add one entry to the log instead of every execution attempt
  isWaiting: false,
  waitStart: 0,
  lastEvent: 0,
  eventLog: [],
  isEditorFullscreen: false,
  needsRecompile: true,
  cachedErrors: 0,
  // This is to hold finished script templates as text in order to make the custom blocks for blockmato
  blockTemplates: [],

  MAX_ALLOWED_SCRIPT_CHARACTERS: 10000,
  MAX_ALLOWED_TOTAL_CHARACTERS: 60000,

  scriptIndex() {
    return player.reality.automator.state.editorScript;
  },
  currentScriptName() {
    return player.reality.automator.scripts[this.scriptIndex()].name;
  },
  currentScriptText(index) {
    const toCheck = index || this.scriptIndex();
    return player.reality.automator.scripts[toCheck].content;
  },
  createNewScript(content, name) {
    const newScript = AutomatorScript.create(name, content);
    GameUI.notify.info(`Imported Script "${name}"`);
    player.reality.automator.state.editorScript = newScript.id;
    EventHub.dispatch(GAME_EVENT.AUTOMATOR_SAVE_CHANGED);
  },
  recalculateErrors() {
    const toCheck = this.currentScriptText();
    this.cachedErrors = AutomatorGrammar.compile(toCheck).errors;
    this.cachedErrors.sort((a, b) => a.startLine - b.startLine);
  },
  currentErrors() {
    if (this.needsRecompile) {
      this.recalculateErrors();
      this.needsRecompile = false;
    }
    return this.cachedErrors;
  },
  logCommandEvent(message, line) {
    const currTime = Date.now();
    this.eventLog.push({
      // Messages often overflow the 120 col limit and extra spacing gets included in the message - remove it
      message: message.replaceAll(/\s?\n\s+/gu, " "),
      line: AutomatorBackend.translateLineNumber(line),
      thisReality: Time.thisRealityRealTime.totalSeconds,
      timestamp: currTime,
      timegap: currTime - this.lastEvent
    });
    this.lastEvent = currTime;
    // Remove the oldest entry if the log is too large
    if (this.eventLog.length > player.options.automatorEvents.maxEntries) this.eventLog.shift();
  },
  clearEventLog() {
    this.eventLog = [];
    this.lastEvent = 0;
  },
  // We need to get the current character count from the editor itself instead of the player object, because otherwise
  // any changes made after getting above either limit will never be saved. Note that if the player is on the automator
  // subtab before the automator is unlocked, editor is undefined
  singleScriptCharacters() {
    return player.reality.automator.type === AUTOMATOR_TYPE.TEXT
      ? AutomatorTextUI.editor?.getDoc().getValue().length ?? 0
      : BlockAutomator.parseLines(BlockAutomator.lines).join("\n").length;
  },
  totalScriptCharacters() {
    return Object.values(player.reality.automator.scripts)
      .filter(s => s.id !== this.scriptIndex())
      .map(s => s.content.length)
      .reduce((sum, len) => sum + len, 0) +
      this.singleScriptCharacters();
  },
  isWithinLimit() {
    return this.singleScriptCharacters() <= this.MAX_ALLOWED_SCRIPT_CHARACTERS &&
      this.totalScriptCharacters() <= this.MAX_ALLOWED_TOTAL_CHARACTERS;
  },
};

export const LineEnum = { Active: "active", Event: "event", Error: "error" };

// Manages line highlighting in a way which is agnostic to the current editor mode (line or block). Ironically this is
// actually easier to manage in block mode as the Vue components render each line individually and we can just
// conditionally add classes in the template. The highlighting in text mode needs to be spliced and removed inline
// within the CodeMirror editor
export const AutomatorHighlighter = {
  lines: {
    active: -1,
    event: -1,
    error: -1,
  },

  updateHighlightedLine(line, key) {
    if (player.reality.automator.type === AUTOMATOR_TYPE.TEXT && line !== -1) {
      if (!AutomatorTextUI.editor) return;
      this.removeHighlightedTextLine(key);
      this.addHighlightedTextLine(line, key);
    } else {
      this.lines[key] = line;
    }
  },

  // We need to specifically remove the highlighting class from the old line before splicing it in for the new line
  removeHighlightedTextLine(key) {
    const removedLine = this.lines[key] - 1;
    AutomatorTextUI.editor.removeLineClass(removedLine, "background", `c-automator-editor__${key}-line`);
    AutomatorTextUI.editor.removeLineClass(removedLine, "gutter", `c-automator-editor__${key}-line-gutter`);
    this.lines[key] = -1;
  },
  addHighlightedTextLine(line, key) {
    AutomatorTextUI.editor.addLineClass(line - 1, "background", `c-automator-editor__${key}-line`);
    AutomatorTextUI.editor.addLineClass(line - 1, "gutter", `c-automator-editor__${key}-line-gutter`);
    this.lines[key] = line;
  },

  clearAllHighlightedLines() {
    if (player.reality.automator.type === AUTOMATOR_TYPE.TEXT && AutomatorTextUI.editor) {
      for (const lineType of Object.values(LineEnum)) {
        for (let line = 0; line < AutomatorTextUI.editor.doc.size; line++) {
          AutomatorTextUI.editor.removeLineClass(line, "background", `c-automator-editor__${lineType}-line`);
          AutomatorTextUI.editor.removeLineClass(line, "gutter", `c-automator-editor__${lineType}-line-gutter`);
        }
        this.lines[lineType] = -1;
      }
    }
  }
};

// Manages line highlighting in a way which is agnostic to the current editor mode (line or block)
export const AutomatorScroller = {
  // Block editor counts lines differently due to modified loop structure; this method handles that internally
  scrollToRawLine(line) {
    const targetLine = player.reality.automator.type === AUTOMATOR_TYPE.TEXT
      ? line
      : AutomatorBackend.translateLineNumber(line);
    this.scrollToLine(targetLine);
  },

  scrollToLine(line) {
    if (player.reality.automator.type === AUTOMATOR_TYPE.TEXT) {
      if (AutomatorTextUI.editor) AutomatorTextUI.editor.scrollIntoView({ line: line - 1, ch: 0 });
    } else {
      BlockAutomator.editor.scrollTo(0, 34.5 * (line - 1));
      BlockAutomator.gutter.style.bottom = `${BlockAutomator.editor.scrollTop}px`;
    }
  }
};

export const AutomatorBackend = {
  MAX_COMMANDS_PER_UPDATE: 100,
  hasJustCompleted: false,
  _scripts: [],

  get state() {
    return player.reality.automator.state;
  },

  // The Automator may be paused at some instruction, but still be on.
  get isOn() {
    return !this.stack.isEmpty;
  },

  /**
  * @returns {AUTOMATOR_MODE}
  */
  get mode() {
    return this.state.mode;
  },

  set mode(value) {
    this.state.mode = value;
  },

  get isRunning() {
    return this.isOn && this.mode === AUTOMATOR_MODE.RUN;
  },

  findRawScriptObject(id) {
    const auto = player.reality.automator;
    const index = Object.values(auto.scripts).findIndex(s => s.id === id);
    return auto.scripts[parseInt(Object.keys(auto.scripts)[index], 10)];
  },

  get currentRunningScript() {
    return this.findRawScriptObject(this.state.topLevelScript);
  },

  get currentEditingScript() {
    return this.findRawScriptObject(player.reality.automator.state.editorScript);
  },

  get scriptName() {
    return this.currentRunningScript?.name ?? "";
  },

  hasDuplicateName(name) {
    const nameArray = Object.values(player.reality.automator.scripts).map(s => s.name);
    return nameArray.filter(n => n === name).length > 1;
  },

  // Scripts are internally stored and run as text, but block mode has a different layout for loops that
  // shifts a lot of commands around. Therefore we need to conditionally change it based on mode in order
  // to make sure the player is presented with the correct line number
  translateLineNumber(num) {
    if (player.reality.automator.type === AUTOMATOR_TYPE.TEXT) return num;
    return BlockAutomator.lineNumber(num);
  },

  get currentLineNumber() {
    if (!this.stack.top) return -1;
    return this.translateLineNumber(this.stack.top.lineNumber);
  },

  get currentInterval() {
    return Math.clampMin(Math.pow(0.994, Currency.realities.value) * 500, 1);
  },

  get currentRawText() {
    return this.currentRunningScript?.content ?? "";
  },

  get currentScriptLength() {
    return this.currentRawText.split("\n").length;
  },

  update(diff) {
    if (!this.isOn) return;
    let stack;
    switch (this.mode) {
      case AUTOMATOR_MODE.PAUSE:
        return;
      case AUTOMATOR_MODE.SINGLE_STEP:
        this.singleStep();
        stack = AutomatorBackend.stack.top;
        // If single step completes the last line and repeat is off, the command stack will be empty and
        // scrolling will cause an error
        if (stack) AutomatorScroller.scrollToRawLine(stack.lineNumber);
        this.state.mode = AUTOMATOR_MODE.PAUSE;
        return;
      case AUTOMATOR_MODE.RUN:
        break;
      default:
        this.stop();
        return;
    }

    player.reality.automator.execTimer += diff;
    const commandsThisUpdate = Math.min(
      Math.floor(player.reality.automator.execTimer / this.currentInterval), this.MAX_COMMANDS_PER_UPDATE
    );
    player.reality.automator.execTimer -= commandsThisUpdate * this.currentInterval;

    for (let count = 0; count < commandsThisUpdate && this.isRunning; ++count) {
      if (!this.step()) break;
    }
  },

  step() {
    if (this.stack.isEmpty) return false;
    for (let steps = 0; steps < 100; steps++) {
      switch (this.runCurrentCommand()) {
        case AUTOMATOR_COMMAND_STATUS.SAME_INSTRUCTION:
          return true;
        case AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION:
          return this.nextCommand();
        case AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION:
          return false;
        case AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION:
          this.nextCommand();
          return false;
        case AUTOMATOR_COMMAND_STATUS.SKIP_INSTRUCTION:
          this.nextCommand();
      }
    }

    // This should in practice never happen by accident due to it requiring 100 consecutive commands that don't do
    // anything (looping a smaller group of no-ops will instead trigger the loop check every tick). Nevertheless,
    // better to not have an explicit infinite loop so that the game doesn't hang if the player decides to be funny
    // and input 3000 comments in a row
    GameUI.notify.error("Automator halted - too many consecutive no-ops detected");
    AutomatorData.logCommandEvent("Automator halted due to excessive no-op commands", this.currentLineNumber);
    this.stop();
    return false;
  },

  singleStep() {
    if (this.stack.isEmpty) return;
    // SAME_INSTRUCTION is used to enter blocks; this means we've successfully
    // advanced a line. Otherwise, we always advance a line, regardless of return
    // state.
    if (this.runCurrentCommand() !== AUTOMATOR_COMMAND_STATUS.SAME_INSTRUCTION) {
      this.nextCommand();
    }
  },

  runCurrentCommand() {
    const S = this.stack.top;
    const cmdState = S.commands[S.commandIndex].run(S);
    return cmdState;
  },

  nextCommand() {
    const S = this.stack.top;
    if (S.commandIndex >= S.commands.length - 1) {
      this.stack.pop();
      if (this.stack.isEmpty) {
        // With the debug output on, running short scripts gets very spammy, working around that
        // return false here makes sure that a single instruction script executes one tick at a time
        if (this.state.repeat) {
          this.start(this.state.topLevelScript, AUTOMATOR_MODE.RUN, false);
          return false;
        }
        this.stop();
      } else if (this.stack.top.commandState && this.stack.top.commandState.advanceOnPop) {
        AutomatorData.logCommandEvent(`Exiting IF block`, this.stack.top.commandState.ifEndLine);
        return this.nextCommand();
      }
    } else {
      S.commandState = null;
      ++S.commandIndex;
    }
    return true;
  },

  push(commands) {
    // We do not allow empty scripts on the stack.
    if (commands.length === 0) return;
    this.stack.push(commands);
  },

  findScript(id) {
    return this._scripts.find(e => e.id === id);
  },

  _createDefaultScript() {
    const defaultScript = AutomatorScript.create("New Script");
    this._scripts = [defaultScript];
    this.state.topLevelScript = defaultScript.id;
    return defaultScript.id;
  },

  initializeFromSave() {
    const scriptIds = Object.keys(player.reality.automator.scripts).map(id => parseInt(id, 10));
    if (scriptIds.length === 0) {
      scriptIds.push(this._createDefaultScript());
    } else {
      this._scripts = scriptIds.map(s => new AutomatorScript(s));
    }
    if (!scriptIds.includes(this.state.topLevelScript)) this.state.topLevelScript = scriptIds[0];
    const currentScript = this.findScript(this.state.topLevelScript);
    if (currentScript.commands) {
      const commands = currentScript.commands;
      if (!this.stack.initializeFromSave(commands)) this.reset(commands);
    } else {
      this.stack.clear();
    }
  },

  saveScript(id, data) {
    this.findScript(id).save(data);
    if (id === this.state.topLevelScript) this.stop();
  },

  newScript() {
    const newScript = AutomatorScript.create("New Script");
    this._scripts.push(newScript);
    return newScript;
  },

  // Note that deleting scripts leaves gaps in the automator script indexing since automator scripts can't be
  // dynamically re-indexed while the automator is running without causing a stutter from recompiling scripts.
  deleteScript(id) {
    // We need to delete scripts from two places - in the savefile and compiled AutomatorScript Objects
    const saveId = Object.values(player.reality.automator.scripts).findIndex(s => s.id === id);
    delete player.reality.automator.scripts[parseInt(Object.keys(player.reality.automator.scripts)[saveId], 10)];
    const idx = this._scripts.findIndex(e => e.id === id);
    this._scripts.splice(idx, 1);
    if (this._scripts.length === 0) {
      this._createDefaultScript();
    }
    if (id === this.state.topLevelScript) {
      this.stop();
      this.state.topLevelScript = this._scripts[0].id;
    }
  },

  toggleRepeat() {
    this.state.repeat = !this.state.repeat;
  },

  toggleForceRestart() {
    this.state.forceRestart = !this.state.forceRestart;
  },

  toggleFollowExecution() {
    this.state.followExecution = !this.state.followExecution;
    this.jumpToActiveLine();
  },

  jumpToActiveLine() {
    const state = this.state;
    const focusedScript = state.topLevelScript === state.editorScript;
    if (focusedScript && this.isRunning && state.followExecution) {
      AutomatorScroller.scrollToRawLine(AutomatorBackend.stack.top.lineNumber);
    }
  },

  reset(commands) {
    this.stack.clear();
    this.push(commands);
  },

  stop() {
    this.stack.clear();
    this.state.mode = AUTOMATOR_MODE.PAUSE;
    this.hasJustCompleted = true;
  },

  pause() {
    this.state.mode = AUTOMATOR_MODE.PAUSE;
  },

  start(scriptID = this.state.topLevelScript, initialMode = AUTOMATOR_MODE.RUN, compile = true) {
    this.hasJustCompleted = false;
    this.state.topLevelScript = scriptID;
    const scriptObject = this.findScript(scriptID);
    if (compile) scriptObject.compile();
    if (scriptObject.commands) {
      this.reset(scriptObject.commands);
      this.state.mode = initialMode;
    }
    AutomatorData.isWaiting = false;
    if (player.options.automatorEvents.clearOnRestart) AutomatorData.clearEventLog();
  },

  restart() {
    // Sometimes this leads to start getting called twice in quick succession but it's close enough
    // that there's usually no command in between (possibly same tick).
    this.start(this.state.topLevelScript, AUTOMATOR_MODE.RUN);
    if (this.stack.isEmpty) return;
    this.reset(this.stack._data[0].commands);
  },

  stack: {
    _data: [],
    push(commands) {
      const newEntry = new AutomatorStackEntry(this.length);
      newEntry.initializeNew(commands);
      this._data.push(newEntry);
    },
    pop() {
      if (this._data.length === 0) return;
      player.reality.automator.state.stack.pop();
      this._data.pop();
    },
    clear() {
      this._data = [];
      player.reality.automator.state.stack.length = 0;
    },
    initializeFromSave(commands) {
      this._data = [];
      const playerStack = player.reality.automator.state.stack;
      let currentCommands = commands;
      for (let depth = 0; depth < playerStack.length; ++depth) {
        const playerEntry = playerStack[depth];
        const newEntry = new AutomatorStackEntry(depth);
        newEntry.commands = currentCommands;
        const foundIndex = currentCommands.findIndex(e => e.lineNumber === playerEntry.lineNumber);
        if (foundIndex === -1) {
          // Could not match stack state to script, have to reset automato
          return false;
        }
        newEntry.commandIndex = foundIndex;
        this._data.push(newEntry);
        // Are we inside a code block?
        if (depth !== playerStack.length - 1) {
          if (currentCommands[foundIndex].blockCommands === undefined) {
            return false;
          }
          currentCommands = currentCommands[foundIndex].blockCommands;
        }
      }
      return true;
    },
    get top() {
      return this._data[this.length - 1];
    },
    get length() {
      if (this._data.length !== player.reality.automator.state.stack.length) {
        throw new Error("Inconsistent stack length");
      }
      return this._data.length;
    },
    get isEmpty() {
      return this._data.length === 0;
    }
  },
};
