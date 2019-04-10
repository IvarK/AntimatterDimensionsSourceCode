Notation.redacted = new class RedactedNotation extends Notation {
get isPainful() {
  return false;
}

formatDecimal(value) {
  const table = ["", "", "", "", "", "", "", "", ""];
  const log8 = Math.LN10 / Math.log(9) * value.log10();
  let wholeLog = Math.floor(log9);
  const decimalLog = log9 - wholeLog;
  const decimalLog81 = Math.floor(decimalLog * 81);
  let string = "";
  while (wholeLog >= 9) {
    const remainder = wholeLog % 9;
    wholeLog -= remainder;
    wholeLog /= 9;
    string = table[remainder] + string;
   }
  string = table[wholeLog] + string + ".";
  string += table[Math.floor(decimalLog81 / 9)];
  string += table[decimalLog81 % 9];
  return string;
  }
 }("Redacted");
  
