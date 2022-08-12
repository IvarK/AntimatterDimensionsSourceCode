import CloudLoadConflictModal from "@/components/modals/cloud/CloudLoadConflictModal";
import CloudSaveConflictModal from "@/components/modals/cloud/CloudSaveConflictModal";
import EternityChallengeStartModal from "@/components/modals/challenges/EternityChallengeStartModal";
import InfinityChallengeStartModal from "@/components/modals/challenges/InfinityChallengeStartModal";
import MessageModal from "@/components/modals/MessageModal";
import NormalChallengeStartModal from "@/components/modals/challenges/NormalChallengeStartModal";

import AntimatterGalaxyModal from "@/components/modals/prestige/AntimatterGalaxyModal";
import ArmageddonModal from "@/components/modals/prestige/ArmageddonModal";
import BigCrunchModal from "@/components/modals/prestige/BigCrunchModal";
import ChangeNameModal from "@/components/modals/ChangeNameModal";
import DimensionBoostModal from "@/components/modals/prestige/DimensionBoostModal";
import EnterCelestialsModal from "@/components/modals/prestige/EnterCelestialsModal";
import EnterDilationModal from "@/components/modals/prestige/EnterDilationModal";
import EternityModal from "@/components/modals/prestige/EternityModal";
import ExitCelestialModal from "@/components/modals/prestige/ExitCelestialModal";
import HardResetModal from "@/components/modals/prestige/HardResetModal";
import RealityModal from "@/components/modals/prestige/RealityModal";
import ReplicantiGalaxyModal from "@/components/modals/prestige/ReplicantiGalaxyModal";
import ResetRealityModal from "@/components/modals/prestige/ResetRealityModal";
import SpeedrunModeModal from "@/components/modals/SpeedrunModeModal";

import AnimationOptionsModal from "@/components/modals/options/AnimationOptionsModal";
import AwayProgressOptionsModal from "@/components/modals/options/AwayProgressOptionsModal";
import ConfirmationOptionsModal from "@/components/modals/options/ConfirmationOptionsModal";
import HiddenTabsModal from "@/components/modals/options/hidden-tabs/HiddenTabsModal";
import HotkeysModal from "@/components/modals/options/HotkeysModal";
import InfoDisplayOptionsModal from "@/components/modals/options/InfoDisplayOptionsModal";
import NewsOptionsModal from "@/components/modals/options/NewsOptionsModal";
import PreferredTreeModal from "@/components/modals/options/PreferredTreeModal";

import DeleteCompanionGlyphModal from "@/components/modals/glyph-management/DeleteCompanionGlyphModal";
import DeleteGlyphModal from "@/components/modals/glyph-management/DeleteGlyphModal";
import PurgeAllRejectedGlyphsModal from "@/components/modals/glyph-management/PurgeAllRejectedGlyphsModal";
import PurgeAllUnprotectedGlyphsModal from "@/components/modals/glyph-management/PurgeAllUnprotectedGlyphsModal";
import PurgeGlyphModal from "@/components/modals/glyph-management/PurgeGlyphModal";
import RefineGlyphModal from "@/components/modals/glyph-management/RefineGlyphModal";
import SacrificeGlyphModal from "@/components/modals/glyph-management/SacrificeGlyphModal";

import AutomatorScriptTemplate from "@/components/modals/AutomatorScriptTemplate";
import AwayProgressModal from "@/components/modals/AwayProgressModal";
import BreakInfinityModal from "@/components/modals/BreakInfinityModal";
import CatchupModal from "@/components/modals/catchup/CatchupModal";
import ChangelogModal from "@/components/modals/ChangelogModal";
import CreditsModal from "@/components/modals/CreditsModal";
import DeleteAutomatorScriptModal from "@/components/modals/DeleteAutomatorScriptModal";
import EnslavedHintsModal from "@/components/modals/EnslavedHintsModal";
import GlyphSetSaveDeleteModal from "@/components/modals/GlyphSetSaveDeleteModal";
import GlyphShowcasePanelModal from "@/components/modals/GlyphShowcasePanelModal";
import H2PModal from "@/components/modals/H2PModal";
import ImportAutomatorScriptModal from "@/components/modals/ImportAutomatorScriptModal";
import ImportSaveModal from "@/components/modals/ImportSaveModal";
import InformationModal from "@/components/modals/InformationModal";
import LoadGameModal from "@/components/modals/LoadGameModal";
import PelleEffectsModal from "@/components/modals/PelleEffectsModal";
import RealityGlyphCreationModal from "@/components/modals/RealityGlyphCreationModal";
import ReplaceGlyphModal from "@/components/modals/ReplaceGlyphModal";
import SacrificeModal from "@/components/modals/SacrificeModal";
import SingularityMilestonesModal from "@/components/modals/SingularityMilestonesModal";
import StdStoreModal from "@/components/modals/StdStoreModal";
import StudyStringModal from "@/components/modals/StudyStringModal";
import SwitchAutomatorEditorModal from "@/components/modals/SwitchAutomatorEditorModal";
import UiChoiceModal from "@/components/modals/UiChoiceModal";
import UndoGlyphModal from "@/components/modals/UndoGlyphModal";

let nextModalID = 0;
export class Modal {
  constructor(component, priority = 0, closeEvent) {
    this._component = component;
    this._modalConfig = {};
    this._priority = priority;
    this._closeEvent = closeEvent;
  }

  // We can't handle this in the Vue components because if the modal order changes, all the event listeners from the
  // top modal end up getting removed from the EventHub due to the component being temporarily destroyed. This could
  // result in the component sticking around because an event it was listening for happened while it wasn't on top.
  applyCloseListeners(closeEvent) {
    // Most of the time the close event will be a prestige event, in which case we want it to trigger on all higher
    // prestiges as well
    const prestigeOrder = [GAME_EVENT.DIMBOOST_AFTER, GAME_EVENT.GALAXY_RESET_AFTER, GAME_EVENT.BIG_CRUNCH_AFTER,
      GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.REALITY_RESET_AFTER];
    let shouldClose = false;
    for (const prestige of prestigeOrder) {
      if (prestige === closeEvent) shouldClose = true;
      if (shouldClose) EventHub.ui.on(prestige, () => this.removeFromQueue(), this._component);
    }

    // In a few cases we want to trigger a close based on a non-prestige event, so if the specified event wasn't in
    // the prestige array above, we just add it on its own
    if (!shouldClose) EventHub.ui.on(closeEvent, () => this.removeFromQueue(), this._component);
  }

  show(modalConfig) {
    if (!GameUI.initialized) return;
    this._uniqueID = nextModalID++;
    this._props = Object.assign({}, modalConfig || {});
    if (this._closeEvent) this.applyCloseListeners(this._closeEvent);

    const modalQueue = ui.view.modal.queue;
    // Add this modal to the front of the queue and sort based on priority to ensure priority is maintained.
    modalQueue.unshift(this);
    Modal.sortModalQueue();
  }

  get isOpen() {
    return ui.view.modal.current === this;
  }

  get component() {
    return this._component;
  }

  get props() {
    return this._props;
  }

  get priority() {
    return this._priority;
  }

  removeFromQueue() {
    EventHub.ui.offAll(this._component);
    ui.view.modal.queue = ui.view.modal.queue.filter(m => m._uniqueID !== this._uniqueID);
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined;
    else ui.view.modal.current = ui.view.modal.queue[0];
  }

  static sortModalQueue() {
    const modalQueue = ui.view.modal.queue;
    modalQueue.sort((x, y) => y.priority - x.priority);
    // Filter out multiple instances of the same modal.
    const singleQueue = [...new Set(modalQueue)];
    ui.view.modal.queue = singleQueue;
    ui.view.modal.current = singleQueue[0];
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
    while (ui.view.modal.queue.length) {
      if (ui.view.modal.queue[0].hide) {
        ui.view.modal.queue[0].hide();
      } else {
        Modal.hide();
      }
    }
    ui.view.modal.current = undefined;
  }

  static get isOpen() {
    return ui.view.modal.current instanceof this;
  }
}

class ChallengeConfirmationModal extends Modal {
  show(id) {
    super.show({ id });
  }
}

class TimeModal extends Modal {
  show(diff) {
    super.show({ diff });
  }
}

// If a new modal which can be shown in the same queue multiple times needs to be added
// Additional code needs to be written to account for that

Modal.startEternityChallenge = new ChallengeConfirmationModal(EternityChallengeStartModal);
Modal.startInfinityChallenge = new ChallengeConfirmationModal(InfinityChallengeStartModal);
Modal.startNormalChallenge = new ChallengeConfirmationModal(NormalChallengeStartModal);

Modal.catchup = new TimeModal(CatchupModal, -1);

Modal.dimensionBoost = new Modal(DimensionBoostModal, 1, GAME_EVENT.DIMBOOST_AFTER);

Modal.antimatterGalaxy = new Modal(AntimatterGalaxyModal, 1, GAME_EVENT.GALAXY_RESET_AFTER);
Modal.bigCrunch = new Modal(BigCrunchModal, 1, GAME_EVENT.BIG_CRUNCH_AFTER);
Modal.replicantiGalaxy = new Modal(ReplicantiGalaxyModal, 1, GAME_EVENT.ETERNITY_RESET_AFTER);
Modal.eternity = new Modal(EternityModal, 1, GAME_EVENT.ETERNITY_RESET_AFTER);
Modal.enterDilation = new Modal(EnterDilationModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.reality = new Modal(RealityModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.resetReality = new Modal(ResetRealityModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.exitCelestialReality = new Modal(ExitCelestialModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.celestials = new Modal(EnterCelestialsModal, 1);
Modal.hardReset = new Modal(HardResetModal, 1);
Modal.enterSpeedrun = new Modal(SpeedrunModeModal);
Modal.changeName = new Modal(ChangeNameModal);
Modal.armageddon = new Modal(ArmageddonModal, 1);

Modal.confirmationOptions = new Modal(ConfirmationOptionsModal);
Modal.infoDisplayOptions = new Modal(InfoDisplayOptionsModal);
Modal.awayProgressOptions = new Modal(AwayProgressOptionsModal);
Modal.hotkeys = new Modal(HotkeysModal);
Modal.newsOptions = new Modal(NewsOptionsModal);
Modal.animationOptions = new Modal(AnimationOptionsModal);
Modal.hiddenTabs = new Modal(HiddenTabsModal);
Modal.preferredTree = new Modal(PreferredTreeModal);

Modal.deleteCompanion = new Modal(DeleteCompanionGlyphModal, 1);
Modal.glyphDelete = new Modal(DeleteGlyphModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.glyphPurge = new Modal(PurgeGlyphModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.glyphSacrifice = new Modal(SacrificeGlyphModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.glyphRefine = new Modal(RefineGlyphModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.deleteAllUnprotectedGlyphs = new Modal(PurgeAllUnprotectedGlyphsModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.deleteAllRejectedGlyphs = new Modal(PurgeAllRejectedGlyphsModal, 1, GAME_EVENT.GLYPHS_CHANGED);

Modal.glyphShowcasePanel = new Modal(GlyphShowcasePanelModal);
Modal.glyphUndo = new Modal(UndoGlyphModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.glyphReplace = new Modal(ReplaceGlyphModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.enslavedHints = new Modal(EnslavedHintsModal);
Modal.realityGlyph = new Modal(RealityGlyphCreationModal);
Modal.glyphSetSaveDelete = new Modal(GlyphSetSaveDeleteModal);
Modal.uiChoice = new Modal(UiChoiceModal);
Modal.h2p = new Modal(H2PModal);
Modal.information = new Modal(InformationModal);
Modal.credits = new Modal(CreditsModal, 1);
Modal.changelog = new Modal(ChangelogModal, 1);
Modal.awayProgress = new Modal(AwayProgressModal);
Modal.loadGame = new Modal(LoadGameModal);
Modal.import = new Modal(ImportSaveModal);
Modal.importScript = new Modal(ImportAutomatorScriptModal);
Modal.automatorScriptDelete = new Modal(DeleteAutomatorScriptModal);
Modal.automatorScriptTemplate = new Modal(AutomatorScriptTemplate);
Modal.switchAutomatorEditorMode = new Modal(SwitchAutomatorEditorModal);
Modal.shop = new Modal(StdStoreModal);
Modal.studyString = new Modal(StudyStringModal);
Modal.singularityMilestones = new Modal(SingularityMilestonesModal);
Modal.pelleEffects = new Modal(PelleEffectsModal);
Modal.sacrifice = new Modal(SacrificeModal, 1, GAME_EVENT.DIMBOOST_AFTER);
Modal.breakInfinity = new Modal(BreakInfinityModal, 1, GAME_EVENT.ETERNITY_RESET_AFTER);

Modal.cloudSaveConflict = new Modal(CloudSaveConflictModal);
Modal.cloudLoadConflict = new Modal(CloudLoadConflictModal);
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
  show(text, props = {}, messagePriority = 0) {
    if (!GameUI.initialized) return;
    // It might be zero, so explicitly check for undefined
    if (this.currPriority === undefined) this.currPriority = messagePriority;
    else if (messagePriority < this.currPriority) return;

    super.show();
    this.message = text;
    this.callback = props.callback;
    this.closeButton = props.closeButton ?? false;
    EventHub.ui.offAll(this._component);
    if (props.closeEvent) this.applyCloseListeners(props.closeEvent);

    // TODO: remove this console.log
    // eslint-disable-next-line no-console
    console.log(`Modal message: ${text}`);
  }

  hide() {
    EventHub.ui.offAll(this._component);
    this.currPriority = undefined;
    Modal.hide();
  }
}(MessageModal, 2);