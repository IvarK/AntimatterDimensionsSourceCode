function mergeIntoGlobal(object) {
  for (const key in object) {
    const value = object[key];
    const existingValue = window[key];
    if (existingValue !== undefined) {
      throw `Property ${key} already exists in global context`;
    }

    window[key] = value;
  }
}

import * as Utils from "./core/utils.js";
mergeIntoGlobal(Utils);

import "./components/index.js";

import * as GameDB from "./core/secret-formula/index.js";
mergeIntoGlobal(GameDB);

// Start of bullshit

// Hevi, why
import * as AutomatorBlockEditor from "./components/reality/automator/automator-block-editor.js";
mergeIntoGlobal(AutomatorBlockEditor);

// Hevi, whyy
import * as AutomatorBlocks from "./components/reality/automator/automator-blocks.js";
mergeIntoGlobal(AutomatorBlocks);

// Garnet, nooo
import * as AutomatorTextEditor from "./components/reality/automator/automator-text-editor.js";
mergeIntoGlobal(AutomatorTextEditor);

// Spec, reeee
import * as PerksTab from "./components/reality/perks-tab.js";
mergeIntoGlobal(PerksTab);

// End of bullshit

import * as core from "./core/globals.js";
mergeIntoGlobal(core);

import * as game from "./game.js";
mergeIntoGlobal(game);

game.init();
