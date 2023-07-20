import { lexer, tokenIds } from "./lexer";
import { compile } from "./compiler";
import { parser } from "./parser";

function walkSuggestion(suggestion, prefix, output) {
  const hasAutocomplete = suggestion.$autocomplete &&
    suggestion.$autocomplete.startsWith(prefix) && suggestion.$autocomplete !== prefix;
  const isUnlocked = suggestion.$unlocked ? suggestion.$unlocked() : true;
  if (hasAutocomplete && isUnlocked) output.add(suggestion.$autocomplete);
  for (const s of suggestion.categoryMatches) {
    walkSuggestion(tokenIds[s], prefix, output);
  }
}

// eslint-disable-next-line no-unused-vars
CodeMirror.registerHelper("lint", "automato", (contents, _, editor) => {
  const doc = editor.getDoc();
  const errors = compile(contents, true).errors;
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
  const lineLex = lexer.tokenize(lineStart);
  if (lineLex.errors.length > 0) return undefined;
  const rawSuggestions = parser.computeContentAssist("command", lineLex.tokens);
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

// This is a state machine which determines the syntax highlighting for the automator. Top-level props define
// the states, the array entries define the transition rules which are checked in order of appearance, and next
// specifies which state to transition to after consuming the given regex. Without an entry for "next" the state
// machine will remain in the same state and run the transition check after consuming the regex. The "next" prop
// in the line with "sol" is a fallback transition which will be followed if none of the rules are matched.
// Matches to the regexes will color the matched text according to the specified color of cm-[token] in liquibyte.css
// Note: This has no bearing on the actual functionality and behavior of the automator itself and is purely visual.
CodeMirror.defineSimpleMode("automato", {
  // The start state contains the rules that are intially used
  start: [
    commentRule,
    { regex: /studies\s+/ui, token: "keyword", next: "studiesArgs" },
    { regex: /blob\s\s/ui, token: "blob" },
    {
      // eslint-disable-next-line max-len
      regex: /(auto|if|pause|studies|time[ \t]+theorems?|space[ \t]+theorems?|until|wait|while|black[ \t]+hole|stored?[ \t]+game[ \t]+time|notify)\s/ui,
      token: "keyword",
      next: "commandArgs"
    },
    {
      regex: /stop/ui,
      token: "keyword",
      next: "commandDone"
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
    { regex: /purchase/ui, token: "variable-2", next: "studiesList" },
    { regex: /nowait(\s+|$)/ui, token: "property" },
  ],
  studiesList: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /(antimatter|infinity|time)(?=[\s,|]|$)/ui, token: "number" },
    { regex: /(active|passive|idle)(?=[\s,|]|$)/ui, token: "number" },
    { regex: /(light|dark)(?=[\s,|]|$)/ui, token: "number" },
    { regex: /([1-9][0-9]+)(?=[\s,!|-]|$)/ui, token: "number" },
    { regex: /[a-zA-Z_][a-zA-Z_0-9]*/u, token: "variable", next: "commandDone" },
    { regex: /!$/ui, token: "variable-2" },
    { regex: /([1-9]|1[0-2])(?=!|$)/ui, token: "number" },
  ],
  studiesLoad: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /id(\s+|$)/ui, token: "variable-2", next: "studiesLoadId" },
    { regex: /name(\s+|$)/ui, token: "variable-2", next: "studiesLoadPreset" },
    { regex: /\S+/ui, token: "error" },
  ],
  studiesLoadId: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /\d/ui, token: "qualifier", next: "commandDone" },
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
  startUnlock: [
    commentRule,
    { sol: true, next: "start" },
    {
      regex: /ec\s?(1[0-2]|[1-9])|dilation/ui,
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
    { regex: /'.*'/ui, token: "string", next: "commandDone" },
    { regex: /(on|off|bh1|bh2|dilation|load|respec)(\s|$)/ui, token: "variable-2" },
    { regex: /(eternity|reality|use)(\s|$)/ui, token: "variable-2" },
    { regex: /(antimatter|infinity|time)(\s|$|(?=,))/ui, token: "variable-2" },
    { regex: /(active|passive|idle)(\s|$|(?=,))/ui, token: "variable-2" },
    { regex: /(light|dark)(\s|$|(?=,))/ui, token: "variable-2" },
    { regex: /x[\t ]+highest(\s|$)/ui, token: "variable-2" },
    { regex: /pending[\t ]+(completions|ip|ep|tp|rm|glyph[\t ]+level)(\s|$)/ui, token: "variable-2" },
    { regex: /total[\t ]+(completions|tt|space theorems)(\s|$)/ui, token: "variable-2" },
    { regex: /filter[ \t]+score/ui, token: "variable-2" },
    { regex: /ec(1[0-2]|[1-9])[\t ]+completions(\s|$)/ui, token: "variable-2" },
    { regex: /(am|ip|ep|all)(\s|$)/ui, token: "variable-2" },
    {
      regex: /(rm|rg|dt|tp|tt|space theorems|(banked )?infinities|eternities|realities|rep(licanti)?)(\s|$)/ui,
      token: "variable-2",
    },
    { regex: / sec(onds ?) ?| min(utes ?) ?| hours ?/ui, token: "variable-2" },
    { regex: /([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-5]?[0-9]:[0-5][0-9]|t[1-4])/ui, token: "number" },
    { regex: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ui, token: "number" },
    { regex: /[a-zA-Z_][a-zA-Z_0-9]*/u, token: "variable" },
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
