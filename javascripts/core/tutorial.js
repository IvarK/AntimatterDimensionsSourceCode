"use strict";

const TUTORIAL_STATE = {
  DIM1: 0,
  DIM2: 1,
  DIMSHIFT: 2,
  GALAXY: 3
};

// Tutorial has two ways of moving on, either by Tutorial.moveOn() or by having it's condition be true
const tutorialStates = [
  {
    // Highlight the 1st dim button
    id: TUTORIAL_STATE.DIM1,
    condition: () => true
  },
  {
    // Highlight the 2nd dim button
    id: TUTORIAL_STATE.DIM2,
    condition: () => player.antimatter.gte(100)
  },
  {
    id: TUTORIAL_STATE.DIMSHIFT,
    condition: () => NormalDimension(4).amount.gte(20)
  },
  {
    id: TUTORIAL_STATE.GALAXY,
    condition: () => NormalDimension(8).amount.gte(80)
  }
];

const Tutorial = {

  // Class to be given to glowing components
  glowingClass(atState, currentState, conditional = true) {
    return {
      "tutorial--glow": atState === currentState && conditional && ui.view.tutorialActive
    };
  },

  // Turns off the visual effect
  turnOffEffect(fromState) {
    if (fromState !== player.tutorialState) return;
    player.tutorialActive = false;
    ui.view.tutorialActive = false;
  },

  // Moves on to the next tutorialState, but only if parameter is current state.
  moveOn(fromState) {
    if (fromState !== player.tutorialState) return;
    player.tutorialState++;
    ui.view.tutorialState++;
    player.tutorialActive = true;
    ui.view.tutorialActive = true;
  },

  tutorialLoop() {
    const nextState = tutorialStates.find(o => o.id === player.tutorialState + 1);
    if (nextState && nextState.condition()) this.moveOn(player.tutorialState);
  }
};
