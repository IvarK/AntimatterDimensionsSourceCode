Vue.component("infinity-challenges-tab", {
  components: {
    "infinity-challenge-box": {
      props: {
        challengeId: Number
      },
      data: function() {
        return {
          isHidden: false,
          isRunning: false,
          isCompleted: false
        };
      },
      computed: {
        fullId: function() {
          return `postc${this.challengeId}`;
        },
        details: function() {
          return infinityChallengeDetails[this.challengeId];
        },
        classObject: function() {
          return {
            "c-challenge-box--infinity": true,
            "c-challenge-box--hidden": this.isHidden
          };
        }
      },
      methods: {
        update() {
          const id = this.fullId;
          this.isHidden = player.postChallUnlocked < this.challengeId;
          this.isRunning = player.currentChallenge === id;
          this.isCompleted = player.challenges.includes(id);
        },
        start() {
          startChallenge(this.fullId, this.details.goal);
        }
      },
      template:
        `<challenge-box
          :isUnlocked="true"
          :isRunning="isRunning"
          :isCompleted="isCompleted"
          :class="classObject"
          @start="start"
        >
          <span slot="top">{{details.description}}</span>
          <template slot="bottom">
            <span>Goal: {{shortenCosts(details.goal)}}</span>
            <span>Reward: {{details.reward}}</span>
          </template>
        </challenge-box>`
    }
  },
  data: function(){
    return {
      hasChallengesToUnlock: false,
      nextAt: new Decimal(0)
    };
  },
  methods: {
    update() {
      const hasChallengesToUnlock = nextAt[player.postChallUnlocked] !== undefined;
      this.hasChallengesToUnlock = hasChallengesToUnlock;
      if (hasChallengesToUnlock) {
        this.nextAt.copyFrom(nextAt[player.postChallUnlocked]);
      }
    }
  },
  template:
    `<div>
      <div v-if="hasChallengesToUnlock">Next challenge unlocks at {{shortenCosts(nextAt)}} antimatter.</div>
      <challenge-grid :count="8">
        <infinity-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
      </challenge-grid>
    </div>`
});

const infinityChallengeDetails = [
  null,
  {
    description: "All previous challenges (except tickspeed challenge and automatic big crunch challenge) at once.",
    goal: new Decimal('1e850'),
    reward: "1.3x on all Infinity Dimensions for each Infinity Challenge completed"
  },
  {
    description: "Automatically sacrifice every 8 ticks once you have 8th Dimension.",
    goal: new Decimal('1e10500'),
    reward: "Sacrifice autobuyer and more powerful sacrifice"
  },
  {
    description: "Tickspeed interval decrease is always at 0%, but every tickspeed purchase you get a static multiplier on all dimensions (increases with Antimatter Galaxies).",
    goal: new Decimal('1e5000'),
    reward: "Static multiplier on each tickspeed purchase based on Antimatter Galaxies"
  },
  {
    description: "Only latest bought dimension production is normal, all other dimensions produce less.",
    goal: new Decimal('1e13000'),
    reward: "All normal dimension multipliers become multiplier^1.05"
  },
  {
    description: "When buying dimensions 1-4, everything with costs smaller or equal increases. When buying dimensions 5-8, everything with costs bigger or equal increases. When buying tickspeed, everything with the same cost increases.",
    goal: new Decimal('1e11111'),
    reward: "Galaxies are 10% more powerful and reduce the requirements for them and dimensional boosts by 1"
  },
  {
    description: "Once you have at least 1 second dimension, there's an exponentially rising matter that divides the multiplier on all of your dimensions.",
    goal: new Decimal('2e22222'),
    reward: "Tickspeed affects Infinity Dimensions with reduced effect"
  },
  {
    description: "You can't get Antimatter Galaxies, but dimensional boost multiplier 2.5x -> 10x",
    goal: new Decimal('1e10000'),
    reward: "Dimensional boost multiplier 2.5x -> 4x"
  },
  {
    description: "Your production is at 100% after purchasing anything, after that it rapidly drops down.",
    goal: new Decimal('1e27000'),
    reward: "You get a multiplier to dimensions 2-7 based on 1st and 8th dimension multipliers."
  },
];