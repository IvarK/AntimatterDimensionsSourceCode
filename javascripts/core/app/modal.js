import ModalMessage from "@/components/modals/ModalMessage";
import ModalCelestialQuote from "@/components/modals/ModalCelestialQuote";
import ModalCloudSaveConflict from "@/components/modals/cloud/ModalCloudSaveConflict";
import ModalCloudLoadConflict from "@/components/modals/cloud/ModalCloudLoadConflict";
import ModalStartEternityChallenge from "@/components/modals/challenges/ModalStartEternityChallenge";
import ModalStartInfinityChallenge from "@/components/modals/challenges/ModalStartInfinityChallenge";
import ModalStartNormalChallenge from "@/components/modals/challenges/ModalStartNormalChallenge";

import ModalDimensionBoost from "@/components/modals/prestige/ModalDimensionBoost";
import ModalAntimatterGalaxy from "@/components/modals/prestige/ModalAntimatterGalaxy";
import ModalBigCrunch from "@/components/modals/prestige/ModalBigCrunch";
import ModalReplicantiGalaxy from "@/components/modals/prestige/ModalReplicantiGalaxy";
import ModalEternity from "@/components/modals/prestige/ModalEternity";
import ModalEnterDilation from "@/components/modals/prestige/ModalEnterDilation";
import ModalReality from "@/components/modals/prestige/ModalReality";
import ModalResetReality from "@/components/modals/prestige/ModalResetReality";
import ModalExitCelestialReality from "@/components/modals/prestige/ModalExitCelestialReality";
import ModalCelestials from "@/components/modals/prestige/ModalCelestials";
import ModalHardReset from "@/components/modals/prestige/ModalHardReset";

import ModalConfirmationOptions from "@/components/modals/options/ModalConfirmationOptions";
import ModalInfoDisplayOptions from "@/components/modals/options/ModalInfoDisplayOptions";
import ModalAwayProgressOptions from "@/components/modals/options/ModalAwayProgressOptions";
import ModalShortcuts from "@/components/modals/options/ModalShortcuts";
import ModalNewsOptions from "@/components/modals/options/ModalNewsOptions";
import ModalAnimationOptions from "@/components/modals/options/ModalAnimationOptions";
import ModalPreferredTree from "@/components/modals/options/ModalPreferredTree";
import ModalHiddenTabs from "@/components/modals/options/hidden-tabs/ModalHiddenTabs";

import ModalDeleteCompanion from "@/components/modals/glyph-management/ModalDeleteCompanion";
import ModalGlyphDelete from "@/components/modals/glyph-management/ModalGlyphDelete";
import ModalGlyphPurge from "@/components/modals/glyph-management/ModalGlyphPurge";
import ModalGlyphSacrifice from "@/components/modals/glyph-management/ModalGlyphSacrifice";
import ModalGlyphRefine from "@/components/modals/glyph-management/ModalGlyphRefine";
import ModalDeleteAllUnprotectedGlyphs from "@/components/modals/glyph-management/ModalDeleteAllUnprotectedGlyphs";
import ModalDeleteAllRejectedGlyphs from "@/components/modals/glyph-management/ModalDeleteAllRejectedGlyphs";

import ModalH2P from "@/components/modals/ModalH2P";
import ModalGlyphShowcasePanel from "@/components/modals/ModalGlyphShowcasePanel";
import ModalGlyphUndo from "@/components/modals/ModalGlyphUndo";
import ModalGlyphReplace from "@/components/modals/ModalGlyphReplace";
import ModalUiChoice from "@/components/modals/ModalUiChoice";
import ModalAwayProgress from "@/components/modals/ModalAwayProgress";
import ModalLoadGame from "@/components/modals/ModalLoadGame";
import ModalImport from "@/components/modals/ModalImport";
import ModalAutomatorScriptImport from "@/components/modals/ModalAutomatorScriptImport";
import ModalAutomatorScriptDelete from "@/components/modals/ModalAutomatorScriptDelete";
import ModalStdStore from "@/components/modals/ModalStdStore";
import ModalStudyString from "@/components/modals/ModalStudyString";
import ModalSacrifice from "@/components/modals/ModalSacrifice";
import ModalBreakInfinity from "@/components/modals/ModalBreakInfinity";


export class Modal {
  constructor(component, bare = false) {
    this._component = component;
    this._bare = bare;
    this._modalConfig = {};
  }

  show(modalConfig) {
    if (!GameUI.initialized) return;
    this._props = Object.assign({}, modalConfig || {});
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = this;
    // New modals go to the back of the queue (shown last).
    if (!ui.view.modal.queue.includes(this)) ui.view.modal.queue.push(this);
  }

  get isOpen() {
    return ui.view.modal.current === this;
  }

  get component() {
    return this._component;
  }

  get isBare() {
    return this._bare;
  }

  get props() {
    return this._props;
  }

  static hide() {
    if (!GameUI.initialized) return;
    ui.view.modal.queue.shift();
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined;
    else ui.view.modal.current = ui.view.modal.queue[0];
    ui.view.modal.cloudConflict = [];
  }

  static hideAll() {
    if (!GameUI.initialized) return;
    ui.view.modal.queue = [];
    ui.view.modal.current = undefined;
  }

  static get isOpen() {
    return ui.view.modal.current === this;
  }
}

class ChallengeConfirmationModal extends Modal {
  show(id) {
    this.id = id;
    super.show();
  }
}

Modal.startEternityChallenge = new ChallengeConfirmationModal(ModalStartEternityChallenge);
Modal.startInfinityChallenge = new ChallengeConfirmationModal(ModalStartInfinityChallenge);
Modal.startNormalChallenge = new ChallengeConfirmationModal(ModalStartNormalChallenge);

Modal.dimensionBoost = new Modal(ModalDimensionBoost);
Modal.antimatterGalaxy = new Modal(ModalAntimatterGalaxy);
Modal.bigCrunch = new Modal(ModalBigCrunch);
Modal.replicantiGalaxy = new Modal(ModalReplicantiGalaxy);
Modal.eternity = new Modal(ModalEternity);
Modal.enterDilation = new Modal(ModalEnterDilation);
Modal.reality = new Modal(ModalReality);
Modal.resetReality = new Modal(ModalResetReality);
Modal.exitCelestialReality = new Modal(ModalExitCelestialReality);
Modal.celestials = new Modal(ModalCelestials);
Modal.hardReset = new Modal(ModalHardReset);

Modal.confirmationOptions = new Modal(ModalConfirmationOptions);
Modal.infoDisplayOptions = new Modal(ModalInfoDisplayOptions);
Modal.awayProgressOptions = new Modal(ModalAwayProgressOptions);
Modal.shortcuts = new Modal(ModalShortcuts);
Modal.newsOptions = new Modal(ModalNewsOptions);
Modal.animationOptions = new Modal(ModalAnimationOptions);
Modal.hiddenTabs = new Modal(ModalHiddenTabs);
Modal.preferredTree = new Modal(ModalPreferredTree);

Modal.deleteCompanion = new Modal(ModalDeleteCompanion);
Modal.glyphDelete = new Modal(ModalGlyphDelete);
Modal.glyphPurge = new Modal(ModalGlyphPurge);
Modal.glyphSacrifice = new Modal(ModalGlyphSacrifice);
Modal.glyphRefine = new Modal(ModalGlyphRefine);
Modal.deleteAllUnprotectedGlyphs = new Modal(ModalDeleteAllUnprotectedGlyphs);
Modal.deleteAllRejectedGlyphs = new Modal(ModalDeleteAllRejectedGlyphs);


Modal.glyphShowcasePanel = new Modal(ModalGlyphShowcasePanel);
Modal.glyphUndo = new Modal(ModalGlyphUndo);
Modal.glyphReplace = new Modal(ModalGlyphReplace);
Modal.enslavedHints = new Modal("modal-enslaved-hints");
Modal.realityGlyph = new Modal("modal-reality-glyph-creation");
Modal.glyphSetSaveDelete = new Modal("modal-set-save-delete");
Modal.uiChoice = new Modal(ModalUiChoice);
Modal.h2p = new Modal(ModalH2P);
Modal.awayProgress = new Modal(ModalAwayProgress);
Modal.loadGame = new Modal(ModalLoadGame);
Modal.import = new Modal(ModalImport);
Modal.importScript = new Modal(ModalAutomatorScriptImport);
Modal.automatorScriptDelete = new Modal(ModalAutomatorScriptDelete);
Modal.shop = new Modal(ModalStdStore);
Modal.studyString = new Modal(ModalStudyString);
Modal.singularityMilestones = new Modal("singularity-milestones-modal");
Modal.sacrifice = new Modal(ModalSacrifice);
Modal.breakInfinity = new Modal(ModalBreakInfinity);
Modal.celestialQuote = new class extends Modal {
  show(celestial, lines) {
    if (!GameUI.initialized) return;
    const newLines = lines.map(l => ({
      celestial,
      line: l,
      showName: !l.startsWith("*")
    }));
    if (ui.view.modal.current === this) {
      // This shouldn't come up often, but in case we do have a pile of quotes
      // being shown in a row:
      this.lines = this.lines.concat(newLines);
      return;
    }
    super.show();
    this.lines = newLines;
  }
}(ModalCelestialQuote, true);

Modal.cloudSaveConflict = new Modal(ModalCloudSaveConflict);
Modal.cloudLoadConflict = new Modal(ModalCloudLoadConflict);
// eslint-disable-next-line max-params
Modal.addCloudConflict = function(saveId, saveComparison, cloudSave, localSave, onAccept) {
  Modal.hide();
  ui.view.modal.cloudConflict = {
    saveId,
    saveComparison,
    cloud: getSaveInfo(cloudSave),
    local: getSaveInfo(localSave),
    onAccept
  };

  function getSaveInfo(save) {
    const resources = {
      realTimePlayed: 0,
      totalAntimatter: new Decimal(0),
      infinities: new Decimal(0),
      eternities: new Decimal(0),
      realities: 0,
      infinityPoints: new Decimal(0),
      eternityPoints: new Decimal(0),
      realityMachines: new Decimal(0),
      imaginaryMachines: 0,
      dilatedTime: new Decimal(0),
      bestLevel: 0,
    };
    resources.realTimePlayed = save.records.realTimePlayed;
    resources.totalAntimatter.copyFrom(new Decimal(save.records.totalAntimatter));
    resources.infinities.copyFrom(new Decimal(save.infinities));
    resources.eternities.copyFrom(new Decimal(save.eternities));
    resources.realities = save.realities;
    resources.infinityPoints.copyFrom(new Decimal(save.infinityPoints));
    resources.eternityPoints.copyFrom(new Decimal(save.eternityPoints));
    resources.realityMachines.copyFrom(new Decimal(save.reality.realityMachines));
    resources.imaginaryMachines = save.reality.iMCap;
    resources.dilatedTime.copyFrom(new Decimal(save.dilation.dilatedTime));
    resources.bestLevel = save.records.bestReality.glyphLevel;

    return resources;
  }
};

Modal.message = new class extends Modal {
  show(text, callback, closeButton = false) {
    if (!GameUI.initialized) return;
    super.show();
    if (this.message === undefined) {
      this.message = text;
      this.callback = callback;
      this.closeButton = closeButton;
    }
    if (!this.queue) this.queue = [];
    this.queue.push({ text, callback, closeButton });
    // Sometimes we have stacked messages that get lost, since we don't have stacking modal system.
    // TODO: remove this console.log
    // eslint-disable-next-line no-console
    console.log(`Modal message: ${text}`);
  }

  hide() {
    Modal.hide();
    this.queue.shift();
    if (this.queue && this.queue.length === 0) this.message = undefined;
    else {
      this.message = this.queue[0].text;
      this.callback = this.queue[0].callback;
      this.closeButton = this.queue[0].closeButton;
    }
  }
}(ModalMessage);
