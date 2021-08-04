"use strict";

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

function AutomatorCommand(id) {
  return AutomatorCommandInterface.all[id];
}

const AUTOMATOR_COMMAND_STATUS = Object.freeze({
  NEXT_INSTRUCTION: 0,
  NEXT_TICK_SAME_INSTRUCTION: 1,
  NEXT_TICK_NEXT_INSTRUCTION: 2,
  // This is used to handle some special cases, like branches/loops:
  SAME_INSTRUCTION: 3,
});

const AUTOMATOR_MODE = Object.freeze({
  PAUSE: 1,
  RUN: 2,
  SINGLE_STEP: 3,
});


const AUTOMATOR_VAR_TYPES = {
  NUMBER: { id: 0, name: "number" },
  STUDIES: { id: 1, name: "studies" },
  DURATION: { id: 2, name: "duration" },
  UNKNOWN: { id: -1, name: "unknown" },
};

const AUTOMATOR_TYPE = Object.freeze({
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

class AutomatorScript {
  constructor(id) {
    if (!id) throw new Error("Invalid Automator script ID");
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
    this.persistent.content = content;
    this.compile();
  }

  compile() {
    this._compiled = AutomatorGrammar.compile(this.text).compiled;
  }

  static create(name) {
    let id = Object.keys(player.reality.automator.scripts).length;
    // On a fresh save, this executes before player is properly initialized
    if (!id) id = 1;
    player.reality.automator.scripts[id] = {
      id,
      name,
      content: "",
    };
    return new AutomatorScript(id);
  }
}

const AutomatorData = {
  currentErrorLine: -1,
  scriptIndex() {
    return player.reality.automator.state.editorScript;
  },
  currentScriptName() {
    return player.reality.automator.scripts[this.scriptIndex()].name;
  },
  currentScriptText() {
    return player.reality.automator.scripts[this.scriptIndex()].content;
  },
  createNewScript(newScript, name) {
    const newScriptID = Object.values(player.reality.automator.scripts).length;
    player.reality.automator.scripts[newScriptID] = {
      id: `${newScriptID}`,
      name,
      content: newScript
    };
    GameUI.notify.info(`Imported Script "${name}"`);
    EventHub.dispatch(GAME_EVENT.AUTOMATOR_SAVE_CHANGED);
  },
  currentErrors() {
    return AutomatorGrammar.compile(this.currentScriptText()).errors;
  }
};

const AutomatorBackend = {
  MAX_COMMANDS_PER_UPDATE: 100,
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

  get scriptName() {
    return this.findScript(this.state.topLevelScript).name;
  },

  get currentLineNumber() {
    if (this.stack.top === null)
      return -1;
    return this.stack.top.lineNumber;
  },

  get currentInterval() {
    return Math.clampMin(Math.pow(0.994, Currency.realities.value) * 500, 1);
  },

  update(diff) {
    if (!this.isOn) return;
    switch (this.mode) {
      case AUTOMATOR_MODE.PAUSE:
        return;
      case AUTOMATOR_MODE.SINGLE_STEP:
        this.singleStep();
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
    }
    throw new Error("Unrecognized return code from command");
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
    // I tried really hard to convert IDs from strings into numbers for some cleanup but I just kept getting constant
    // errors everywhere. It needs to be a number so that importing works properly without ID assignment being a mess,
    // but apparently some deeper things seem to break in a way I can't easily fix.
    return this._scripts.find(e => `${e.id}` === `${id}`);
  },

  _createDefaultScript() {
    const defaultScript = AutomatorScript.create("Untitled");
    this._scripts = [defaultScript];
    this.state.topLevelScript = defaultScript.id;
    return defaultScript.id;
  },

  initializeFromSave() {
    const scriptIds = Object.keys(player.reality.automator.scripts);
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
    const newScript = AutomatorScript.create("Untitled");
    this._scripts.push(newScript);
    return newScript;
  },

  deleteScript(id) {
    const idx = this._scripts.findIndex(e => e.id === id);
    this._scripts.splice(idx, 1);
    delete player.reality.automator.scripts[id];
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
    if (this.isRunning && this.state.followExecution) {
      AutomatorTextUI.editor.scrollIntoView({ line: AutomatorBackend.stack.top.lineNumber - 1, ch: 0 }, 16);
    }
  },

  reset(commands) {
    this.stack.clear();
    this.push(commands);
  },

  stop() {
    this.stack.clear();
    this.state.mode = AUTOMATOR_MODE.PAUSE;
  },

  pause() {
    this.state.mode = AUTOMATOR_MODE.PAUSE;
  },

  start(scriptID = this.state.topLevelScript, initialMode = AUTOMATOR_MODE.RUN, compile = true) {
    this.state.topLevelScript = scriptID;
    const scriptObject = this.findScript(scriptID);
    if (compile) scriptObject.compile();
    if (scriptObject.commands) {
      this.reset(scriptObject.commands);
      this.state.mode = initialMode;
    }
  },

  restart() {
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
