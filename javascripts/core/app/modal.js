import MessageModal from "@/components/modals/MessageModal";
import CelestialQuoteModal from "@/components/modals/CelestialQuoteModal";
import CloudSaveConflictModal from "@/components/modals/cloud/CloudSaveConflictModal";
import CloudLoadConflictModal from "@/components/modals/cloud/CloudLoadConflictModal";
import EternityChallengeStartModal from "@/components/modals/challenges/EternityChallengeStartModal";
import InfinityChallengeStartModal from "@/components/modals/challenges/InfinityChallengeStartModal";
import NormalChallengeStartModal from "@/components/modals/challenges/NormalChallengeStartModal";

import DimensionBoostModal from "@/components/modals/prestige/DimensionBoostModal";
import AntimatterGalaxyModal from "@/components/modals/prestige/AntimatterGalaxyModal";
import BigCrunchModal from "@/components/modals/prestige/BigCrunchModal";
import ReplicantiGalaxyModal from "@/components/modals/prestige/ReplicantiGalaxyModal";
import EternityModal from "@/components/modals/prestige/EternityModal";
import EnterDilationModal from "@/components/modals/prestige/EnterDilationModal";
import RealityModal from "@/components/modals/prestige/RealityModal";
import ResetRealityModal from "@/components/modals/prestige/ResetRealityModal";
import ExitCelestialModal from "@/components/modals/prestige/ExitCelestialModal";
import EnterCelestialsModal from "@/components/modals/prestige/EnterCelestialsModal";
import HardResetModal from "@/components/modals/prestige/HardResetModal";
import SpeedrunModeModal from "@/components/modals/SpeedrunModeModal";
import ChangeNameModal from "@/components/modals/ChangeNameModal";

import ConfirmationOptionsModal from "@/components/modals/options/ConfirmationOptionsModal";
import InfoDisplayOptionsModal from "@/components/modals/options/InfoDisplayOptionsModal";
import AwayProgressOptionsModal from "@/components/modals/options/AwayProgressOptionsModal";
import HotkeysModal from "@/components/modals/options/HotkeysModal";
import NewsOptionsModal from "@/components/modals/options/NewsOptionsModal";
import AnimationOptionsModal from "@/components/modals/options/AnimationOptionsModal";
import PreferredTreeModal from "@/components/modals/options/PreferredTreeModal";
import HiddenTabsModal from "@/components/modals/options/hidden-tabs/HiddenTabsModal";

import DeleteCompanionGlyphModal from "@/components/modals/glyph-management/DeleteCompanionGlyphModal";
import DeleteGlyphModal from "@/components/modals/glyph-management/DeleteGlyphModal";
import PurgeGlyphModal from "@/components/modals/glyph-management/PurgeGlyphModal";
import SacrificeGlyphModal from "@/components/modals/glyph-management/SacrificeGlyphModal";
import RefineGlyphModal from "@/components/modals/glyph-management/RefineGlyphModal";
import PurgeAllUnprotectedGlyphsModal from "@/components/modals/glyph-management/PurgeAllUnprotectedGlyphsModal";
import PurgeAllRejectedGlyphsModal from "@/components/modals/glyph-management/PurgeAllRejectedGlyphsModal";

import H2PModal from "@/components/modals/H2PModal";
import GlyphShowcasePanelModal from "@/components/modals/GlyphShowcasePanelModal";
import UndoGlyphModal from "@/components/modals/UndoGlyphModal";
import ReplaceGlyphModal from "@/components/modals/ReplaceGlyphModal";
import UiChoiceModal from "@/components/modals/UiChoiceModal";
import AwayProgressModal from "@/components/modals/AwayProgressModal";
import LoadGameModal from "@/components/modals/LoadGameModal";
import ImportSaveModal from "@/components/modals/ImportSaveModal";
import ImportAutomatorScriptModal from "@/components/modals/ImportAutomatorScriptModal";
import DeleteAutomatorScriptModal from "@/components/modals/DeleteAutomatorScriptModal";
import AutomatorScriptTemplate from "@/components/modals/AutomatorScriptTemplate";
import StdStoreModal from "@/components/modals/StdStoreModal";
import StudyStringModal from "@/components/modals/StudyStringModal";
import SacrificeModal from "@/components/modals/SacrificeModal";
import BreakInfinityModal from "@/components/modals/BreakInfinityModal";
import GlyphSetSaveDeleteModal from "@/components/modals/GlyphSetSaveDeleteModal";
import RealityGlyphCreationModal from "@/components/modals/RealityGlyphCreationModal";
import EnslavedHintsModal from "@/components/modals/EnslavedHintsModal";
import SingularityMilestonesModal from "@/components/modals/SingularityMilestonesModal";


export class Modal {
  constructor(component, bare = false) {
    this._component = component;
    this._bare = bare;
    this._modalConfig = {};
    this.canRepeat = false;
  }

  show(modalConfig) {
    if (!GameUI.initialized) return;
    this._props = Object.assign({}, modalConfig || {});
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = this;
    // New modals go to the back of the queue (shown last).
    if (!ui.view.modal.queue.includes(this) || this.canRepeat) ui.view.modal.queue.push(this);
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

  setAsRepeatable() {
    this.canRepeat = true;
    return this;
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

Modal.startEternityChallenge = new ChallengeConfirmationModal(EternityChallengeStartModal);
Modal.startInfinityChallenge = new ChallengeConfirmationModal(InfinityChallengeStartModal);
Modal.startNormalChallenge = new ChallengeConfirmationModal(NormalChallengeStartModal);

Modal.dimensionBoost = new Modal(DimensionBoostModal);
Modal.antimatterGalaxy = new Modal(AntimatterGalaxyModal);
Modal.bigCrunch = new Modal(BigCrunchModal);
Modal.replicantiGalaxy = new Modal(ReplicantiGalaxyModal);
Modal.eternity = new Modal(EternityModal);
Modal.enterDilation = new Modal(EnterDilationModal);
Modal.reality = new Modal(RealityModal);
Modal.resetReality = new Modal(ResetRealityModal);
Modal.exitCelestialReality = new Modal(ExitCelestialModal);
Modal.celestials = new Modal(EnterCelestialsModal);
Modal.hardReset = new Modal(HardResetModal);
Modal.enterSpeedrun = new Modal(SpeedrunModeModal);
Modal.changeName = new Modal(ChangeNameModal);

Modal.confirmationOptions = new Modal(ConfirmationOptionsModal);
Modal.infoDisplayOptions = new Modal(InfoDisplayOptionsModal);
Modal.awayProgressOptions = new Modal(AwayProgressOptionsModal);
Modal.hotkeys = new Modal(HotkeysModal);
Modal.newsOptions = new Modal(NewsOptionsModal);
Modal.animationOptions = new Modal(AnimationOptionsModal);
Modal.hiddenTabs = new Modal(HiddenTabsModal);
Modal.preferredTree = new Modal(PreferredTreeModal);

Modal.deleteCompanion = new Modal(DeleteCompanionGlyphModal);
Modal.glyphDelete = new Modal(DeleteGlyphModal);
Modal.glyphPurge = new Modal(PurgeGlyphModal);
Modal.glyphSacrifice = new Modal(SacrificeGlyphModal);
Modal.glyphRefine = new Modal(RefineGlyphModal);
Modal.deleteAllUnprotectedGlyphs = new Modal(PurgeAllUnprotectedGlyphsModal);
Modal.deleteAllRejectedGlyphs = new Modal(PurgeAllRejectedGlyphsModal);

Modal.glyphShowcasePanel = new Modal(GlyphShowcasePanelModal);
Modal.glyphUndo = new Modal(UndoGlyphModal);
Modal.glyphReplace = new Modal(ReplaceGlyphModal);
Modal.enslavedHints = new Modal(EnslavedHintsModal);
Modal.realityGlyph = new Modal(RealityGlyphCreationModal);
Modal.glyphSetSaveDelete = new Modal(GlyphSetSaveDeleteModal);
Modal.uiChoice = new Modal(UiChoiceModal);
Modal.h2p = new Modal(H2PModal);
Modal.awayProgress = new Modal(AwayProgressModal);
Modal.loadGame = new Modal(LoadGameModal);
Modal.import = new Modal(ImportSaveModal);
Modal.importScript = new Modal(ImportAutomatorScriptModal);
Modal.automatorScriptDelete = new Modal(DeleteAutomatorScriptModal);
Modal.automatorScriptTemplate = new Modal(AutomatorScriptTemplate);
Modal.shop = new Modal(StdStoreModal);
Modal.studyString = new Modal(StudyStringModal);
Modal.singularityMilestones = new Modal(SingularityMilestonesModal);
Modal.sacrifice = new Modal(SacrificeModal);
Modal.breakInfinity = new Modal(BreakInfinityModal);
Modal.celestialQuote = new class extends Modal {
  show(celestial, lines) {
    if (!GameUI.initialized) return;
    const newLines = lines.map(l => ({
      celestial,
      line: l,
      showName: !l.startsWith("*")
    }));
    if (ui.view.modal.queue.includes(this)) {
      // This shouldn't come up often, but in case we do have a pile of quotes
      // being shown in a row:
      this.lines = this.lines.concat(newLines);
      return;
    }
    super.show();
    this.lines = newLines;
  }
}(CelestialQuoteModal, true);

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
}(MessageModal).setAsRepeatable();
