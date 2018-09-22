Vue.component('tt-shop', {
  props: ['player', 'view'],
  template:
    `<div id="TTbuttons">
      <div id="theorembuybackground">
        <div class="ttbuttons-row ttbuttons-top-row">
          <button class="timetheorembtn" style="width:130px" onclick="maxTheorems()">Buy max Theorems</button>
          <p id="timetheorems">You have <span class="TheoremAmount">{{ theoremAmount }}</span> Time {{ theoremNoun }}.</p>
          <div style="display: flex; flex-direction: row; align-items: center">
            <p id="studytreeloadsavetext">{{ view.shiftDown ? 'save:' : 'load:' }}</p>
            <button class="timetheorembtn tt-save-load-btn" onclick="studyTreeSaveButton(1)">1</button>
            <button class="timetheorembtn tt-save-load-btn" onclick="studyTreeSaveButton(2)">2</button>
            <button class="timetheorembtn tt-save-load-btn" onclick="studyTreeSaveButton(3)">3</button>
          </div>
        </div>
        <div class="ttbuttons-row">
          <tt-buy-button :budget="player.money" :cost="player.timestudy.amcost" :format="formatAM" :action="buyWithAM"></tt-buy-button>
          <tt-buy-button :budget="player.infinityPoints" :cost="player.timestudy.ipcost" :format="formatIP" :action="buyWithIP"></tt-buy-button>
          <tt-buy-button :budget="player.eternityPoints" :cost="player.timestudy.epcost" :format="formatEP" :action="buyWithEP"></tt-buy-button>
        </div>
      </div>    
    </div>`,
  computed: {
    theoremAmount: function() {
      let theorems = this.player.timestudy.theorem;
      if (theorems > 99999) {
        return shortenMoney(theorems);
      }
      return Math.floor(theorems).toFixed(0);
    },
    theoremNoun: function() {
      return this.player.timestudy.theorem === 1 ? "Theorem" : "Theorems";
    },
  },
  methods: {
    formatAM: function(am) {
      return shortenCosts(am);
    },
    buyWithAM: function() {
      buyWithAntimatter();
    },
    formatIP: function(ip) {
      return shortenCosts(ip) + " IP";
    },
    buyWithIP: function() {
      buyWithIP();
    },
    formatEP: function(ep) {
      return shortenDimensions(ep) + " EP";
    },
    buyWithEP: function() {
      buyWithEP();
    }
  }
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