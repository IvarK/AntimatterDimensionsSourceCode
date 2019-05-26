"use strict";

/** @abstract */
class AutomatorCommandInterface {
  constructor(id) {
    AutomatorCommandInterface.all[id] = this;
  }

  /** @abstract */
  // eslint-disable-next-line no-unused-vars
  run(command) { throw NotImplementedCrash(); }
}

AutomatorCommandInterface.all = [];

function AutomatorCommand(id) {
  return AutomatorCommandInterface.all[id];
}

const AutomatorCommandStatus = Object.freeze({
  NEXT_INSTRUCTION: 0,
  NEXT_TICK_SAME_INSTRUCTION: 1,
  NEXT_TICK_NEXT_INSTRUCTION: 2,
  // This is used to handle some special cases, like branches/loops:
  SAME_INSTRUCTION: 3,
});

const AutomatorMode = Object.freeze({
  STOP: 0,
  PAUSE: 1,
  RUN: 2,
  SINGLE_STEP: 3,
  RESTART: 4,
});


const AutomatorVarTypes = {
  NUMBER: { id: 0, name: "number" },
  STUDIES: { id: 1, name: "studies" },
  DURATION: { id: 2, name: "duration" },
  UNKNOWN: { id: -1, name: "unknown" },
};

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
    this.commands = commands;
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
    this.lineNumber = this.commands[value].lineNumber;
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
    return this.commands;
  }
}

class AutomatorScript {
  constructor(id) {
    if (!id) throw crash("Invalid script ID");
    this._id = id;
    this._compiled = AutomatorGrammar.compile(this.text).compiled;
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
    return this._compiled.compiled;
  }

  get text() {
    return this.persistent.content;
  }

  save(content) {
    this.persistent.content = content;
  }

  static create(name) {
    const id = ++player.reality.automator.lastID;
    player.reality.automator.scripts[id] = {
      id,
      name,
      content: "",
    };
    return new AutomatorScript(id);
  }
}

const AutomatorBackend = {
  MAX_COMMANDS_PER_UPDATE: 100,
  _scripts: [],

  get state() {
    return player.reality.automator.state;
  },

  /**
  * @returns {AutomatorMode}
  */
  get mode() {
    return this.state.mode;
  },

  /**
   * @param {AutomatorMode} value
   */
  set mode(value) {
    this.state.mode = value;
  },

  get isPaused() {
    return this.state.paused;
  },

  get isRunning() {
    return this.mode === AutomatorMode.RUN;
  },

  update() {
    if (this.stack.isEmpty) this.mode = AutomatorMode.STOP;
    switch (this.mode) {
      case AutomatorMode.STOP:
        this.restart();
        this.mode = AutomatorMode.PAUSE;
        return;
      case AutomatorMode.PAUSE:
        return;
      case AutomatorMode.SINGLE_STEP:
        this.step();
        this.mode = AutomatorMode.PAUSE;
        return;
      case AutomatorMode.RESTART:
        this.restart();
        this.mode = AutomatorMode.RUN;
        break;
      case AutomatorMode.RUN:
        break;
      default:
        this.mode = AutomatorMode.STOP;
        return;
    }
    for (let count = 0; count < AutomatorBackend.MAX_COMMANDS_PER_UPDATE && this.isRunning; ++count) {
      console.log(this.stack);
      if (!this.step()) break;
    }
  },

  step() {
    if (this.stack.isEmpty) return false;
    switch (this.runCurrentCommand()) {
      case AutomatorCommandStatus.SAME_INSTRUCTION:
        return true;
      case AutomatorCommandStatus.NEXT_INSTRUCTION:
        this.nextCommand();
        return true;
      case AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION:
        return false;
      case AutomatorCommandStatus.NEXT_TICK_NEXT_INSTRUCTION:
        this.nextCommand();
        return false;
    }
    throw crash("Unrecognized return code from command");
  },

  runCurrentCommand() {
    const S = this.stack.top;
    const cmdState = S.commands[S.commandIndex].run(S);
    console.log(`command returned ${cmdState}`);
    return cmdState;
  },

  nextCommand() {
    const S = this.stack.top;
    if (S.commandIndex >= S.commands.length - 1) {
      this.stack.pop();
      if (this.stack.isEmpty) this.stop();
    } else {
      S.commandState = null;
    }
  },

  push(commands) {
    // We do not allow empty scripts on the stack.
    if (commands.length === 0) return;
    this.stack.push(commands);
  },

  initializeFromSave() {
    const scriptIds = Object.keys(player.reality.automator.scripts);
    if (scriptIds.length === 0) {
      const defaultScript = AutomatorScript.create("Untitled");
      this._scripts = [defaultScript];
      scriptIds.push(defaultScript.id);
    } else {
      this._scripts = scriptIds.map(s => new AutomatorScript(s));
    }
    if (!scriptIds.includes(this.state.topLevelScript)) this.state.topLevelScript = scriptIds[0];
    const currentScript = this._scripts.find(e => e.id === this.state.topLevelScript);
    if (currentScript.compiled) {
      const commands = currentScript.compiled;
      if (!this.stack.initializeFromSave(commands)) this.reset(commands);
    }
  },

  reset(commands) {
    this.stack.clear();
    this.push(commands);
  },

  stop() {
    this.state.paused = true;
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
      if (_data.length === 0) return;
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
          console.log(`Line number ${playerEntry.lineNumber} not found`);
          // Could not match stack state to script, have to reset automato
          return false;
        }
        newEntry.commandIndex = foundIndex;
        this._data.push(newEntry);
        // Are we inside a code block?
        if (depth !== playerStack.length - 1) {
          if (currentCommands[foundIndex].blockCommands === undefined) {
            console.log(`No code block found at line ${playerEntry.lineNumber}`);
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
      if (this._data.length !== player.reality.automator.state.stack.length) throw crash("inconsistent stack length");
      return this._data.length;
    },
    get isEmpty() {
      return this._data.length === 0;
    }
  },

};
