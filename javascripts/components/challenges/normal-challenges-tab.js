Vue.component("normal-challenges-tab", {
  components: {
    "normal-challenge-box": {
      props: {
        challengeId: Number
      },
      data: function() {
        return {
          isRunning: false,
          isCompleted: false,
        };
      },
      computed: {
        fullId: function() {
          // Hevi, I'll murder you one day.
          const actualChallengeIds = [ null, 1, 2, 3, 8, 6, 10, 9, 11, 5, 4, 12, 7 ];
          const actualId = actualChallengeIds[this.challengeId];
          return `challenge${actualId}`;
        },
        details: function() {
          return normalChallengeDetails[this.challengeId];
        }
      },
      methods: {
        update() {
          const id = this.fullId;
          this.isRunning = player.currentChallenge === id;
          this.isCompleted = player.challenges.includes(id);
        },
        start() {
          startChallenge(this.fullId);
        }
      },
      template:
        `<challenge-box
          :isUnlocked="true"
          :isRunning="isRunning"
          :isCompleted="isCompleted"
          class="c-challenge-box--normal"
          @start="start"
        >
          <span slot="top">{{details.description}}</span>
          <span slot="bottom">Reward: {{details.reward}}</span>
        </challenge-box>`
    }
  },
  template:
    `<challenge-grid :count="12">
      <normal-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
    </challenge-grid>`
});

const normalChallengeDetails = [
  null,
  {
    description: "Reach infinity for the first time.",
    reward: "First Dimension autobuyer"
  },
  {
    description: "Buying anything halts your production, gradually coming back over 3 minutes.",
    reward: "Second Dimension autobuyer"
  },
  {
    description: "First dimension is heavily weakened but gets an exponentially increasing bonus that resets on reset.",
    reward: "Third Dimension autobuyer"
  },
  {
    description: "Buying a dimension automatically erases all lower tier dimensions, like a sacrifice without the boost.",
    reward: "Fourth Dimension autobuyer"
  },
  {
    description: "Tickspeed starts at 7%",
    reward: "Fifth Dimension autobuyer"
  },
  {
    description: "Each dimension costs the dimension 2 before it, with modified prices.",
    reward: "Sixth Dimension autobuyer"
  },
  {
    description: "Multiplier per 10 dimensions is random from 0.30 and 10",
    reward: "Seventh Dimension autobuyer"
  },
  {
    description: "Dimension Boost and galaxies are useless, sacrifice resets everything but is immensely more powerful.",
    reward: "Eighth Dimension autobuyer"
  },
  {
    description: "Whenever you buy 10 of a dimension or tickspeed, everything else of equal cost will increase to its next cost step.",
    reward: "Tickspeed autobuyer"
  },
  {
    description: "There are only 6 dimensions, with dimension boost and antimatter galaxy costs modified.",
    reward: "Automated Dimension Boosts"
  },
  {
    description: "There's normal matter which rises once you have at least 1 second dimension. If it exceeds your antimatter, it will dimension boost without giving the bonus.",
    reward: "Automated Antimatter Galaxies"
  },
  {
    description: "Each dimension produces the dimension 2 below it; first dimensions produce reduced antimatter.",
    reward: "Automated Big Crunches"
  }
];