"use strict";

const UPDATE_INTERVAL = 33;
const SAVE_INTERVAL = 5000;
const notation = new ADNotations.ScientificNotation();

let uiUpdateHooks = [];

function updateUI() {
  for (const hook of uiUpdateHooks) {
    hook.update();
  }
}

let game = {
  amounts: [new Decimal(0)],
  purchases: [new Decimal(0)],
  depression: new Decimal(1),
  prestige: [new Decimal(1)]
};

class StuffState {
  constructor(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  get previousStuff() {
    return this.id > 1 ? Stuff(this.id - 1) : undefined;
  }

  get nextStuff() {
    return Stuff(this.id + 1);
  }

  get isUnlocked() {
    return Stuffs.count >= this.id;
  }

  get amount() {
    return game.amounts[this.id - 1];
  }

  set amount(value) {
    game.amounts[this.id - 1] = value;
  }

  get purchases() {
    return game.purchases[this.id - 1];
  }

  set purchases(value) {
    game.purchases[this.id - 1] = value;
  }

  get cost() {
    const baseCost = Decimal.pow(100, this.id - 1);
    const costIncrease = Decimal.pow(2, this.purchases);
    return baseCost.times(costIncrease);
  }

  get isAffordable() {
    return game.depression.gte(this.cost);
  }

  purchase() {
    if (!this.isAffordable) return;
    game.depression = game.depression.minus(this.cost);
    const nextStuff = this.nextStuff;
    if (!nextStuff.isUnlocked) {
      nextStuff.amount = new Decimal(0);
      nextStuff.purchases = new Decimal(0);
      nextStuff.prestige = new Decimal(1);
    }
    this.amount = this.amount.plus(1).max(this.amount.times(1.05).min(nextStuff.amount.times(10000)));
    this.purchases = this.purchases.plus(1);
    updateUI();
  }

  get prestige() {
    return game.prestige[this.id - 1];
  }

  set prestige(value) {
    game.prestige[this.id - 1] = Decimal.max(this.prestige, value);
  }

  get canPrestige() {
    return Stuff(this.id + 6).isUnlocked;
  }

  get nextPrestige() {
    return Decimal.max(Stuffs.count - this.id - 5, 1);
  }

  doPrestige() {
    this.prestige = this.nextPrestige;
    game = {
      amounts: [new Decimal(0)],
      purchases: [new Decimal(0)],
      depression: new Decimal(1),
      prestige: game.prestige
    };
    updateUI();
  }

  tick() {
    const production = this.amount.times(this.prestige.dividedBy(UPDATE_INTERVAL));
    if (this.id === 1) {
      game.depression = game.depression.plus(production);
    } else {
      this.previousStuff.amount = this.previousStuff.amount.plus(production);
    }
  }
}

const Stuff = id => new StuffState(id);

const Stuffs = {
  get count() {
    return game.amounts.length;
  },
  get unlocked() {
    return Stuffs.range(Stuffs.count);
  },
  range(count) {
    const stuffs = [];
    for (let i = 1; i < count + 1; i++) {
      stuffs.push(Stuff(i));
    }
    return stuffs;
  },
  tick() {
    for (const stuff of Stuffs.unlocked) {
      stuff.tick();
    }
  },
  get last() {
    return Stuff(Stuffs.count);
  }
};

function save() {
  localStorage.setItem("funsave", JSON.stringify(game));
}

function load() {
  const saveData = JSON.parse(localStorage.getItem("funsave"));
  if (saveData === null) return;
  saveData.depression = new Decimal(saveData.depression);
  for (let i = 0; i < Object.keys(saveData.amounts).length; i++) {
    saveData.amounts[i] = new Decimal(saveData.amounts[i]);
  }
  for (let i = 0; i < Object.keys(saveData.prestige).length; i++) {
    saveData.prestige[i] = new Decimal(saveData.prestige[i]);
  }
  if (saveData.purchases !== undefined) {
    for (let i = 0; i < Object.keys(saveData.purchases).length; i++) {
      saveData.purchases[i] = new Decimal(saveData.purchases[i]);
    }
  }
  if (saveData.costs !== undefined) {
    saveData.purchases = [];
    for (let i = 0; i < Object.keys(saveData.costs).length; i++) {
      const cost = new Decimal(saveData.costs[i]);
      const baseCost = Decimal.pow(100, i);
      const costIncrease = cost.dividedBy(baseCost);
      saveData.purchases[i] = Decimal.floor(Decimal.log2(costIncrease)).max(0);
    }
  }
  game = saveData;
}

// eslint-disable-next-line prefer-const
let cheat = false;

function gameLoop() {
  Stuffs.tick();

  if (cheat) {
    const preLastStuff = Stuffs.last.previousStuff;
    if (preLastStuff !== undefined && preLastStuff.amount.lessThan(5)) {
      preLastStuff.purchase();
    }
    Stuffs.last.purchase();
  }

  updateUI();
}


function format(value, places, placesUnder1000) {
  return notation.format(value, places, placesUnder1000);
}

function formatX(value, places, placesUnder1000) {
  return `×${format(value, places, placesUnder1000)}`;
}

Vue.mixin({
  methods: {
    format,
    formatX
  },
  created() {
    if (this.update) {
      uiUpdateHooks.push(this);
      this.update();
    }
  },
  destroyed() {
    uiUpdateHooks = uiUpdateHooks.filter(h => h !== this);
  }
});

const StuffButton = {
  props: {
    stuff: Object
  },
  data: () => ({
    amount: new Decimal(0),
    cost: new Decimal(0),
    prestige: new Decimal(1)
  }),
  methods: {
    update() {
      if (!this.stuff.isUnlocked) return;
      this.amount.fromDecimal(this.stuff.amount);
      this.cost.fromDecimal(this.stuff.cost);
      this.prestige.fromDecimal(this.stuff.prestige);
    }
  },
  template: `
    <button class="button button--stuff" @click="stuff.purchase()">
      Amount: {{ format(amount, 2) }}
      <br>
      Power: {{ formatX(prestige, 2) }}
      <br>
      Cost: {{ format(cost, 2) }}
    </button>`
};

const PrestigeButton = {
  props: {
    stuff: Object
  },
  data: () => ({
    canPrestige: false,
    nextPrestige: new Decimal(1)
  }),
  methods: {
    update() {
      if (!this.stuff.isUnlocked) return;
      this.canPrestige = this.stuff.canPrestige;
      this.nextPrestige.fromDecimal(this.stuff.nextPrestige);
    }
  },
  template: `
    <button v-if="canPrestige" class="button button--prestige" @click="stuff.doPrestige()">
      Reset to increase bonus to {{ formatX(nextPrestige, 2) }} boost.
    </button>`
};

const Depression = {
  components: {
    "stuff-button": StuffButton,
    "prestige-button": PrestigeButton
  },
  data: () => ({
    depression: new Decimal(1),
    stuffCount: 0
  }),
  computed: {
    stuffs() {
      return Stuffs.range(this.stuffCount);
    }
  },
  methods: {
    update() {
      this.depression.fromDecimal(game.depression);
      this.stuffCount = Stuffs.count;
    }
  },
  template: `
    <div class="app">
      <p class="depression">You have <span class="depression-amount">{{ format(depression, 2) }}</span> depression</p>
      <div class="stuff-container">
        <template v-for="stuff in stuffs">
          <br v-if="stuff.id > 1">
          <stuff-button :stuff="stuff" />
          <prestige-button :stuff="stuff" />
        </template>
      </div>
    </div>`
};

let vue;

window.onload = () => {
  load();
  setInterval(gameLoop, UPDATE_INTERVAL);
  setInterval(save, SAVE_INTERVAL);
  vue = new Vue({
    el: "#depression",
    components: {
      depression: Depression
    },
    template: "<depression/>"
  });
};
