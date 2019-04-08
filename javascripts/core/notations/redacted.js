Notation.redacted = new class RedactedNotation extends Notation {
get isPainful() {
  return false;
}

formatDecimal(value) {
  const table = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
  const log8 = Math.LN10 / Math.log(8) * value.log10();
  let wholeLog = Math.floor(log8);
  const decimalLog = log8 - wholeLog;
  const decimalLog64 = Math.floor(decimalLog * 64);
  let string = "";
  while (wholeLog >= 8) {
    const remainder = wholeLog % 8;
    wholeLog -= remainder;
    wholeLog /= 8;
    string = table[remainder] + string;
   }
  string = "e" + table[wholeLog] + string + ".";
  string += table[Math.floor(decimalLog64 / 8)];
  string += table[decimalLog64 % 8];
  return string;
  }
 }("Redacted");
  
