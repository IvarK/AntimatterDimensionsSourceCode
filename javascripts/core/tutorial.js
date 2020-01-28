"use strict";

const TUTORIAL_STATE = {
  DIM1: 0,
  DIM2: 1
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
  }
];

const Tutorial = {
  // Whether visual effect is active or not
  active: true,

  // Class to be given to glowing components
  glowingClass(atState, conditional = true) {
    return {
      "tutorial--glow": atState === player.tutorialState && conditional && this.active
    };
  },

  // Turns off the visual effect
  turnOffEffect(fromState) {
    if (fromState !== player.tutorialState) return;
    this.active = false;
  },

  // Moves on to the next tutorialState, but only if parameter is current state.
  moveOn(fromState) {
    if (fromState !== player.tutorialState) return;
    player.tutorialState++;
    this.active = true;
  },

  tutorialLoop() {
    const nextState = tutorialStates.find(o => o.id === player.tutorialState + 1);
    if (nextState && nextState.condition()) this.moveOn(player.tutorialState);
  }
};
