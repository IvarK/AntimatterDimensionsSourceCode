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

  // eslint-disable-next-line no-unused-vars
  CodeMirror.registerHelper("lint", "automato", (contents, _, editor) => {
    const doc = editor.getDoc();
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
      { regex: /studies\s+/ui, token: "keyword", next: "studiesArgs" },
      { regex: /blob\s\s/ui, token: "blob" },
      {
        // eslint-disable-next-line max-len
        regex: /auto\s|if\s|pause\s|studies\s|tt\s|time theorems\s|until\s|wait\s|while\s|black[ \t]+hole\s|stored?[ \t]time\s|notify/ui,
        token: "keyword",
        next: "commandArgs"
      },
      {
        regex: /define\s/ui,
        token: "keyword",
        next: "defineIdentifier"
      },
      {
        regex: /start\s|unlock\s/ui,
        token: "keyword",
        next: "startUnlock"
      },
      { regex: /infinity\S+|eternity\S+|reality\S+|pause\S+|restart\S+/ui, token: "error", next: "commandDone" },
      { regex: /infinity|eternity|reality/ui, token: "keyword", next: "prestige" },
      { regex: /pause|restart/ui, token: "keyword", next: "commandDone" },
      { regex: /\}/ui, dedent: true },
      { regex: /\S+\s/ui, token: "error", next: "commandDone" },
    ],
    studiesArgs: [
      commentRule,
      { sol: true, next: "start" },
      { regex: /load(\s+|$)/ui, token: "variable-2", next: "studiesLoad" },
      { regex: /respec/ui, token: "variable-2", next: "commandDone" },
      { regex: /nowait(\s+|$)/ui, token: "property", next: "studiesList" },
      { regex: /(?=\S)/ui, next: "studiesList" },
    ],
    studiesList: [
      commentRule,
      { sol: true, next: "start" },
      { regex: /antimatter(?=[\s,]|$)|infinity(?=[\s,]|$)|time(?=[\s,]|$)/ui, token: "variable-2" },
      { regex: /active(?=[\s,]|$)|passive(?=[\s,]|$)|idle(?=[\s,]|$)/ui, token: "variable-2" },
      { regex: /[a-zA-Z_][a-zA-Z_0-9]*/u, token: "variable", next: "commandDone" },
      { regex: /[1-9][0-9]+/ui, token: "number" },
    ],
    studiesLoad: [
      commentRule,
      { sol: true, next: "start" },
      { regex: /preset(\s+|$)/ui, token: "variable-2", next: "studiesLoadPreset" },
      { regex: /\S+/ui, token: "error" },
    ],
    studiesLoadPreset: [
      commentRule,
      { sol: true, next: "start" },
      { regex: /(\/(?!\/)|[^\s#/])+/ui, token: "qualifier", next: "commandDone" },
    ],
    prestige: [
      commentRule,
      { sol: true, next: "start" },
      { regex: /nowait(\s|$)/ui, token: "property" },
      { regex: /respec/ui, token: "variable-2" },
    ],
    commandDone: [
      commentRule,
      { sol: true, next: "start" },
      // This seems necessary to have a closing curly brace de-indent automatically in some cases
      { regex: /\}/ui, dedent: true },
      { regex: /\S+/ui, token: "error" },
    ],
    defineIdentifier: [
      commentRule,
      { sol: true, next: "start" },
      { regex: /[a-zA-Z_][a-zA-Z_0-9]*/u, token: "variable", next: "commandArgs" },
    ],
    startUnlock: [
      commentRule,
      { sol: true, next: "start" },
      {
        regex: /ec(1[0-2]|[1-9])|dilation/ui,
        token: "variable-2",
        next: "commandDone",
      },
      { regex: /nowait(\s|$)/ui, token: "property" },
    ],
    commandArgs: [
      commentRule,
      { sol: true, next: "start" },
      { regex: /<=|>=|<|>/ui, token: "operator" },
      { regex: /nowait(\s|$)/ui, token: "property" },
      { regex: /".*"/ui, token: "string", next: "commandDone" },
      { regex: /on(\s|$)|off(\s|$)|dilation(\s|$)|load(\s|$)|respec(\s|$)/ui, token: "variable-2" },
      { regex: /preset(\s|$)|eternity(\s|$)|reality(\s|$)|use(\s|$)/ui, token: "variable-2" },
      { regex: /antimatter(\s|$|(?=,))|infinity(\s|$|(?=,))|time(\s|$|(?=,))/ui, token: "variable-2" },
      { regex: /x[\t ]+current(\s|$)/ui, token: "variable-2" },
      { regex: /pending[\t ]+(completions|ip|ep|rm)(\s|$)|glyph[\t ]+level(\s|$)/ui, token: "variable-2" },
      { regex: /ec(1[0-2]|[1-9])[\t ]+completions(\s|$)/ui, token: "variable-2" },
      {
        regex: /am(\s|$)|ip(\s|$)|ep(\s|$)|rm(\s|$)|rg(\s|$)|dt(\s|$)|tp(\s|$)|tt(\s|$)|max(\s|$)|total tt(\s|$)/ui,
        token: "variable-2",
      },
      { regex: / sec(onds ?) ?| min(utes ?) ?| hours ?/ui, token: "variable-2" },
      { regex: /([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-5]?[0-9]:[0-5][0-9])/ui, token: "number" },
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
