export function planetResetRequest() {
  askPlanetConfirmation();
}

function askPlanetConfirmation() {
  if (player.options.confirmations.planets) {
    Modal.planets.show();
  } else {
    planetsReset();
  }
}

export function planetsReset() {
  console.log("Nice button nerd");
}