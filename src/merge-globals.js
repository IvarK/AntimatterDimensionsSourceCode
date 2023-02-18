/* eslint-disable import/newline-after-import, import/first, import/order */
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

import * as Utils from "./core/utils";
mergeIntoGlobal(Utils);

import * as GameDB from "./core/secret-formula";
mergeIntoGlobal(GameDB);

// This is a list of legacy stuff, please don't add
// any more globals to the component files

import * as AutomatorBlockEditor from "@/components/tabs/automator/AutomatorBlockEditor";
mergeIntoGlobal(AutomatorBlockEditor);

import * as AutomatorBlocks from "@/components/tabs/automator/AutomatorBlocks";
mergeIntoGlobal(AutomatorBlocks);

import * as AutomatorTextEditor from "@/components/tabs/automator/AutomatorTextEditor";
mergeIntoGlobal(AutomatorTextEditor);

import * as PerksTab from "@/components/tabs/perks/PerksTab";
mergeIntoGlobal(PerksTab);

// End of legacy stuff

import * as core from "./core/globals";
mergeIntoGlobal(core);

import * as game from "./game";
mergeIntoGlobal(game);
