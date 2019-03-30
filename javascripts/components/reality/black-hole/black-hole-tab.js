Vue.component("black-hole-tab", {
  data() {
    return {
      isUnlocked: false
    };
  },
  methods: {
    update() {
      this.isUnlocked = player.blackHole[0].unlocked;
    }
  },
  template: `
    <div>
      <black-hole-unlock-button v-if="!isUnlocked" />
      <template v-else>
        <canvas id="blackHoleImage" width="400" height="400" style="border:1px solid #000000;"></canvas>
        <h3 id="blackHoleStatus1"></h3>
        <h3 id="blackHoleStatus2"></h3>
        <h3 id="blackHoleStatus3"></h3>
        <div class="blackhole-upgrades" id="bhupg1">
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" id="blackholeinterval1"
                  onclick="upgradeBlackHoleInterval(0)">Speed up the black hole by 25%<br>Current interval: 3600 seconds<br>Cost:
            15RM
          </button>
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" id="blackholepower1"
                  onclick="upgradeBlackHolePower(0)">Make the black hole 35% more powerful<br>Current power: 5x <br>Cost:
            10RM
          </button>
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" id="blackholeduration1"
                  onclick="upgradeBlackHoleDuration(0)">Extend the black hole duration by 50%<br>Current duration: 10
            seconds<br>Cost: 20RM
          </button>
        </div>
        <div class="blackhole-upgrades" id="bhupg2">
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" id="blackholeinterval2"
                  onclick="upgradeBlackHoleInterval(1)">Speed up the black hole by 25%<br>Current interval: 3600 seconds<br>Cost:
            15RM
          </button>
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" id="blackholepower2"
                  onclick="upgradeBlackHolePower(1)">Make the black hole 35% more powerful<br>Current power: 5x <br>Cost:
            10RM
          </button>
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" id="blackholeduration2"
                  onclick="upgradeBlackHoleDuration(1)">Extend the black hole duration by 50%<br>Current duration: 10
            seconds<br>Cost: 20RM
          </button>
        </div>
        <div class="blackhole-upgrades" id="bhupg3">
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" id="blackholeinterval3"
                  onclick="upgradeBlackHoleInterval(2)">Speed up the black hole by 25%<br>Current interval: 3600 seconds<br>Cost:
            15RM
          </button>
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" id="blackholepower3"
                  onclick="upgradeBlackHolePower(2)">Make the black hole 35% more powerful<br>Current power: 5x <br>Cost:
            10RM
          </button>
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" id="blackholeduration3"
                  onclick="upgradeBlackHoleDuration(2)">Extend the black hole duration by 50%<br>Current duration: 10
            seconds<br>Cost: 20RM
          </button>
        </div>
        <div>
          <button class="l-reality-upgrade-btn c-reality-upgrade-btn" onclick="pauseBlackHole()"
                  style="height: auto; padding: 16px" id="pauseButton">Pause
          </button>
        </div>
      </template>
    </div>
  `
});

Vue.component("black-hole-unlock-button", {
  computed: {
    tooltip: () => "The black hole makes the game run significantly faster " +
      "for a short period of time. Starts at 180x faster for 10 seconds, once per hour."
  },
  template: `
    <button 
      id="blackholeunlock" class="l-reality-upgrade-btn c-reality-upgrade-btn"
      onclick="unlockBlackHole()"
      style="text-shadow: -1px 1px 3px #d5ffd7;"
      :ach-tooltip="tooltip"
    >
      Unleash the Black Hole
      <br>
      Cost: 50 RM
    </button>
  `
});