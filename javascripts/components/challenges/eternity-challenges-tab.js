Vue.component("eternity-challenges-tab", {
  components: {
    "eternity-challenge-box": {
      props: {
        challengeId: Number
      },
      data: function() {
        return {
          description: String.empty,
          isUnlocked: false,
          isRunning: false,
          isCompleted: false,
          completions: 0,
          rewardValue: new Decimal(0),
          nextRewardValue: new Decimal(0)
        };
      },
      computed: {
        fullId: function() {
          return EternityChallenge(this.challengeId).fullId;
        },
        visuals: function() {
          return eternityChallengeVisuals[this.challengeId];
        },
        completionDisplay: function() {
          const completions = this.completions;
          return `Completed ${completions} ${(completions === 1) ? "time" : "times"}.`;
        },
        goalDisplay: function() {
          let additionalRequirements = String.empty;
          const visuals = this.visuals;
          if (visuals.additionalRequirements) {
            additionalRequirements += ` ${visuals.additionalRequirements(this.completions)}`;
          }
          const goal = this.shortenCosts(EternityChallenge(this.challengeId).goalAtCompletions(this.completions));
          return `Goal: ${goal} IP${additionalRequirements}`;
        },
        rewardValueDisplay: function() {
          const parts = [];
          const formatReward = this.visuals.formatReward;
          const shortenMoney = this.shortenMoney;
          const template = this.visuals.rewardValueTemplate;
          if (this.completions > 0) {
            const rewardValue = formatReward(this.rewardValue, shortenMoney);
            parts.push(`Currently: ${template.replace("{0}", rewardValue)}`);
          }
          if (this.completions < TIERS_PER_EC) {
            const nextRewardValue = formatReward(this.nextRewardValue, shortenMoney);
            parts.push(`Next: ${template.replace("{0}", nextRewardValue)}`);
          }
          return parts.join(" => ");
        },
        name: function() {
          return `EC${this.challengeId}`;
        },
        rewardStyleObject: function() {
          const override = this.visuals.fontSizeOverride;
          if (!override) return undefined;
          return {
            "font-size": override
          };
        }
      },
      methods: {
        update() {
          const visuals = this.visuals;
          if (typeof visuals.description === "function") {
            this.description = visuals.description(this.shortenMoney);
          }
          else {
            this.description = visuals.description;
          }
          const challenge = EternityChallenge(this.challengeId);
          this.isUnlocked = challenge.isUnlocked;
          this.isRunning = challenge.isRunning;
          this.isCompleted = challenge.isFullyCompleted;
          const completions = challenge.completions;
          this.completions = completions;
          if (completions > 0) {
            this.rewardValue.copyFrom(new Decimal(challenge.rewardValue));
          }
          if (completions < TIERS_PER_EC) {
            this.nextRewardValue.copyFrom(new Decimal(challenge.nextRewardValue));
          }
        },
        start() {
          EternityChallenge(this.challengeId).start();
        }
      },
      template:
        `<challenge-box
          :name="name"
          :isUnlocked="isUnlocked"
          :isRunning="isRunning"
          :isCompleted="isCompleted"
          class="c-challenge-box--eternity"
          @start="start"
        >
          <span slot="top">{{description}}</span>
          <template slot="bottom">
            <div class="c-challenge-box__spacer">
              <span v-if="completions < 5">{{completionDisplay}}</span>
              <br>
              <span v-if="completions < 5">{{goalDisplay}}</span>
            </div>
            <span :style="rewardStyleObject">Reward: {{visuals.reward}}</span>
            <span>{{rewardValueDisplay}}</span>
          </template>
        </challenge-box>`
    }
  },
  data: function() {
    return {
      unlockedCount: 0
    };
  },
  methods: {
    update() {
      this.unlockedCount = [...Array(12).keys()]
        .filter(id => this.isChallengeVisible(id + 1))
        .length;
    },
    isChallengeVisible: function(id) {
      const challenge = EternityChallenge(id);
      return challenge.completions > 0 || challenge.isUnlocked;
    }
  },
  template:
    `<div>
      <div>Complete Eternity Challenges again for a bigger reward, maximum of 5 times.</div>
      <div>(You have unlocked {{unlockedCount}} out of 12 Eternity Challenges)</div>
      <challenge-grid :count="12" :isChallengeVisible="isChallengeVisible">
        <eternity-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
      </challenge-grid>
    </div>`
});

// Keep `reward` under 55 symbols, avoid overriding font size
const eternityChallengeVisuals = [
  null,
  {
    /* EC1 */
    description: "Time Dimensions are disabled.",
    reward: "Time Dimension multiplier based on time spent this Eternity",
    rewardValueTemplate: "{0}x",
    formatReward: (reward, shortenMoney) => shortenMoney(reward),
    fontSizeOverride: ".85rem"
  },
  {
    /* EC2 */
    description: "Infinity Dimensions are disabled.",
    reward: "1st Infinity Dimension multiplier based on Infinity Power",
    rewardValueTemplate: "{0}x",
    formatReward: (reward, shortenMoney) => shortenMoney(reward),
    fontSizeOverride: ".88rem"
  },
  {
    /* EC3 */
    description: "Dimensions 5-8 don't produce anything. Dimensional sacrifice is disabled.",
    reward: "Increase the multiplier for buying 10 dimensions",
    rewardValueTemplate: "{0}x",
    formatReward: reward => reward.toFixed(2)
  },
  {
    /* EC4 */
    description: "All infinitied stat multipliers and generators are disabled.",
    reward: "Infinity Dimension multiplier based on unspent IP",
    additionalRequirements: completions => `in ${Math.max((16 - 4 * completions), 0)} infinities or less`,
    rewardValueTemplate: "{0}x",
    formatReward: (reward, shortenMoney) => shortenMoney(reward)
  },
  {
    /* EC5 */
    description: "Galaxy cost increase scaling starts instantly (normally at 100 galaxies). Dimension Boost costs scaling is massively increased.",
    reward: "Galaxy cost scaling starts later",
    rewardValueTemplate: "{0} galaxies later",
    formatReward: reward => reward.toString()
  },
  {
    /* EC6 */
    description: "You can't gain Antimatter Galaxies normally, but the cost of upgrading your max Replicanti galaxies is massively reduced.",
    reward: "Reduce the dimension cost multiplier growth",
    rewardValueTemplate: "x - {0}",
    formatReward: reward => reward.toFixed(1)
  },
  {
    /* EC7 */
    description: "1st Time Dimension produces 8th Infinity Dimension, and 1st Infinity Dimension produces 7th Dimensions. Tickspeed affects all dimensions normally.",
    reward: "1st Time Dimension produces 8th Infinity Dimensions",
    rewardValueTemplate: "{0} per second",
    formatReward: (reward, shortenMoney) => shortenMoney(reward)
  },
  {
    /* EC8 */
    description: "You can only upgrade Infinity Dimensions 50 times and Replicanti upgrades 40 times. Infinity Dimension and Replicanti upgrade autobuyers are disabled.",
    reward: "Infinity Power powers up Replicanti galaxies",
    rewardValueTemplate: "{0}%",
    formatReward: reward => (reward * 100).toFixed(2)
  },
  {
    /* EC9 */
    description: "You can't buy tickspeed upgrades. Infinity power instead multiplies time dimensions with greatly reduced effect.",
    reward: "Infinity Dimension multiplier based on time shards",
    rewardValueTemplate: "{0}x",
    formatReward: (reward, shortenMoney) => shortenMoney(reward)
  },
  {
    /* EC10 */
    description: function(shortenMoney) {
      let description = "Time Dimensions and Infinity Dimensions are disabled. You gain an immense boost from infinitied stat to normal dimensions (infinitied^1000).";
      if (EternityChallenge(10).isRunning) {
        description += `, Currently: ${shortenMoney(ec10bonus)}x`;
      }
      return description;
    },
    reward: "Time Dimension multiplier based on infinitied stat",
    rewardValueTemplate: "{0}x",
    formatReward: (reward, shortenMoney) => shortenMoney((player.timestudy.studies.includes(31) ? reward.pow(4) : reward))
  },
  {
    /* EC11 */
    description: "All dimension multipliers are disabled except for the multipliers from Infinity Power and Dimension Boosts (to normal dimensions).",
    reward: "Reduce Tickspeed cost multiplier growth",
    rewardValueTemplate: "x - {0}",
    formatReward: reward => reward.toFixed(1)
  },
  {
    /* EC12 */
    description: () => player.realities > 0 ? "The game runs 1000x slower; wormholes and time glyph effects are disabled." : "The game runs 1000x slower.",
    reward: "Infinity Dimension cost multipliers are reduced",
    additionalRequirements: completions => `in ${Math.max(10 - 2 * completions, 1) / 10} ${completions === 0 ? "second" : "seconds"} or less.`,
    rewardValueTemplate: "x^{0}",
    formatReward: reward => reward.toString()
  }
];
