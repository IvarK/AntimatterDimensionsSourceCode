//exponential dimensions

function updateExponentialDimensions() {
  if (document.getElementById("exponentialdimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {
    for (let tier = 1; tier <= 4; ++tier) {
      document.getElementById("expD"+tier).textContent = DISPLAY_NAMES[tier] + " Exponential Dimension x" + shortenMoney(getExponentialDimensionPower(tier));
      document.getElementById("expAmount"+tier).textContent = getExponentialDimensionDescription(tier);
      document.getElementById("expGain"+tier).textContent = getExponentialDimensionGain(tier);
      document.getElementById("expGain"+tier).textContent = getExponentialDimensionNext(tier);
    }
  }
}