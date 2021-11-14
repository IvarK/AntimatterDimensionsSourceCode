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

import * as Utils from "../javascripts/core/utils.js";
mergeIntoGlobal(Utils);

import "../javascripts/components";

import * as GameDB from "../javascripts/core/secret-formula";
mergeIntoGlobal(GameDB);

// Start of bullshit

// Hevi, why
import * as AutomatorBlockEditor from "../javascripts/components/reality/automator/automator-block-editor.js";
mergeIntoGlobal(AutomatorBlockEditor);

// Hevi, whyy
import * as AutomatorBlocks from "../javascripts/components/reality/automator/automator-blocks.js";
mergeIntoGlobal(AutomatorBlocks);

// Garnet, nooo
import * as AutomatorTextEditor from "../javascripts/components/reality/automator/automator-text-editor.js";
mergeIntoGlobal(AutomatorTextEditor);

// Spec, reeee
import * as PerksTab from "../javascripts/components/reality/perks-tab.js";
mergeIntoGlobal(PerksTab);

// End of bullshit

import * as core from "../javascripts/core/globals.js";
mergeIntoGlobal(core);

import * as game from "../javascripts/game.js";
mergeIntoGlobal(game);

game.init();
