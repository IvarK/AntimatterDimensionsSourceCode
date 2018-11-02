Vue.component('tt-shop', {
  props: {
    view: Object
  },
  data: function() {
    return {
      theoremAmount: 0,
      shopMinimized: false,
      minimizeAvailable: false,
      hasTTAutobuyer: false,
      budget: {
        am: new Decimal(0),
        ip: new Decimal(0),
        ep: new Decimal(0)
      },
      costs: {
        am: new Decimal(0),
        ip: new Decimal(0),
        ep: new Decimal(0)
      }
    };
  },
  computed: {
    theoremAmountDisplay: function() {
      let theorems = this.theoremAmount;
      if (theorems > 99999) {
        return this.shortenMoney(theorems);
      }
      return Math.floor(theorems).toFixed(0);
    },
    theoremNoun: function() {
      return this.theoremAmount === 1 ? "Theorem" : "Theorems";
    },
    minimized: function() {
      return this.minimizeAvailable && this.shopMinimized;
    },
    minimizeArrowStyle: function() {
      return {
        transform: this.minimized ? "rotateX(180deg)" : "",
      };
    },
    containerStyle: function() {
      return {
        transform: this.minimized ? "translateY(73px)" : "",
        width: this.minimized ? "440px" : "555px"
      };
    }
  },
  methods: {
    minimize: function() {
      player.timestudy.shopMinimized = !player.timestudy.shopMinimized;
    },
    formatAM: function(am) {
      return this.shortenCosts(am);
    },
    buyWithAM: function() {
      buyWithAntimatter();
    },
    formatIP: function(ip) {
      return this.shortenCosts(ip) + " IP";
    },
    buyWithIP: function() {
      buyWithIP();
    },
    formatEP: function(ep) {
      return this.shortenDimensions(ep) + " EP";
    },
    buyWithEP: function() {
      buyWithEP();
    },
    update() {
      this.theoremAmount = player.timestudy.theorem;
      this.shopMinimized = player.timestudy.shopMinimized;
      this.minimizeAvailable = player.dilation.upgrades.includes(10);
      this.hasTTAutobuyer = player.reality.perks.includes(5);
      const budget = this.budget;
      budget.am.copyFrom(player.money);
      budget.ip.copyFrom(player.infinityPoints);
      budget.ep.copyFrom(player.eternityPoints);
      const costs = this.costs;
      costs.am.copyFrom(player.timestudy.amcost);
      costs.ip.copyFrom(player.timestudy.ipcost);
      costs.ep.copyFrom(player.timestudy.epcost);
    }
  },
  template:
    `<div id="TTbuttons" style="display: none">
      <div id="theorembuybackground" class="ttshop-container" :style="containerStyle">
        <div class="ttbuttons-row ttbuttons-top-row">
          <button class="timetheorembtn" style="width:130px; font-size: 0.6em" v-if="!minimized" onclick="maxTheorems()">Buy max Theorems</button>
          <button v-if="hasTTAutobuyer" onclick="toggleTTAutomation()" class="timetheorembtn" id="ttautobuyer" style="width: 130px; font-size: 0.5em">Autobuyer: on</button>
          <p id="timetheorems">You have <span class="TheoremAmount">{{ theoremAmountDisplay }}</span> Time {{ theoremNoun }}.</p>
          <div style="display: flex; flex-direction: row; align-items: center">
            <p id="studytreeloadsavetext">{{ view.shiftDown ? 'save:' : 'load:' }}</p>
            <button class="timetheorembtn tt-save-load-btn" onclick="studyTreeSaveButton(1)">1</button>
            <button class="timetheorembtn tt-save-load-btn" onclick="studyTreeSaveButton(2)">2</button>
            <button class="timetheorembtn tt-save-load-btn" onclick="studyTreeSaveButton(3)">3</button>
          </div>
        </div>
        <div class="ttbuttons-row" v-if="!minimized">
          <tt-buy-button :budget="budget.am" :cost="costs.am" :format="formatAM" :action="buyWithAM"/>
          <tt-buy-button :budget="budget.ip" :cost="costs.ip" :format="formatIP" :action="buyWithIP"/>
          <tt-buy-button :budget="budget.ep" :cost="costs.ep" :format="formatEP" :action="buyWithEP"/>
        </div>
      </div>
      <button v-if="minimizeAvailable" id="theorembuybackground" class="ttshop-minimize-btn" @click="minimize">
        <span id="minimizeArrow" :style="minimizeArrowStyle">▼</span>
      </button>
    </div>`
});

Vue.component('tt-buy-button', {
  props: ['budget', 'cost', 'format', 'action'],
  template:
    '<button :class="cssClass" @click="action">Buy Time Theorems Cost: {{ format(cost) }}</button>',
  computed: {
    isEnabled: function() {
      return this.budget.gte(this.cost);
    },
    cssClass: function() {
      return this.isEnabled ? "timetheorembtn" : "timetheorembtnlocked";
    }
  }
});