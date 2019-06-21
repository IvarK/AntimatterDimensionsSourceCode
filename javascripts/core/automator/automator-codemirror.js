"use strict";

(function() {
  function walkSuggestion(suggestion, prefix, output) {
    if (suggestion.$autocomplete &&
      suggestion.$autocomplete.startsWith(prefix) && suggestion.$autocomplete !== prefix) {
      output.add(suggestion.$autocomplete);
    }
    for (const s of suggestion.categoryMatches) {
      walkSuggestion(AutomatorLexer.tokenIds[s], prefix, output);
    }
  }

  CodeMirror.registerHelper("lint", "automato", (contents, _, editor) => {
    const doc = editor.getDoc();
    console.log("automato lint");
    const errors = AutomatorGrammar.compile(contents, true).errors;
    return errors.map(e => ({
      message: e.info,
      severity: "error",
      from: doc.posFromIndex(e.startOffset),
      to: doc.posFromIndex(e.endOffset + 1),
    }));
  });

  CodeMirror.registerHelper("hint", "anyword", editor => {
    const cursor = editor.getDoc().getCursor();
    let start = cursor.ch;
    const end = cursor.ch;
    const line = editor.getLine(cursor.line);
    while (start && /\w/u.test(line.charAt(start - 1)))--start;
    const lineStart = line.slice(0, start);
    const currentPrefix = line.slice(start, end);
    const lineLex = AutomatorLexer.lexer.tokenize(lineStart);
    if (lineLex.errors.length > 0) return undefined;
    const rawSuggestions = AutomatorGrammar.parser.computeContentAssist("command", lineLex.tokens);
    console.log(rawSuggestions)
    const suggestions = new Set();
    for (const s of rawSuggestions) {
      if (s.ruleStack[1] === "badCommand") continue;
      walkSuggestion(s.nextTokenType, currentPrefix, suggestions);
    }
    return {
      list: Array.from(suggestions),
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, end)
    };
  });

  const commentRule = { regex: /(\/\/|#).*/u, token: "comment", next: "start" };

  CodeMirror.defineSimpleMode("automato", {
    // The start state contains the rules that are intially used
    start: [
      commentRule,
      {
        regex: /auto\s|define\s|if\s|pause\s|start\s|studies\s|tt\s|time theorems\s|unlock\s|until\s|wait\s|while\s|black[ \t]+hole\s|stored?[ \t]time\s/ui,
        token: "keyword",
        next: "commandArgs"
      },
      { regex: /infinity\S+|eternity\S+|reality\S+|pause\S+|restart\S+/ui, token: "error", next: "commandDone" },
      { regex: /infinity|eternity|reality|pause|restart/ui, token: "keyword", next: "commandDone" },
      { regex: /\}/ui, dedent: true },
      { regex: /\S+\s/ui, token: "error", next: "commandDone" },
    ],
    commandDone: [
      commentRule,
      { sol: true, next: "start" },
      // This seems necessary to have a closing curly brace de-indent automatically in some cases
      { regex: /\}/ui, dedent: true },
      { regex: /\S+/ui, token: "error" },
    ],
    commandArgs: [
      commentRule,
      { sol: true, next: "start" },
      { regex: /<=|>=|<|>/ui, token: "operator" },
      { regex: /on(\s|$)|off(\s|$)|dilation(\s|$)|load(\s|$)|respec(\s|$)|nowait(\s|$)/ui, token: "variable-2" },
      { regex: /preset(\s|$)|infinity(\s|$)|eternity(\s|$)|reality(\s|$)|use(\s|$)/ui, token: "variable-2" },
      { regex: /am|ip|ep|tt|sec(onds?)?|min(utes?)?|hours?/ui, token: "attribute" },
      { regex: /([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-5]?[0-9]:[0-5][0-9])/ui, token: "number" },
      { regex: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?\s/ui, token: "number" },
      { regex: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ui, token: "number" },
      { regex: /\{/ui, indent: true, next: "commandDone" },
      // This seems necessary to have a closing curly brace de-indent automatically in some cases
      { regex: /\}/ui, dedent: true },
    ],

    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
      lineComment: "//",
      electricChars: "}",
    }
  });

}());
