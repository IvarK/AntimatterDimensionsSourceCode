"use strict";

const ComparableGetters = {
  ip: () => player.infinityPoints,
  tt: () => player.timestudy.theorem,
  ep: () => player.eternityPoints,
  am: () => player.money,
  dt: () => player.dilation.dilatedTime,
  tp: () => player.dilation.tachyonParticles,
  rep: () => player.replicanti.amount,
  rg: () => new Decimal(Replicanti.galaxies.total),
};

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

/**
 * Object that manages script execution.
 * From the perspective of the backend, scripts are uninterrupted sequences of commands.
 * Top level named scripts are scripts -- but so are the bodies of loops and if statements.
 */
const AutomatorBackend = {
  MAX_COMMANDS_PER_UPDATE: 100,

  /**
   * If the automator is not paused, run stuff; called from gameLoop.
   */
  update() {
    // This should only come up for empty scripts
    if (!this.path.inBounds) {
      this.stop();
      return;
    }
    for (let count = 0; count < AutomatorBackend.MAX_COMMANDS_PER_UPDATE && this.isRunning; ++count) {
      const command = this.path.currentCommand;
      console.log(command);
      switch (AutomatorCommand(command.id).run(command)) {
        case AutomatorCommandStatus.SAME_INSTRUCTION:
          break;
        case AutomatorCommandStatus.NEXT_INSTRUCTION:
          this.nextCommand();
          break;
        case AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION:
          return;
        case AutomatorCommandStatus.NEXT_TICK_NEXT_INSTRUCTION:
          this.nextCommand();
          return;
      }
    }
  },

  variables: {
    get definedNumbers() {
      return AutomatorBackend.state.definedNumbers;
    },

    get definedStudies() {
      return AutomatorBackend.state.definedStudies;
    },

    clear() {
      AutomatorBackend.state.definedStudies = {};
      AutomatorBackend.state.definedNumbers = {};
    },

    defineNumber(name, arg) {
      const decimalArg = new Decimal(arg);
      if (isNaN(decimalArg.mantissa) || isNaN(decimalArg.exponent)) throw crash("Unexpected NaN");
      this.definedNumbers[name] = decimalArg;
    },

    defineStudies(name, arg) {
      this.definedStudies[name] = Array.from(arg);
    },

    resolveNumber(arg) {
      if (typeof arg === "number") return new Decimal(arg);
      if (arg instanceof Decimal) return arg;
      if (typeof arg !== "string") throw crash("Can't turn this into a number");
      const fromString = new Decimal(arg);
      // TODO: deal with this string - Decimal issue
      if (!isNaN(fromString.mantissa) && !isNaN(fromString.exponent)) return fromString;
      if (this.definedNumbers[arg] === undefined) throw crash(`Couldn't find variable name ${arg}`);
      return this.definedNumbers[arg];
    },

    resolveStudies(arg) {
      if (Array.isArray(arg)) return arg;
      if (typeof arg === "number") return [arg];
      if (this.definedStudies[arg] === undefined) throw crash(`Couldn't find studies name ${arg}`);
      return this.definedStudies[arg];
    },
  },

  /**
   * The path is the location of the current instruction inside some script. It includes the
   * name of the script, the current instruction index, and any intermediate indices
   * of nested blocks
   */
  path: {
    /**
     * This is a reference to an object containing automator instructions to run. This can't be serialized
     * into player directly
     * @private
     */
    _currentScriptObject: undefined,
    get copy() {
      return {
        name: this.value.name,
        nestedIndices: Array.from(this.value.nestedIndices),
        commandIndex: this.value.commandIndex,
      };
    },

    get scriptName() {
      return this.value.name;
    },

    get commandIndex() {
      return this.value.commandIndex;
    },

    get currentScriptObject() {
      return this._currentScriptObject;
    },

    get value() {
      return AutomatorBackend.state.path;
    },

    get currentCommand() {
      return this._currentScriptObject[this.commandIndex];
    },

    /**
     * @returns {boolean} Whether the current command index points inside a script or not
     */
    get inBounds() {
      return this.commandIndex < this.currentScriptObject.length;
    },

    set(path) {
      Object.assign(this.value, path);
      this._currentScriptObject = this.findScriptObject();
      AutomatorBackend.state.commandState = null;
    },

    /**
     * Advance to the next instruction. May go out of bounds.
     */
    next() {
      ++this.value.commandIndex;
      AutomatorBackend.state.commandState = null;
    },

    init() {
      this._currentScriptObject = this.findScriptObject();
    },

    reset(script) {
      this.value.name = script;
      this.value.nestedIndices.length = 0;
      this._currentScriptObject = AutomatorBackend.scripts[script];
      this.value.commandIndex = 0;
      AutomatorBackend.state.commandState = null;
    },

    enterNested() {
      this._currentScriptObject = this._currentScriptObject[this.commandIndex].body;
      this.value.nestedIndices.push(this.commandIndex);
      this.value.commandIndex = 0;
      AutomatorBackend.state.commandState = null;
    },

    /**
     * Find a script object inside player based on the specified location. If none is specified,
     * the current path is used.
     * @param {object} [spec] how to find the script:
     * @param {string} spec.name name of the top level script to look in
     * @param {number[]} spec.nestedIndices If the script is the body of a block, this specifies how to find it
     */
    findScriptObject(spec) {
      // eslint-disable-next-line no-param-reassign
      if (spec === undefined) spec = this.value;
      let script = AutomatorBackend.scripts[spec.name];
      if (script === undefined) return undefined;
      for (const idx of spec.nestedIndices) {
        if (idx < 0 || idx >= script.length) return undefined;
        script = script[idx].body;
        if (!script) return undefined;
      }
      return script;
    },

    pathToString(path) {
      return `name=${path.name} indices=${path.nestedIndices} commandIndex=${path.commandIndex}`;
    }
  },

  /**
   * The stack manages execution context, so we can enter and exit subroutines and loops.
   * The stack is an array of path specifiers
   */
  stack: {
    get value() {
      return AutomatorBackend.state.stack;
    },

    get length() {
      return this.value.length;
    },

    pushCurrent() {
      this.value.push(AutomatorBackend.path.copy);
    },
  
    pushNext() {
      const pathCopy = AutomatorBackend.path.copy;
      ++pathCopy.commandIndex;
      this.value.push(pathCopy);
    },

    pop() {
      return this.value.pop();
    },

    clear() {
      this.value.length = 0;
    },
  },

  /**
   * Initialize runtime values (ones that aren't stored in player); needs to be called on load.
   */
  init() {
    this.path.init();
  },

  /**
   * Clears any current state; does not affect pausing (so if we are paused,
   * we will remain paused)
   */
  reset() {
    this.variables.clear();
    this.path.reset(this.state.topLevelScript);
    this.stack.clear();
  },

  /**
   * Starts the automator if it's not started; begins execution at the top of
   * the current top level script
   */
  restart() {
    this.reset();
    this.state.paused = false;
  },

  /**
   * Stopping the automator clears any existing state; as if it were paused just
   * before the beginning of the top level script
   */
  stop() {
    this.reset();
    this.state.paused = true;
  },

  checkEndOfScript() {
    if (!this.path.inBounds) {
      if (this.stack.length > 0) {
        this.path.set(this.stack.pop());
        this.checkEndOfScript();
      } else {
        this.stop();
      }
    }
  },

  nextCommand() {
    this.path.next();
    this.checkEndOfScript();
  },

  get state() {
    return player.reality.automator.state;
  },

  get scripts() {
    return player.reality.automator.scripts;
  },

  /** Paused means that we have a current command, but are not actively running */
  get isPaused() {
    return this.state.paused;
  },

  get isRunning() {
    return !this.isPaused;
  },
};


AutomatorCommand.Comment = new class extends AutomatorCommandInterface {
  constructor() { super("rem"); }
  run() { return AutomatorCommandStatus.NEXT_INSTRUCTION; }
}();


AutomatorCommand.Debug = new class extends AutomatorCommandInterface {
  constructor() { super("debug"); }

  run(command) {
    // eslint-disable-next-line no-console
    console.log(`Automator debug message = ${command.message} state:
      path: ${AutomatorBackend.path.pathToString(AutomatorBackend.path.value)}
      stack contents:`);
    for (const path of AutomatorBackend.stack.value) {
      // eslint-disable-next-line no-console
      console.log(`    ${AutomatorBackend.path.pathToString(path)}`);
    }
    return AutomatorCommandStatus.NEXT_INSTRUCTION;
  }
}();

AutomatorCommand.DefineStudyTree = new class extends AutomatorCommandInterface {
  run(command) {
    AutomatorBackend.defineStudies(command.name, command.list);
    return AutomatorCommandStatus.NEXT_INSTRUCTION;
  }
}();

AutomatorCommand.DefineNumber = new class extends AutomatorCommandInterface {
  run(command) {
    AutomatorBackend.defineNumber(command.name, command.value);
    return AutomatorCommandStatus.NEXT_INSTRUCTION;
  }
}();

AutomatorCommand.WaitTime = new class extends AutomatorCommandInterface {
  constructor() {
    super("waitTime");
  }

  run(command) {
    const state = AutomatorBackend.state;
    if (state.commandState === null) {
      state.commandState = { timeMs: 0 };
    } else {
      state.commandState.timeMs += Time.unscaledDeltaTime.milliseconds;
    }
    return AutomatorBackend.variables.resolveNumber(command.timeMs).gte(state.commandState.timeMs)
      ? AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION
      : AutomatorCommandStatus.NEXT_INSTRUCTION;
  }
}();

AutomatorCommand.BuyStudies = new class extends AutomatorCommandInterface {
  run(command) {
    for (const tsId in AutomatorBackend.variables.resolveStudies(command.studies)) {
      const ts = TimeStudy(tsId);
      if (!ts) throw crash(`Unknown study ${tsId}`);
      ts.purchase();
      if (!ts.isBought && command.blocking) return AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
    }
    return AutomatorCommandStatus.NEXT_INSTRUCTION;
  }
}();

AutomatorCommand.WaitQuantity = new class extends AutomatorCommandInterface {
  run(command) {
    if (ComparableGetters[command.type] === undefined) throw crash(`Unknown comparable ${command.type}`);
    const quantity = ComparableGetters[command.type]();
    return quantity.lt(AutomatorBackend.variables.resolveNumber(command.amount))
      ? AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION
      : AutomatorCommandStatus.NEXT_INSTRUCTION;
  }
}();

AutomatorCommand.Until = new class extends AutomatorCommandInterface {
  constructor() {
    super("until");
  }

  run(command) {
    if (ComparableGetters[command.type] === undefined) throw crash(`Unknown comparable ${command.type}`);
    const quantity = ComparableGetters[command.type]();
    if (!quantity[command.compare](AutomatorBackend.variables.resolveNumber(command.amount))) {
      AutomatorBackend.stack.pushCurrent();
      AutomatorBackend.path.enterNested();
      return AutomatorCommandStatus.SAME_INSTRUCTION;
    }
    return AutomatorCommandStatus.NEXT_INSTRUCTION;
  }
}();

AutomatorCommand.If = new class extends AutomatorCommandInterface {
  run(command) {
    if (ComparableGetters[command.type] === undefined) throw crash(`Unknown comparable ${command.type}`);
    const quantity = ComparableGetters[command.type]();
    if (quantity[command.compare](AutomatorBackend.variables.resolveNumber(command.amount))) {
      // We "return" from the if at the next instruction after the if block
      AutomatorBackend.stack.pushNext();
      AutomatorBackend.path.enterNested();
      return AutomatorCommandStatus.SAME_INSTRUCTION;
    }
    return AutomatorCommandStatus.NEXT_INSTRUCTION;
  }
}();

AutomatorCommand.RunScript = new class extends AutomatorCommandInterface {
  run(command) {
    const script = AutomatorBackend.getScript(command.script);
    if (!script) throw crash(`Unknown script ${command.script}`);
    AutomatorBackend.stack.pushNext();
    AutomatorBackend.path.reset(command.script);
    return AutomatorCommandStatus.SAME_INSTRUCTION;
  }
}();

AutomatorCommand.StartEC = new class extends AutomatorCommandInterface {
  run(command) {
    const ec = EternityChallenge(command.ec);
    if (!ec) throw crash(`Unknown eternity challenge ${command.ec}`);
    if (!ec.isUnlocked) return AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
    if (ec.isRunning) return AutomatorCommandStatus.NEXT_INSTRUCTION;
    if (ec.start()) return AutomatorCommandStatus.NEXT_TICK_NEXT_INSTRUCTION;
    return AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
  }
}();

AutomatorCommand.WaitEvent = new class extends AutomatorCommandInterface {
  constructor() {
    super("waitEvent");
    this.eventRegistered = false;
  }

  get EventFlags() {
    return {
      BIG_CRUNCH: 1,
      ETERNITY: 2,
      REALITY: 3,
    };
  }

  registerEvent() {
    if (this.eventRegistered) return;
    this.eventRegistered = true;
    EventHub.logic.on(GameEvent.BIG_CRUNCH_AFTER, () => this.notify(this.EventFlags.BIG_CRUNCH));
    EventHub.logic.on(GameEvent.ETERNITY_RESET_AFTER, () => this.notify(this.EventFlags.ETERNITY));
    EventHub.logic.on(GameEvent.REALITY_RESET_AFTER, () => this.notify(this.EventFlags.REALITY));
  }

  notify(flag) {
    const state = AutomatorBackend.state.commandState;
    if (state !== undefined && state.eventFlag !== undefined) {
      state.eventFlag = Math.max(state.eventFlag, flag);
    }
  }

  run(command) {
    this.registerEvent();
    const state = AutomatorBackend.state;
    if (state.commandState === null) {
      state.commandState = { eventFlag: 0 };
      return AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
    }
    // Eternity counts as big crunch, reality counts as eternity -- hence the >=
    return state.commandState.eventFlag >= command.event
      ? AutomatorCommandStatus.NEXT_INSTRUCTION
      : AutomatorCommandStatus.NEXT_TICK_SAME_INSTRUCTION;
  }
}();
