"use strict";

class EternityChallengeReset extends BaseEternityReset {
  get goal() {
    return EternityChallenge.isRunning ? EternityChallenge.current.currentGoal : super.goal;
  }

  get confirmationOption() {
    return player.options.confirmations.challenges;
  }

  set confirmationOption(value) {
    player.options.confirmations.challenges = value;
  }

  confirmation(props) {
    Modal.eternity.show(props);
  }

  tabChange() {
    if (!this.isEarlyGame) return;
    Tab.challenges.eternity.show();
  }

  gain() {
    const challenge = EternityChallenge.current;
    challenge.addCompletion();
    if (Perk.studyECBulk.isBought) {
      let completionCount = 0;
      while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
        challenge.addCompletion();
        completionCount++;
      }
      AutomatorData.lastECCompletionCount = completionCount;
      if (Enslaved.isRunning && completionCount > 5) EnslavedProgress.ec1.giveProgress();
    }
    player.etercreq = 0;
    super.gain();
  }

  reset() {
    respecTimeStudies();
    player.respec = false;
    player.challenge.eternity.current = 0;
    super.reset();
  }
}

Reset.enterEternityChallenge = new BaseEternityReset();

Reset.exitEternityChallenge = new EternityChallengeReset();
