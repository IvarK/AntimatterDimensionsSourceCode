const Automator = new class Automator {
  constructor() {
    this.lines = [];
    this.tokens = [];
  }

  parse(program) {
    this.tokens = new AutomatorLexer(program).remainingTokens();
    this.lines = new AutomatorParser(this.tokens).remainingLines();
  }
}();