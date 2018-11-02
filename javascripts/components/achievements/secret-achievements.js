Vue.component('secret-achievements', {
  template:
    `<div>
      <table>
        <tr is="secret-achievement-row" v-for="row in 4" :row="row" />
      </table>
    </div>`
});

Vue.component('secret-achievement-row', {
  props: {
    row: Number
  },
  data: function() {
    return {
      isCompleted: false
    };
  },
  computed: {
    classObject: function() {
      return {
        completedrow: this.isCompleted
      };
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.updateState();
  },
  methods: {
    updateState() {
      const unlockState = Array.from({length: 8}, (v, i) => `s${this.row}${i + 1}`)
        .map(achId => player.achievements.includes(achId));
      this.isCompleted = !unlockState.includes(false);
    }
  },
  template:
    `<tr :class="classObject">
      <td v-for="column in 8" style="width=1%">
        <secret-achievement
          :row="row"
          :column="column"
        />
      </td>
    </tr>`
});

Vue.component('secret-achievement', {
  props: {
    row: Number,
    column: Number
  },
  data: function() {
    return {
      isUnlocked: false,
    };
  },
  computed: {
    ordinalId: function() {
      return ((this.row - 1) * ACH_PER_ROW + this.column - 1);
    },
    achId: function() {
      return `s${this.row}${this.column}`;
    },
    styleObject: function() {
      return {
        "background-image": `url(images/s${this.ordinalId + 1}.png)`,
      };
    },
    classObject: function() {
      return {
        achievementhidden: !this.isUnlocked,
        achievementunlocked: this.isUnlocked
      };
    },
    details: function() {
      return secretAchDetails[this.ordinalId];
    },
    tooltip: function() {
      return this.isUnlocked ? this.details.tooltip : this.details.name;
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.updateState();
  },
  methods: {
    updateState() {
      this.isUnlocked = player.achievements.includes(this.achId);
    },
    onClick: function() {
      if (this.ordinalId === 0 && !this.isUnlocked) {
        giveAchievement("The first one's always free");
      }
    }
  },
  template:
    `<div
      :class="classObject"
      :style="styleObject"
      :ach-tooltip="tooltip"
      @click="onClick">
      <br>
     </div>`
});

const secretAchDetails = [
  {
    name: "The first one's always free",
    tooltip: "Click on this achievement.",
  },
  {
    name: "Just in case",
    tooltip: "Save 100 times without refreshing.",
  },
  {
    name: "It pays to have respect",
    tooltip: "Pay respects.",
  },
  {
    name: "So do I",
    tooltip: "Say something naughty.",
  },
  {
    name: "Do a barrel roll!",
    tooltip: "Do a barrel roll.",
  },
  {
    name: "Do you enjoy pain?",
    tooltip: "Use standard, cancer, or bracket notation for 10 minutes with more than 1 eternity.",
  },
  {
    name: "30 Lives",
    tooltip: "Input the konami code.",
  },
  {
    name: "Do you feel lucky? Well do ya punk?",
    tooltip: "You have a 1/100,000 chance of getting this achievement every second.",
  },

  {
    name: "Go study in real life instead",
    tooltip: "Purchase the secret time study.",
  },
  {
    name: "Cancer = Spread",
    tooltip: "Buy 100,000 Antimatter Galaxies in total while using cancer notation.",
  },
  {
    name: "Stop right there criminal scum!",
    tooltip: "Open the console.",
  },
  {
    name: "Real news",
    tooltip: "Click on the news ticker that tells you to click on it.",
  },
  {
    name: "Shhh... It's a secret",
    tooltip: "Discover a secret theme.",
  },
  {
    name: "You're a failure",
    tooltip: "Fail eternity challenges 10 times without refreshing. What are you doing with your life...",
  },
  {
    name: "It's not called matter dimensions is it?",
    tooltip: "Get Infinite matter.",
  },
  {
    name: "Nice.",
    tooltip: "Don't act like you don't know what you did.",
  },

  {
    name: "You should download some more RAM",
    tooltip: "Set your update rate to 200ms.",
  },
  {
    name: "Less than or equal to 0.001",
    tooltip: "Get a fastest infinity or eternity time of less than or equal to 0.001 seconds.",
  },
  {
    name: "A sound financial decision",
    tooltip: "Click on the donate link.",
  },
  {
    name: "You do know how these work, right?",
    tooltip: "Respec with an empty study tree.",
  },
  {
    name: "Should we tell them about buy max...",
    tooltip: "Buy single tickspeed 100,000 times.",
  },
  {
    name: "While you were away... Nothing happened.",
    tooltip: "Have nothing happen while you were away.",
  },
  {
    name: "You followed the instructions",
    tooltip: "Follow instructions.",
  },
  {
    name: "Professional bodybuilder",
    tooltip: "Get all your dimension bulk buyers to 1e100.",
  },

  {
    name: "That dimension doesn’t exist",
    tooltip: "Try to purchase the 9th dimension.",
  },
  {
    name: "Was it even broken?",
    tooltip: '"Fix" your save.',
  },
  {
    name: "Time fixes everything",
    tooltip: "Fix infinity while dilated.",
  },
  {
    name: "Are you statisfied now?",
    tooltip: "Stare intently at the statistics tab for 15 minutes.",
  },
  {
    name: "This dragging is dragging on",
    tooltip: "Drag the perks around for a minute.",
  },
  {
    name: "s46",
    tooltip: "s46",
  },
  {
    name: "s47",
    tooltip: "s47",
  },
  {
    name: "s48",
    tooltip: "s48",
  }
];