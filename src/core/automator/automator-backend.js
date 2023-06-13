import { compile } from "./compiler";

export const AUTOMATOR_COMMAND_STATUS = Object.freeze({
  NEXT_INSTRUCTION: 0,
  NEXT_TICK_SAME_INSTRUCTION: 1,
  NEXT_TICK_NEXT_INSTRUCTION: 2,
  // This is used to handle some special cases, like branches/loops:
  SAME_INSTRUCTION: 3,
  SKIP_INSTRUCTION: 4,
  HALT: 5,
  RESTART: 6,
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
    this._compiled = compile(this.text).compiled;
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
  undoBuffer: [],
  redoBuffer: [],
  charsSinceLastUndoState: 0,

  MAX_ALLOWED_SCRIPT_CHARACTERS: 10000,
  MAX_ALLOWED_TOTAL_CHARACTERS: 60000,
  MAX_ALLOWED_SCRIPT_NAME_LENGTH: 15,
  MAX_ALLOWED_SCRIPT_COUNT: 20,
  MAX_ALLOWED_CONSTANT_NAME_LENGTH: 20,
  // Note that a study string with ALL studies in unshortened form without duplicated studies is ~230 characters
  MAX_ALLOWED_CONSTANT_VALUE_LENGTH: 250,
  MAX_ALLOWED_CONSTANT_COUNT: 30,
  MIN_CHARS_BETWEEN_UNDOS: 10,
  MAX_UNDO_ENTRIES: 30,

  scriptIndex() {
    return player.reality.automator.state.editorScript;
  },
  currentScriptName() {
    return player.reality.automator.scripts[this.scriptIndex()].name;
  },
  currentScriptText(index) {
    const toCheck = index || this.scriptIndex();
    return player.reality.automator.scripts[toCheck]?.content;
  },
  createNewScript(content, name) {
    const newScript = AutomatorScript.create(name, content);
    GameUI.notify.automator(`Imported Script "${name}"`);
    player.reality.automator.state.editorScript = newScript.id;
    AutomatorData.clearUndoData();
    EventHub.dispatch(GAME_EVENT.AUTOMATOR_SAVE_CHANGED);
  },
  recalculateErrors() {
    const toCheck = this.currentScriptText();
    this.cachedErrors = compile(toCheck).errors;
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

  // This must be called every time the current script or editor mode are changed
  clearUndoData() {
    this.undoBuffer = [];
    this.redoBuffer = [];
    this.charsSinceLastUndoState = 0;
  },
  // We only save an undo state every so often based on the number of characters that have been modified
  // since the last state. This gets passed in as a parameter and gets called every time any typing is done,
  // but only actually does something when that threshold is reached.
  pushUndoData(data, newChars) {
    // If the buffer is empty, then we need to immediately write to the buffer (ignoring character changes)
    // because otherwise edits can't be fully undone back to the very first change
    this.charsSinceLastUndoState += newChars;
    const pastGap = this.charsSinceLastUndoState <= this.MIN_CHARS_BETWEEN_UNDOS;
    if (pastGap && this.undoBuffer.length !== 0) return;

    if (this.undoBuffer[this.undoBuffer.length - 1] !== data) this.undoBuffer.push(data);
    if (this.undoBuffer.length > this.MAX_UNDO_ENTRIES) this.undoBuffer.shift();
    this.charsSinceLastUndoState = 0;
  },
  pushRedoData(data) {
    if (this.redoBuffer[this.redoBuffer.length - 1] !== data) this.redoBuffer.push(data);
  },
  // These following two methods pop the top entry off of the undo/redo stack and then push it
  // onto the *other* stack before modifying all the relevant UI elements and player props. These
  // could in principle be combined into one function to reduce boilerplace, but keeping them
  // separate is probably more readable externally
  undoScriptEdit() {
    if (this.undoBuffer.length === 0 || Tabs.current._currentSubtab.name !== "Automator") return;

    const undoContent = this.undoBuffer.pop();
    this.pushRedoData(this.currentScriptText());
    player.reality.automator.scripts[this.scriptIndex()].content = undoContent;

    AutomatorBackend.saveScript(this.scriptIndex(), undoContent);
    if (player.reality.automator.type === AUTOMATOR_TYPE.TEXT) AutomatorTextUI.editor.setValue(undoContent);
    else BlockAutomator.updateEditor(undoContent);
  },
  redoScriptEdit() {
    if (this.redoBuffer.length === 0 || Tabs.current._currentSubtab.name !== "Automator") return;

    const redoContent = this.redoBuffer.pop();
    // We call this with a value which is always higher than said threshold, forcing the current text to be pushed
    this.pushUndoData(this.currentScriptText(), 2 * this.MIN_CHARS_BETWEEN_UNDOS);
    player.reality.automator.scripts[this.scriptIndex()].content = redoContent;

    AutomatorBackend.saveScript(this.scriptIndex(), redoContent);
    if (player.reality.automator.type === AUTOMATOR_TYPE.TEXT) AutomatorTextUI.editor.setValue(redoContent);
    else BlockAutomator.updateEditor(redoContent);
  }
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
    for (const lineType of Object.values(LineEnum)) {
      if (player.reality.automator.type === AUTOMATOR_TYPE.TEXT && AutomatorTextUI.editor) {
        for (let line = 0; line < AutomatorTextUI.editor.doc.size; line++) {
          AutomatorTextUI.editor.removeLineClass(line, "background", `c-automator-editor__${lineType}-line`);
          AutomatorTextUI.editor.removeLineClass(line, "gutter", `c-automator-editor__${lineType}-line-gutter`);
        }
      }
      this.lines[lineType] = -1;
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
    let editor, textHeight, lineToScroll;
    if (player.reality.automator.type === AUTOMATOR_TYPE.TEXT) {
      // We can't use CodeMirror's scrollIntoView() method as that forces the entire viewport to keep the line in view.
      // This can potentially cause a softlock with "follow execution" enabled on sufficiently short screens.
      editor = document.querySelector(".CodeMirror-scroll");
      textHeight = AutomatorTextUI.editor.defaultTextHeight();
      lineToScroll = line + 1;
    } else {
      editor = BlockAutomator.editor;
      textHeight = 34.5;
      lineToScroll = line;
    }

    // In both cases we might potentially try to scroll before the editor has properly initialized (ie. the automator
    // itself ends up loading up faster than the editor UI element)
    if (!editor) return;

    const paddedHeight = editor.clientHeight - 40;
    const newScrollPos = textHeight * (lineToScroll - 1);
    if (newScrollPos > editor.scrollTop + paddedHeight) editor.scrollTo(0, newScrollPos - paddedHeight);
    if (newScrollPos < editor.scrollTop) editor.scrollTo(0, newScrollPos);
    if (player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) {
      BlockAutomator.gutter.style.bottom = `${editor.scrollTop}px`;
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
    const scripts = player.reality.automator.scripts;
    const index = Object.values(scripts).findIndex(s => s.id === id);
    return scripts[parseInt(Object.keys(scripts)[index], 10)];
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

  // Finds which study presets are referenced within the specified script
  getUsedPresets(scriptID) {
    const script = this.findRawScriptObject(scriptID);
    if (!script) return null;

    const foundPresets = new Set();
    const lines = script.content.split("\n");
    for (const rawLine of lines) {
      const matchPresetID = rawLine.match(/studies( nowait)? load id ([1-6])/ui);
      if (matchPresetID) foundPresets.add(Number(matchPresetID[2]) - 1);
      const matchPresetName = rawLine.match(/studies( nowait)? load name (\S+)/ui);
      if (matchPresetName) {
        // A script might pass the regex match, but actually be referencing a preset which doesn't exist by name
        const presetID = player.timestudy.presets.findIndex(p => p.name === matchPresetName[2]);
        if (presetID !== -1) foundPresets.add(presetID);
      }
    }
    const presets = Array.from(foundPresets);
    presets.sort();
    return presets;
  },

  // Finds which constants are referenced within the specified script
  getUsedConstants(scriptID) {
    const script = this.findRawScriptObject(scriptID);
    if (!script) return null;

    const foundConstants = new Set();
    const lines = script.content.split("\n");
    for (const rawLine of lines) {
      const availableConstants = Object.keys(player.reality.automator.constants);
      // Needs a space-padded regex match so that (for example) a constant "unl" doesn't match to an unlock command
      // Additionally we need a negative lookbehind in order to ignore matches with presets which have the same name
      for (const key of availableConstants) {
        if (rawLine.match(`(?<![Nn][Aa][Mm][Ee])\\s${key}(\\s|$)`)) foundConstants.add(key);
      }
    }
    const constants = Array.from(foundConstants);
    constants.sort();
    return constants;
  },

  // All modifications to constants should go these four methods in order to properly update both the constant prop and
  // the sorting order prop while keeping them consistent with each other
  addConstant(constantName, value) {
    if (Object.keys(player.reality.automator.constants).length >= AutomatorData.MAX_ALLOWED_CONSTANT_COUNT) return;
    player.reality.automator.constants[constantName] = value;
    player.reality.automator.constantSortOrder.push(constantName);
    EventHub.dispatch(GAME_EVENT.AUTOMATOR_CONSTANT_CHANGED);
  },
  modifyConstant(constantName, newValue) {
    if (Object.keys(player.reality.automator.constants).includes(constantName)) {
      player.reality.automator.constants[constantName] = newValue;
      EventHub.dispatch(GAME_EVENT.AUTOMATOR_CONSTANT_CHANGED);
    } else {
      this.addConstant(constantName, newValue);
    }
  },
  renameConstant(oldName, newName) {
    const data = player.reality.automator.constants[oldName];
    player.reality.automator.constants[newName] = data;
    delete player.reality.automator.constants[oldName];

    const index = player.reality.automator.constantSortOrder.indexOf(oldName);
    if (index !== -1) player.reality.automator.constantSortOrder[index] = newName;
    EventHub.dispatch(GAME_EVENT.AUTOMATOR_CONSTANT_CHANGED);
  },
  deleteConstant(constantName) {
    delete player.reality.automator.constants[constantName];
    const index = player.reality.automator.constantSortOrder.indexOf(constantName);
    if (index > -1) player.reality.automator.constantSortOrder.splice(index, 1);
    EventHub.dispatch(GAME_EVENT.AUTOMATOR_CONSTANT_CHANGED);
  },

  // We can't just concatenate different parts of script data together or use some kind of delimiting character string
  // due to the fact that comments can essentially contain character sequences with nearly arbitrary content and
  // length. Instead, we take the approach of concatenating all data together with their lengths prepended at the start
  // of each respective data string. For example:
  //    ["blob", "11,21,31"] => "00004blob0000811,21,31"
  // Note that the whole string can be unambiguously parsed from left-to-right regardless of the actual data contents.
  // All numerical values are assumed to be exactly 5 characters long for consistency and since the script length limit
  // is 5 digits long.
  serializeAutomatorData(dataArray) {
    const paddedNumber = num => `0000${num}`.slice(-5);
    const segments = [];
    for (const data of dataArray) {
      segments.push(`${paddedNumber(data.length)}${data}`);
    }
    return segments.join("");
  },

  // Inverse of the operation performed by serializeAutomatorData(). Can throw an error for malformed inputs, but this
  // will always be caught farther up the call chain and interpreted properly as an invalid dataString.
  deserializeAutomatorData(dataString) {
    if (dataString === "") throw new Error("Attempted deserialization of empty string");
    const dataArray = [];
    let remainingData = dataString;
    while (remainingData.length > 0) {
      const segmentLength = Number(remainingData.slice(0, 5));
      remainingData = remainingData.substr(5);
      if (Number.isNaN(segmentLength) || remainingData.length < segmentLength) {
        throw new Error("Inconsistent or malformed serialized automator data");
      } else {
        const segmentData = remainingData.slice(0, segmentLength);
        remainingData = remainingData.substr(segmentLength);
        dataArray.push(segmentData);
      }
    }
    return dataArray;
  },

  // This exports only the text contents of the currently-visible script
  exportCurrentScriptContents() {
    // Cut off leading and trailing whitespace
    const trimmed = AutomatorData.currentScriptText().replace(/^\s*(.*?)\s*$/u, "$1");
    if (trimmed.length === 0) return null;
    // Serialize the script name and content
    const name = AutomatorData.currentScriptName();
    return GameSaveSerializer.encodeText(this.serializeAutomatorData([name, trimmed]), "automator script");
  },

  // This parses script content from an encoded export string; does not actually import anything
  parseScriptContents(rawInput) {
    let decoded, parts;
    try {
      decoded = GameSaveSerializer.decodeText(rawInput, "automator script");
      parts = this.deserializeAutomatorData(decoded);
    } catch (e) {
      return null;
    }

    return {
      name: parts[0],
      content: parts[1],
    };
  },

  // Creates a new script from the supplied import string
  importScriptContents(rawInput) {
    const parsed = this.parseScriptContents(rawInput);
    AutomatorData.createNewScript(parsed.content, parsed.name);
    this.initializeFromSave();
  },

  // This exports the selected script along with any constants and study presets it uses or references
  exportFullScriptData(scriptID) {
    const script = this.findRawScriptObject(scriptID);
    const trimmed = script.content.replace(/^\s*(.*?)\s*$/u, "$1");
    if (trimmed.length === 0) return null;

    const foundPresets = new Set();
    const foundConstants = new Set();
    const lines = trimmed.split("\n");
    // We find just the keys first, the rest of the associated data is serialized later
    for (const rawLine of lines) {
      const matchPresetID = rawLine.match(/studies( nowait)? load id ([1-6])/ui);
      if (matchPresetID) foundPresets.add(Number(matchPresetID[2]) - 1);
      const matchPresetName = rawLine.match(/studies( nowait)? load name (\S+)/ui);
      if (matchPresetName) {
        // A script might pass the regex match, but actually be referencing a preset which doesn't exist by name
        const presetID = player.timestudy.presets.findIndex(p => p.name === matchPresetName[2]);
        if (presetID !== -1) foundPresets.add(presetID);
      }
      const availableConstants = Object.keys(player.reality.automator.constants);
      for (const key of availableConstants) if (rawLine.match(`\\s${key}(\\s|$)`)) foundConstants.add(key);
    }

    // Serialize presets
    const presets = [];
    for (const id of Array.from(foundPresets)) {
      const preset = player.timestudy.presets[id];
      presets.push(`${id}:${preset?.name ?? ""}:${preset?.studies ?? ""}`);
    }

    // Serialize constants
    const constants = [];
    for (const name of Array.from(foundConstants)) {
      constants.push(`${name}:${player.reality.automator.constants[name]}`);
    }

    // Serialize all the variables for the full data export
    const serialized = this.serializeAutomatorData([script.name, presets.join("*"), constants.join("*"), trimmed]);
    return GameSaveSerializer.encodeText(serialized, "automator data");
  },

  // This parses scripts which also have attached information in the form of associated constants and study presets.
  // Note that it doesn't actually import or assign the data to the save file at this point.
  parseFullScriptData(rawInput) {
    let decoded, parts;
    try {
      decoded = GameSaveSerializer.decodeText(rawInput, "automator data");
      parts = this.deserializeAutomatorData(decoded);
    } catch (e) {
      return null;
    }
    if (parts.length !== 4) return null;

    // Parse preset data (needs the conditional because otherwise it'll use the empty string to assign 0/undef/undef)
    const presetData = parts[1];
    const presets = [];
    if (presetData) {
      for (const preset of presetData.split("*")) {
        const props = preset.split(":");
        presets.push({
          id: Number(props[0]),
          name: props[1],
          studies: props[2],
        });
      }
    }
    presets.sort((a, b) => a.id - b.id);

    // Parse constant data
    const constantData = parts[2];
    const constants = [];
    for (const constant of constantData.split("*")) {
      if (constant === "") continue;
      const props = constant.split(":");
      constants.push({
        key: props[0],
        value: props[1],
      });
    }

    return {
      name: parts[0],
      presets,
      constants,
      content: parts[3],
    };
  },

  // This imports a given script, with options supplied for ignoring included presets and constants
  // within the import data.
  importFullScriptData(rawInput, ignore) {
    const parsed = this.parseFullScriptData(rawInput);
    AutomatorData.createNewScript(parsed.content, parsed.name);

    if (!ignore.presets) {
      for (const preset of parsed.presets) {
        player.timestudy.presets[preset.id] = { name: preset.name, studies: preset.studies };
      }
    }

    if (!ignore.constants) {
      for (const constant of parsed.constants) {
        this.modifyConstant(constant.key, constant.value);
      }
    }

    this.initializeFromSave();
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
        if (stack && this.state.followExecution) AutomatorScroller.scrollToRawLine(stack.lineNumber);
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
    for (let steps = 0; steps < 100 && !this.hasJustCompleted; steps++) {
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
          break;
        case AUTOMATOR_COMMAND_STATUS.HALT:
          this.stop();
          return false;
        case AUTOMATOR_COMMAND_STATUS.RESTART:
          this.restart();
          return false;
      }

      // We need to break out of the loop if the last commands are all SKIP_INSTRUCTION, or else it'll start
      // trying to execute from an undefined stack if it isn't set to automatically repeat
      if (!this.stack.top) this.hasJustCompleted = true;
    }

    // This should in practice never happen by accident due to it requiring 100 consecutive commands that don't do
    // anything (looping a smaller group of no-ops will instead trigger the loop check every tick). Nevertheless,
    // better to not have an explicit infinite loop so that the game doesn't hang if the player decides to be funny
    // and input 3000 comments in a row. If hasJustCompleted is true, then we actually broke out because the end of
    // the script has no-ops and we just looped through them, and therefore shouldn't show these messages
    if (!this.hasJustCompleted) {
      GameUI.notify.error("Automator halted - too many consecutive no-ops detected");
      AutomatorData.logCommandEvent("Automator halted due to excessive no-op commands", this.currentLineNumber);
    }

    this.stop();
    return false;
  },

  singleStep() {
    if (this.stack.isEmpty) return;
    // SAME_INSTRUCTION is used to enter blocks; this means we've successfully
    // advanced a line. Otherwise, we always advance a line, regardless of return
    // state.
    // HALT and RESTART are exceptions, as these are called by commands which force
    // program flow to do something else other than simply advancing to the next line
    switch (this.runCurrentCommand()) {
      case AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION:
        break;
      case AUTOMATOR_COMMAND_STATUS.HALT:
        this.stop();
        break;
      case AUTOMATOR_COMMAND_STATUS.RESTART:
        this.restart();
        break;
      default:
        this.nextCommand();
        break;
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

  // Note: This gets run every time any edit or mode conversion is done
  saveScript(id, data) {
    const script = this.findScript(id);
    if (!script) return;

    // Add the old data to the undo buffer; there are internal checks which prevent it from saving too often.
    // For performance, the contents of the script aren't actually checked (this would be an unavoidable O(n) cost).
    // Instead we naively assume length changes are pure insertions and deletions, which does mean we're ignoring
    // a few edge cases when changes are really substitutions that massively change the content
    const oldData = script.persistent.content;
    const lenChange = Math.abs(oldData.length - data.length);
    AutomatorData.pushUndoData(oldData, lenChange);

    script.save(data);
    if (id === this.state.topLevelScript) this.stop();
  },

  newScript() {
    // Make sure the new script has a unique name
    const scriptNames = AutomatorBackend._scripts.map(s => s.name);
    let newScript;
    if (scriptNames.includes("New Script")) {
      let newIndex = 2;
      while (scriptNames.includes(`New Script (${newIndex})`)) newIndex++;
      newScript = AutomatorScript.create(`New Script (${newIndex})`);
    } else {
      newScript = AutomatorScript.create("New Script");
    }

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
      this.clearEditor();
    }
    if (id === this.state.topLevelScript) {
      this.stop();
      this.state.topLevelScript = this._scripts[0].id;
    }
    EventHub.dispatch(GAME_EVENT.AUTOMATOR_SAVE_CHANGED);
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
    AutomatorHighlighter.clearAllHighlightedLines();
  },

  pause() {
    this.state.mode = AUTOMATOR_MODE.PAUSE;
  },

  start(scriptID = this.state.topLevelScript, initialMode = AUTOMATOR_MODE.RUN, compile = true) {
    // Automator execution behaves oddly across new games, so we explicitly stop it from running if not unlocked
    if (!Player.automatorUnlocked) return;
    this.hasJustCompleted = false;
    this.state.topLevelScript = scriptID;
    player.reality.automator.execTimer = 0;
    const scriptObject = this.findScript(scriptID);
    if (!scriptObject) return;
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

  changeModes(scriptID) {
    Tutorial.moveOn(TUTORIAL_STATE.AUTOMATOR);
    if (player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) {
      // This saves the script after converting it.
      BlockAutomator.parseTextFromBlocks();
      player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
    } else {
      const toConvert = AutomatorTextUI.editor.getDoc().getValue();
      // Needs to be called to update the lines prop in the BlockAutomator object
      BlockAutomator.updateEditor(toConvert);
      AutomatorBackend.saveScript(scriptID, toConvert);
      player.reality.automator.type = AUTOMATOR_TYPE.BLOCK;
    }
    AutomatorHighlighter.clearAllHighlightedLines();
    EventHub.ui.dispatch(GAME_EVENT.AUTOMATOR_TYPE_CHANGED);
  },

  clearEditor() {
    if (player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) {
      BlockAutomator.clearEditor();
    } else {
      AutomatorTextUI.clearEditor();
    }
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
