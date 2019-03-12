Vue.component("automator-editor", {
  data() {
    return {
      undoStack: [],
      selection: undefined,
      undoOffset: 0,
      undoTimestamp: 0,
      lastPos: 0,
      lines: [],
      readonly: false,
    };
  },
  computed: {
    lineNumbersCount() {
      return Math.max(this.lines.length, 1);
    }
  },
  updated() {
    if (this.selection) {
      setSelectionRange(this.$refs.pre, this.selection);
    }
    tippy("[data-tippy-content]", {
      placement: "initial",
      animateFill: false,
      animation: "none",
      theme: "light-border",
      interactive: true,
      allowHTML: true,
      delay: 0,
      popperOptions: {
        modifiers: {
          computeStyle: {
            gpuAcceleration: false
          }
        }
      }
    });
  },
  mounted() {
    this.recordChange(this.getPlain());
    this.undoTimestamp = 0;
    const mousetrap = Mousetrap(this.$refs.pre);
    const bind = (key, handler) =>
      mousetrap.bind(key, e => {
        e.preventDefault();
        handler();
      });
    bind("enter", this.addLineBreak);
    bind("tab", this.addIndent);
    bind("ctrl+z", this.undo);
    bind(["ctrl+y", "ctrl+shift+z"], this.redo);
    this._mousetrap = mousetrap;
    AutomatorEditor.attach(this.$refs.pre);
  },
  beforeDestroy() {
    this._mousetrap.reset();
    AutomatorEditor.detach();
  },
  methods: {
    handleClick() {
      this.undoTimestamp = 0; // Reset timestamp
      this.selection = getSelectionRange(this.$refs.pre);
    },
    getPlain() {
      let innerHTML = this.$refs.pre.innerHTML;
      if (this._innerHTML === innerHTML) {
        return this._plain;
      }
      const normalized = innerHTML.replace(/\r\n|\n/, "<br>");
      const plain = htmlToPlain(normalized);
      this._innerHTML = innerHTML;
      this._plain = plain;
      return this._plain;
    },
    recordChange(plain, selection) {
      if (plain === this.undoStack.last()) return;
      if (this.undoOffset > 0) {
        this.undoStack = this.undoStack.slice(0, -this.undoOffset);
        this.undoOffset = 0;
      }
      const now = Date.now();
      // Overwrite last record if it wasn't too long ago
      if (now - this.undoTimestamp < 3000) {
        this.undoStack.pop();
      }
      this.undoTimestamp = now;
      this.undoStack.push({ plain, selection });
      if (this.undoStack.length > 50) {
        this.undoStack.shift();
      }
    },
    updateContent(plain) {
      Automator.parse(plain);
      AutomatorEditor.updateLines(Automator.lines);
      this.lines = Automator.lines
        .map(line => line.viewModel());
      if (this.selection) {
        setSelectionRange(this.$refs.pre, this.selection);
      }
    },
    restoreStackState(offset) {
      this.undoOffset = offset;
      const record = this.undoStack[this.undoStack.length - 1 - offset];
      this.selection = record.selection;
      this.updateContent(record.plain);
    },
    undo() {
      const offset = this.undoOffset + 1;
      if (offset >= this.undoStack.length) return;
      this.restoreStackState(offset);
    },
    redo() {
      const offset = this.undoOffset - 1;
      if (offset < 0) return;
      this.restoreStackState(offset);
    },
    addIndent() {
      document.execCommand("insertHTML", false, "  ");
    },
    addLineBreak() {
      // We need to override default Enter behavior because different browsers
      // behave way too different for us to handle.
      this.preventProcessing = true;
      // https://stackoverflow.com/questions/35585421
      // Add a space and remove it. It works :/
      document.execCommand("insertHTML", false, "\n ");
      this.preventProcessing = false;
      document.execCommand("delete", false);
    },
    handleKeyUp(evt) {
      return;
      if (
        evt.keyCode === 91 || // left cmd
        evt.keyCode === 93 || // right cmd
        evt.ctrlKey ||
        evt.metaKey
      ) {
        return;
      }

      this.selection = getSelectionRange(this.$refs.pre);
      if (
        evt.keyCode === 37 || // left
        evt.keyCode === 38 || // up
        evt.keyCode === 39 || // right
        evt.keyCode === 40    // down
      ) {
        this.undoTimestamp = 0;
        return;
      }
      if (evt.keyCode === 13) {
        // Enter
        this.undoTimestamp = 0;
      }
      const plain = this.getPlain();
      this.recordChange(plain, this.selection);
      this.updateContent(plain);
    },
    handleInput(e) {
      if (this.preventProcessing) return;
      e.preventDefault();
      this.selection = getSelectionRange(this.$refs.pre);
      const plain = this.getPlain();
      this.recordChange(plain, this.selection);
      this.updateContent(plain);
    },
    handlePaste(e) {
      const currentCursorPos = getSelectionRange(this.$refs.pre);
      const text = (e.originalEvent || e).clipboardData.getData("Text");
      this.preventProcessing = true;
      document.execCommand("insertHTML", false, escapeHtml(text));
      this.preventProcessing = false;
      const newCursorPos = currentCursorPos.end + text.length;
      this.selection = { start: newCursorPos, end: newCursorPos };
      const plain = this.getPlain();
      this.recordChange(plain, this.selection);
      this.updateContent(plain);
      e.preventDefault();
    },
    lineNumberClass(line) {
      if (line.type !== AutomatorLineType.CODE) {
        return ["o-automator-line-number--hidden"];
      }
    },
    lineNumberContent(line) {
      return line.type === AutomatorLineType.CODE ? line.codeLine : "000";
    }
  },
  template:
    `<div class="c-automator-editor l-automator-editor">
      <div class="l-automator-editor__line-numbers" aria-hidden="true">
        <div class="o-automator-line-number--sizer">999</div>
        <div
          class="o-automator-line-number"
          :class="lineNumberClass(line)"
          v-for="(line, i) in lines"
          :key="i"
        >{{lineNumberContent(line)}}</div>
      </div>
      <pre
        ref="pre"
        :contenteditable="!readonly"
        @keyup="handleKeyUp"
        @click="handleClick"
        @paste="handlePaste"
        @input="handleInput"
        spellCheck="false"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        data-gramm="false"
        class="c-automator-editor__editor l-automator-editor__editor"
      ></pre>
    </div>`
});

const AutomatorEditor = new class AutomatorEditor {
  constructor() {
    /** @type {HTMLSpanElement[]} */
    this._spanPool = [];
  }

  attach(pre) {
    /** @type {HTMLPreElement} */
    this._pre = pre;
  }

  detach() {
    this._pre = undefined;
    this._spanPool = [];
  }

  updateTokens(tokens) {
    let pre = this._pre;
    if (pre === undefined) return;
    this._pre.innerHTML = tokens
      .map(t => {
        if (t.type === AutomatorTokenType.LINE_END || t.type === AutomatorTokenType.WHITESPACE) {
          return t.value;
        }
        let className = "";
        if (t.type === AutomatorTokenType.COMMENT) {
          className = "lang-comment";
        } else if (t.type === AutomatorTokenType.IDENTIFIER) {
          className = "lang-declaration";
        } else if (t.type === AutomatorTokenType.ERROR) {
          className = "lang-error";
        }
        if (t.error !== undefined) {
          className += "lang-squiggle";
        }
        let span = "<span";
        if (className) {
          span += ` class="${className}"`;
        }
        if (t.error !== undefined) {
          span += ` data-tippy-content="${t.error}"`;
        }
        span += `>${t.value}</span>`;
        return span;
      })
      .join("");
  }

  updateLines(lines) {
    let pre = this._pre;
    if (pre === undefined) return;
    this._pre.innerHTML = lines
      .map(l => this.stringify(l))
      .join("");
  }

  stringify(line) {
    return line.tokens
      .map(t => {
        if (t.type === AutomatorTokenType.LINE_END || t.type === AutomatorTokenType.WHITESPACE) {
          return t.value;
        }
        let className = "";
        if (t.type === AutomatorTokenType.COMMENT) {
          className = "lang-comment";
        } else if (t.type === AutomatorTokenType.IDENTIFIER) {
          className = "lang-declaration";
        } else if (t.type === AutomatorTokenType.ERROR) {
          className = "lang-error";
        }
        if (t.error !== undefined) {
          className += " lang-squiggle";
        }
        let span = "<span";
        if (className) {
          span += ` class="${className}"`;
        }
        if (t.error) {
          span += ` data-tippy-content="${t.error}"`;
        }
        span += `>${t.value}</span>`;
        return span;
      })
      .join("");
  }
}();

const htmlToPlain = html =>
  unEscape(html.replace(/<br>/gm, "\n").replace(/<\/?[^>]*>/gm, ""));