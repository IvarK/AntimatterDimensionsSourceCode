Vue.component('achievement', {
  props: {
    row: Number,
    column: Number
  },
  data: function() {
    return {
      isUnlocked: false,
      isEnabled: false,
      enablesAt: 0,
      remainingTime: 0,
      isMouseOver: false,
      mouseOverInterval: 0
    };
  },
  computed: {
    ordinalId: function() {
      return ((this.row - 1) * ACH_PER_ROW + this.column - 1);
    },
    achId: function() {
      return `r${this.row}${this.column}`;
    },
    details: function() {
      return achDetails[this.ordinalId];
    },
    isBlinkOfAnEye: function() {
      return this.achId === "r78";
    },
    styleObject: function() {
      const isBlinkOfAnEye = this.isBlinkOfAnEye;
      const extension = isBlinkOfAnEye ? "gif" : "png";
      return {
        "background-image": `url(images/${this.details.imageId}.${extension})`,
      };
    },
    classObject: function() {
      return {
        "blink-of-an-eye": this.isBlinkOfAnEye && !this.isUnlocked,
        achievementlocked: !this.isUnlocked,
        achievementunlocked: this.isUnlocked && this.isEnabled,
        achievementdisabled: this.isUnlocked && !this.isEnabled
      };
    },
    detailsTooltip: function() {
      return this.details.tooltip();
    },
    lockedTooltip: function() {
      const remainingTime = this.remainingTime;
      if (remainingTime < 60) {
        return "(Locked: " + remainingTime.toFixed(0) + " seconds)";
      }
      else if (remainingTime < 3600) {
        return "(Locked: " + (remainingTime / 60).toFixed(1) + " minutes)";
      }
      else if (remainingTime < 86400) {
        return "(Locked: " + (remainingTime / 3600).toFixed(1) + " hours)";
      }
      else {
        return "(Locked: " + (remainingTime / 86400).toFixed(1) + " days)";
      }
    },
    tooltip: function() {
      if (this.isUnlocked && !this.isEnabled && this.isMouseOver) {
        return `${this.detailsTooltip}\n${this.lockedTooltip}`;
      }
      return this.detailsTooltip;
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.on$(GameEvent.REALITY, this.updateState);
    this.updateState();
  },
  methods: {
    update() {
      if (!this.isUnlocked || this.isEnabled) {
        return;
      }
      const remainingTime = this.enablesAt - new Date().getTime() / 1000;
      this.remainingTime = remainingTime;
      this.isEnabled = remainingTime <= 0;
    },
    updateState() {
      this.isUnlocked = player.achievements.includes(this.achId);
      if (!this.isUnlocked) {
        return;
      }
      if (player.realities === 0) {
        this.isEnabled = true;
        return;
      }
      const remainingTime = timeUntilAch(this.achId);
      this.isEnabled = isNaN(remainingTime) || remainingTime <= 0;
      if (this.isEnabled) {
        return;
      }
      this.enablesAt = new Date().getTime() / 1000 + remainingTime;
    },
    onMouseEnter: function() {
      clearInterval(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave: function() {
      this.mouseOverInterval = setInterval(() => this.isMouseOver = false, 500);
    }
  },
  template:
    `<div
      :class="classObject"
      :style="styleObject"
      :ach-tooltip="tooltip"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave">
      <br>
     </div>`
});

const achDetails = [
  { name: "You gotta start somewhere", imageId: 1, tooltip: () => "Buy a single First Dimension." },
  { name: "100 antimatter is a lot", imageId: 2, tooltip: () => "Buy a single Second Dimension." },
  { name: "Half life 3 confirmed", imageId: 3, tooltip: () => "Buy a single Third Dimension." },
  { name: "L4D: Left 4 Dimensions", imageId: 4, tooltip: () => "Buy a single Fourth Dimension." },
  { name: "5 Dimension Antimatter Punch", imageId: 5, tooltip: () => "Buy a single Fifth Dimension." },
  { name: "We couldn't afford 9", imageId: 6, tooltip: () => "Buy a single Sixth Dimension." },
  { name: "Not a luck related achievement", imageId: 7, tooltip: () => "Buy a single Seventh Dimension." },
  { name: "90 degrees to infinity", imageId: 8, tooltip: () => "Buy a single Eighth Dimension." },

  { name: "To infinity!", imageId: 9, tooltip: () => "Reach Infinite antimatter. Reward: Start with 100 antimatter." },
  { name: "Fake News", imageId: 25, tooltip: () => "Encounter 50 different news messages." },
  { name: "The 9th Dimension is a lie", imageId: 11, tooltip: () => "Have exactly 99 Eighth Dimensions. Reward: Eighth Dimensions are 10% stronger." },
  { name: "Antimatter Apocalypse", imageId: 12, tooltip: () => `Get over ${shortenCosts(1e80)} antimatter.` },
  { name: "Boosting to the max", imageId: 13, tooltip: () => "Buy 10 Dimension Boosts." },
  { name: "You got past The Big Wall", imageId: 14, tooltip: () => "Buy an Antimatter Galaxy." },
  { name: "Double Galaxy", imageId: 15, tooltip: () => "Buy 2 Antimatter Galaxies." },
  { name: "There's no point in doing that", imageId: 16, tooltip: () => `Buy a single First Dimension when you have over ${shortenCosts(1e150)} of them. Reward: First Dimensions are 10% stronger.` },

  { name: "I forgot to nerf that", imageId: 17, tooltip: () => `Get any Dimension multiplier over ${shortenCosts(1e31)}. Reward: First Dimensions are 5% stronger.` },
  { name: "The Gods are pleased", imageId: 18, tooltip: () => "Get over 600x from Dimension Sacrifice in total. Reward: Sacrifice is slightly stronger." },
  { name: "That's a lot of infinites", imageId: 19, tooltip: () => "Reach Infinity 10 times." },
  { name: "You didn't need it anyway", imageId: 20, tooltip: () => "Reach Infinite antimatter without having any 8th Dimensions. Reward: Dimensions 1-7 are 2% stronger." },
  { name: "Don't you dare to sleep", imageId: 10, tooltip: () => "Be offline for over 6 hours in a row." },
  { name: "Claustrophobic", imageId: 22, tooltip: () => "Go Infinite with just 1 Antimatter Galaxy. Reward: Reduces starting tick interval by 2%." },
  { name: "That's fast!", imageId: 23, tooltip: () => "Go infinite in under 2 hours. Reward: Start with 1000 antimatter." },
  { name: "I don't believe in Gods", imageId: 24, tooltip: () => "Buy an Antimatter Galaxy without Sacrificing." },

  { name: "Spreading Cancer", imageId: 46, tooltip: () => "Buy ten Antimatter Galaxies in total while using cancer notation." },
  { name: "Supersanic", imageId: 26, tooltip: () => `Have antimatter/sec exceed your current antimatter above ${shortenCosts(1e63)}` },
  { name: "Zero Deaths", imageId: 27, tooltip: () => "Get to Infinity without Dimension shifts, boosts or Antimatter Galaxies in a challenge. Reward: Dimensions 1-4 are 25% stronger." },
  { name: "Over in 30 seconds", imageId: 28, tooltip: () => "Have antimatter/sec exceed your current antimatter for 30 consecutive seconds." },
  { name: "Faster than a potato", imageId: 29, tooltip: () => `Get more than ${shortenCosts(1e29)} ticks per second. Reward: Reduces starting tick interval by 2%.` },
  { name: "Multidimensional", imageId: 30, tooltip: () => `Reach ${shortenCosts(1e12)} of all dimensions except 8th.` },
  { name: "Daredevil", imageId: 31, tooltip: () => "Complete 2 challenges." },
  { name: "AntiChallenged", imageId: 32, tooltip: () => "Complete all the challenges. Reward: All dimensions are 10% stronger." },

  { name: "Limit Break", imageId: 33, tooltip: () => "Break Infinity." },
  { name: "Age of Automation", imageId: 34, tooltip: () => "Max any 9 autobuyers." },
  { name: "Definitely not worth it", imageId: 35, tooltip: () => "Max all the autobuyers." },
  { name: "That's faster!", imageId: 36, tooltip: () => "Infinity in 10 minutes or less. Reward: Start with 200000 antimatter." },
  { name: "Forever isn't that long", imageId: 37, tooltip: () => "Infinity in 1 minute or less. Reward: Start with 1e10 antimatter." },
  { name: "Many Deaths", imageId: 38, tooltip: () => "Complete the Second Dimension Autobuyer challenge in 3 minutes or less. Reward: All dimensions are stronger in first 3 minutes of infinity." },
  { name: "Gift from the Gods", imageId: 39, tooltip: () => "Complete the Eighth Dimension Autobuyer challenge in 3 minutes or less. Reward: Dimensional sacrifices are a lot stronger." },
  { name: "Is this hell?", imageId: 40, tooltip: () => "Complete the Tickspeed Autobuyer challenge in 3 minutes or less. Reward: Boost per 10 dimensions +1%." },

  { name: "Bulked up", imageId: 401, tooltip: () => "Get all of your dimension bulk buyers to 512 or higher." },
  { name: "Oh hey, you're still here", imageId: 402, tooltip: () => "Reach 1e8 IP per minute." },
  { name: "A new beginning.", imageId: 403, tooltip: () => "Begin generation of infinity power." },
  { name: "1 million is a lot", imageId: 404, tooltip: () => "Reach 1e6 infinity power." },
  { name: "Not-so-challenging", imageId: 405, tooltip: () => "Get the sum of all of your challenge times under 3 minutes. Reward: All dimensions are stronger in first 3 minutes of infinity, but only in challenges." },
  { name: "Faster than a squared potato", imageId: 406, tooltip: () => `Get more than ${shortenCosts(1e58)} ticks per second. Reward: Reduces starting tick interval by 2%.` },
  { name: "Infinitely Challenging", imageId: 407, tooltip: () => "Complete an infinity challenge." },
  { name: "You did this again just for the achievement right?", imageId: 408, tooltip: () => "Complete the Third Dimension Autobuyer challenge in 10 seconds or less. Reward: First dimensions are 50% stronger." },

  { name: "ERROR 909: Dimension not found", imageId: 41, tooltip: () => "Get to infinity with only a single first Dimension without Dimension Boosts, Shifts or Antimatter Galaxies while in Automatic Antimatter Galaxies Challenge. Reward: First Dimensions are 3 times stronger." },
  { name: "Can't hold all these infinities", imageId: 42, tooltip: () => "Get all Dimension multipliers over 1e308. Reward: All dimensions 10% stronger." },
  { name: "This achievement doesn't exist", imageId: 43, tooltip: () => "Get 9.9999e9999 antimatter. Reward: Dimensions are more powerful the more unspent antimatter you have." },
  { name: "End me", imageId: 44, tooltip: () => "Get the sum of all best challenge times under 5 seconds. Reward: All dimensions 40% stronger, but only in challenges." },
  { name: "NEW DIMENSIONS???", imageId: 45, tooltip: () => "Unlock the 4th Infinity Dimension. Reward: Your achievement bonus affects Infinity Dimensions." },
  { name: "One for each dimension", imageId: 21, tooltip: () => "Play for 8 days. Reward: Extremely small time multiplier." },
  { name: "How the antitables have turned", imageId: 47, tooltip: () => "Get 8th Dimension multiplier to be highest, 7th Dimension multiplier second highest etc. Reward: Each dimension gains a boost proportional to tier (8th dimension gets 8%, 7th gets 7%, etc.)" },
  { name: "Blink of an eye", imageId: 48, tooltip: () => `Get to Infinity in under 200 milliseconds. Reward: Start with ${shortenCosts(1e25)} antimatter and all dimensions are stronger in first 300ms of Infinity.` },

  { name: "Hevipelle did nothing wrong", imageId: 49, tooltip: () => "Beat Infinity Challenge 5 in 10 seconds or less." },
  { name: "Anti-antichallenged", imageId: 50, tooltip: () => "Complete 8 Infinity Challenges." },
  { name: "YOU CAN GET 50 GALAXIES!??", imageId: 51, tooltip: () => "Get 50 Antimatter Galaxies. Reward: Tickspeed is 5% lower per Antimatter Galaxy." },
  { name: "I got a few to spare", imageId: 52, tooltip: () => `Reach ${shortenCosts(new Decimal("1e35000"))} antimatter. Reward: Dimensions are more powerful the more unspent antimatter you have.` },
  { name: "All your IP are belong to us", imageId: 53, tooltip: () => `Big Crunch for ${shortenCosts(1e150)} IP. Reward: Additional 4x multiplier to IP.` },
  { name: "Do you even bend time bro?", imageId: 54, tooltip: () => "Reach -99.9% tickspeed per upgrade. Reward: Galaxies are 1% more powerful." },
  { name: "2 Million Infinities", imageId: 55, tooltip: () => "Infinity 2000000 times. Reward: Infinities more than 5 seconds long give 250 infinitied stat." },
  { name: "Yet another infinity reference", imageId: 56, tooltip: () => `Get a x${shortenDimensions(Number.MAX_VALUE)} multiplier in a single sacrifice. Reward: Sacrifices are stronger.` },

  { name: "Ludicrous Speed", imageId: 57, tooltip: () => `Big Crunch for ${shortenCosts(1e200)} IP in 2 seconds or less. Reward: All dimensions are significantly stronger in first 5 seconds of infinity.` },
  { name: "I brake for nobody", imageId: 58, tooltip: () => `Big Crunch for ${shortenCosts(1e250)} IP in 20 seconds or less. Reward: All dimensions are significantly stronger in first 60 seconds of infinity.` },
  { name: "MAXIMUM OVERDRIVE", imageId: 59, tooltip: () => `Big Crunch with ${shortenCosts(1e300)} IP/min. Reward: Additional 4x multiplier to IP.` },
  { name: "4.3333 minutes of Infinity", imageId: 60, tooltip: () => `Reach ${shortenCosts(1e260)} infinity power. Reward: Double infinity power gain.` },
  { name: "Is this safe?", imageId: 61, tooltip: () => "Gain Infinite replicanti in 30 minutes. Reward: Infinity doesn't reset your replicanti amount." },
  { name: "Time is relative", imageId: 62, tooltip: () => "Go Eternal." },
  { name: "Yes. This is hell.", imageId: 63, tooltip: () => "Get the sum of Infinity Challenge times under 6.66 seconds." },
  { name: "0 degrees from infinity", imageId: 64, tooltip: () => "Unlock the 8th Infinity Dimension." },

  { name: "Costco sells dimboosts now", imageId: 65, tooltip: () => "Bulk buy 750 dimension boosts at once. Reward: Dimension boosts are 1% more powerful (to normal dims)." },
  { name: "This mile took an Eternity", imageId: 66, tooltip: () => "Get all eternity milestones." },
  { name: "This achievement doesn't exist II", imageId: 67, tooltip: () => "Reach 9.99999e999 IP. Reward: Gain more IP based on amount of antimatter you had when crunching." },
  { name: "That wasn't an eternity", imageId: 68, tooltip: () => "Eternity in under 30 seconds. Reward: Start eternities with 2e25 IP." },
  { name: "Infinite time", imageId: 69, tooltip: () => "Get 308 tickspeed upgrades (in one eternity) from time dimensions. Reward: Time dimensions are affected slightly more by tickspeed." },
  { name: "The swarm", imageId: 70, tooltip: () => "Get 10 replicanti galaxies in 15 seconds." },
  { name: "Do you really need a guide for this?", imageId: 71, tooltip: () => "Eternity with the infinitied stat under 10." },
  { name: "We could afford 9", imageId: 72, tooltip: () => "Eternity with exactly 9 replicanti." },

  { name: "Yo dawg, I heard you liked infinities...", imageId: 73, tooltip: () => `Have all your infinities in your past 10 infinities be at least ${shortenMoney(Number.MAX_VALUE)} times higher IP than the previous one. Reward: Your antimatter doesn't reset on dimboost/galaxy.` },
  { name: "Never again", imageId: 74, tooltip: () => "Max out your third Eternity upgrade. Reward: The limit is a bit higher." },
  { name: "Long lasting relationship", imageId: 75, tooltip: () => "Have your Infinity power per second exceed your infinity power for 60 consecutive seconds during a single infinity." },
  { name: "You're a mistake", imageId: 76, tooltip: () => "Fail an Eternity challenge. Reward: A fading sense of accomplishment." },
  { name: "I wish I had gotten 7 eternities", imageId: 77, tooltip: () => "Start an Infinity challenge inside an Eternity challenge." },
  { name: "Do I really need to infinity", imageId: 78, tooltip: () => "Eternity with only 1 infinity. Reward: Multiplier to IP based on infinities." },
  { name: "8 nobody got time for that", imageId: 79, tooltip: () => "Eternity without buying dimensions 1-7." },
  { name: "IT'S OVER 9000", imageId: 80, tooltip: () => `Get a total sacrifice multiplier of ${shortenCosts(new Decimal("1e9000"))}. Reward: Sacrifice doesn't reset your dimensions.` },

  { name: "Can you get infinite IP?", imageId: 81, tooltip: () => `Reach ${shortenCosts(new Decimal("1e30008"))} IP.` },
  { name: "You're already dead.", imageId: 82, tooltip: () => "Eternity without buying dimensions 2-8." },
  { name: "5 more eternities until the update", imageId: 83, tooltip: () => "Complete 50 unique eternity challenge tiers." },
  { name: "Eternities are the new infinity", imageId: 84, tooltip: () => "Eternity in under 200ms." },
  { name: "Like feasting on a behind", imageId: 85, tooltip: () => `Reach ${shortenCosts(1e100)} IP without any infinities or first dimensions. Reward: IP multiplier based on time spent this infinity.` },
  { name: "Popular music", imageId: 86, tooltip: () => `Have 180 times more Replicanti Galaxies than Antimatter Galaxies. Reward: Replicanti galaxies divide your replicanti by ${shortenMoney(Number.MAX_VALUE)} instead of resetting them to 1.` },
  { name: "But I wanted another prestige layer...", imageId: 87, tooltip: () => `Reach ${shortenMoney(Number.MAX_VALUE)} EP.` },
  { name: "What do I have to do to get rid of you", imageId: 88, tooltip: () => `Reach ${shortenCosts(new Decimal("1e22000"))} IP without any time studies. Reward: Time dimensions are multiplied by the number of studies you have.` },

  { name: "No ethical consumption", imageId: 89, tooltip: () => "Get 5 billion banked infinities. Reward: After eternity you permanently keep 5% of your infinities." },
  { name: "Unique snowflakes", imageId: 90, tooltip: () => "Have 630 Antimatter Galaxies without having any Replicanti Galaxies. Reward: Gain a multiplier to dilated time gains based on Antimatter Galaxies" },
  { name: "I never liked this infinity stuff anyway", imageId: 91, tooltip: () => `Reach ${shortenCosts(new Decimal("1e200000"))} IP without buying IDs or IP multipliers. Reward: You start eternities with all Infinity Challenges unlocked and completed.` },
  { name: "When will it be enough?", imageId: 92, tooltip: () => `Reach ${shortenCosts(new Decimal("1e20000"))} replicanti. Reward: You gain replicanti 2 times faster under ${shortenMoney(Number.MAX_VALUE)} replicanti.` },
  { name: "Faster than a potato^286078", imageId: 93, tooltip: () => `Get more than ${shortenCosts(new Decimal("1e8296262"))} ticks per second.` },
  { name: "I told you already, time is relative", imageId: 94, tooltip: () => "Dilate time." },
  { name: "Now you're thinking with dilation!", imageId: 95, tooltip: () => `Eternity for ${shortenCosts(new Decimal("1e600"))} EP in 1 minute or less while dilated.` },
  { name: "This is what I have to do to get rid of you.", imageId: 96, tooltip: () => `Reach ${shortenCosts(new Decimal('1e28000'))} IP without any time studies while dilated. Reward: The active time study path doesn't disable your replicanti autobuyer.` },

  { name: "Snap back to reality", imageId: 97, tooltip: () => "Make a new reality. Reward: 4x IP gain and boost from buying 10 dimensions +0.1" },
  { name: "How does this work?", imageId: 98, tooltip: () => "Unlock the automator. Reward: Dimensional boosts are 50% more effective." },
  { name: "Yo dawg, I heard you liked reskins...", imageId: 99, tooltip: () => `Have all your eternities in your past 10 eternities be at least ${shortenMoney(Number.MAX_VALUE)} times higher EP than the previous one. Reward: nothing right now.` },
  { name: "r144", imageId: 100, tooltip: () => "I appreciate your curiosity :)" },
  { name: "r145", imageId: 102, tooltip: () => "nothing to see here" },
  { name: "r146", imageId: 103, tooltip: () => "thanks" },
  { name: "r147", imageId: 104, tooltip: () => "todo: make this achievement a thing" },
  { name: "r148", imageId: 105, tooltip: () => "if you read this, ping me (or don't)" },
];