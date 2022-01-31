function mergeIntoGlobal(object) {
  for (const key in object) {
    if (key === "default") {
      // Skip default exports
      continue;
    }
    const value = object[key];
    const existingValue = window[key];
    if (existingValue !== undefined) {
      throw `Property ${key} already exists in global context`;
    }

    window[key] = value;
  }
}

import * as Utils from "../javascripts/core/utils";
mergeIntoGlobal(Utils);

import "../javascripts/components";

import * as GameDB from "../javascripts/core/secret-formula";
mergeIntoGlobal(GameDB);

// Start of bullshit

// Hevi, why
import * as AutomatorBlockEditor from "@/components/tabs/automator/AutomatorBlockEditor";
mergeIntoGlobal(AutomatorBlockEditor);

// Hevi, whyy
import * as AutomatorBlocks from "@/components/tabs/automator/AutomatorBlocks";
mergeIntoGlobal(AutomatorBlocks);

// Garnet, nooo
import * as AutomatorTextEditor from "@/components/tabs/automator/AutomatorTextEditor";
mergeIntoGlobal(AutomatorTextEditor);

// Spec, reeee
import * as PerksTab from "../javascripts/components/reality/perks-tab";
mergeIntoGlobal(PerksTab);

// End of bullshit

import * as core from "../javascripts/core/globals";
mergeIntoGlobal(core);

import * as game from "../javascripts/game";
mergeIntoGlobal(game);
