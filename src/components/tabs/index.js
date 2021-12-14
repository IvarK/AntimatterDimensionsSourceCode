// Temporarily aggregate tab components here until GameUI is migrated to SFC
import AntimatterDimensionsTab from "./antimatter-dimensions/AntimatterDimensionsTab";
import OptionsGameplayTab from "./options-gameplay/OptionsGameplayTab";
import OptionsSavingTab from "./options-saving/OptionsSavingTab";
import OptionsVisualTab from "./options-visual/OptionsVisualTab";
import StatisticsTab from "./statistics/StatisticsTab";
import ChallengeRecordsTab from "./challenge-records/ChallengeRecordsTab";
import PastPrestigeRunsTab from "./past-prestige-runs/PastPrestigeRunsTab";
import GlyphSetRecordsTab from "./glyph-set-records/GlyphSetRecordsTab";
import NormalAchievementsTab from "./normal-achievements/NormalAchievementsTab";
import SecretAchievementTab from "./secret-achievements/SecretAchievementTab";

const TabComponents = {
  AntimatterDimensionsTab,
  OptionsSavingTab,
  OptionsVisualTab,
  OptionsGameplayTab,
  StatisticsTab,
  ChallengeRecordsTab,
  PastPrestigeRunsTab,
  GlyphSetRecordsTab,
  NormalAchievementsTab,
  SecretAchievementTab
};

export default TabComponents;
