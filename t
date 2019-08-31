[1mdiff --git a/javascripts/components/celestials/subtabs/laitela-tab.js b/javascripts/components/celestials/subtabs/laitela-tab.js[m
[1mindex d9856452..add1944b 100644[m
[1m--- a/javascripts/components/celestials/subtabs/laitela-tab.js[m
[1m+++ b/javascripts/components/celestials/subtabs/laitela-tab.js[m
[36m@@ -12,7 +12,8 @@[m [mVue.component("laitela-tab", {[m
       higgsGain: new Decimal(0),[m
       showReset: false,[m
       darkEnergyChance: 0,[m
[31m-      darkEnergy: 0[m
[32m+[m[32m      darkEnergy: 0,[m
[32m+[m[32m      annihilated: false,[m
     };[m
   },[m
   methods: {[m
[36m@@ -25,7 +26,8 @@[m [mVue.component("laitela-tab", {[m
       this.activeDimensions = Array.range(0, 4).filter(i => MatterDimension(i + 1).amount.neq(0));[m
       this.higgs.copyFrom(player.celestials.laitela.higgs);[m
       this.higgsGain.copyFrom(Laitela.higgsGain);[m
[31m-      this.showReset = this.higgs.gt(0) || this.higgsGain.gt(0);[m
[32m+[m[32m      this.annihilated = player.celestials.laitela.annihilated;[m
[32m+[m[32m      this.showReset = this.annihilated || this.higgsGain.gt(0);[m
       this.darkEnergyChance = Laitela.darkEnergyChance;[m
       this.darkEnergy = player.celestials.laitela.darkEnergy;[m
     },[m
[36m@@ -68,14 +70,6 @@[m [mVue.component("laitela-tab", {[m
         Multiply all dark matter dimensions based on highest AM reached, [m
         Currently: <b>{{ shorten(realityReward, 2, 3)}}x</b>[m
       </button>[m
[31m-      <div class="o-laitela-matter-amount">You have {{ shorten(matter, 2, 0) }} Dark Matter</div>[m
[31m-      <div>Dark Matter causes your dimension cost multipliers to increase {{ matterEffectPercentage }} slower</div>[m
[31m-      <matter-dimension-row[m
[31m-        v-for="i in activeDimensions"[m
[31m-        :key="i"[m
[31m-        :dimension="dimensions[i]"[m
[31m-      />[m
[31m-      <div>{{ nextUnlock }}</div>[m
       <button class="c-laitela-annihilation-button" @click="annihilate()" v-if="showReset">[m
         <h2>Annihilation</h2>[m
         <p>[m
[36m@@ -83,19 +77,30 @@[m [mVue.component("laitela-tab", {[m
           Higgs {{"Boson" | pluralize(higgsGain)}}[m
         </p>[m
       </button>[m
[31m-      <div>You have {{ shorten(higgs, 2, 0)}} Higgs {{"Boson" | pluralize(higgs)}}</div>[m
[31m-      <div>Which cause you to have a {{ (darkEnergyChance * 100).toFixed(2) }}% chance of generating dark energy each dimension interval</div>[m
[31m-      <div>You have {{ shorten(darkEnergy, 2, 0)}} Dark Energy</div>[m
[31m-      <div class="l-laitela-unlocks-container" v-if="showReset">[m
[31m-        <button [m
[31m-          v-for="upgrade in upgrades" [m
[31m-          :key="upgrade.id" [m
[31m-          class="o-laitela-shop-button"[m
[31m-          :class="{'o-laitela-shop-button--available': upgrade.canBeBought }"[m
[31m-          @click="upgrade.purchase()"> [m
[31m-            {{ upgrade.description }} <br/> Costs: <b>{{ shorten(upgrade.cost, 2, 0) }}</b> Higgs Bosons [m
[31m-            <br/>Currently: {{ upgrade.formattedEffect }}, Next: {{ upgrade.formattedNextEffect }}[m
[31m-        </button>[m
[32m+[m[32m      <div class="o-laitela-matter-amount">You have {{ shorten(matter, 2, 0) }} Dark Matter</div>[m
[32m+[m[32m      <div v-if="annihilated">You have {{ shorten(higgs, 2, 0)}} Higgs {{"Boson" | pluralize(higgs)}}</div>[m
[32m+[m[32m      <div v-if="higgs.gt(0)">Which cause you to have a {{ (darkEnergyChance * 100).toFixed(2) }}% chance of generating dark energy each dimension interval</div>[m
[32m+[m[32m      <div v-if="darkEnergy > 0">You have {{ shorten(darkEnergy, 2, 0)}} Dark Energy</div>[m
[32m+[m[32m      <div class="l-laitela-mechanics-container">[m
[32m+[m[32m        <div>[m
[32m+[m[32m          <matter-dimension-row[m
[32m+[m[32m            v-for="i in activeDimensions"[m
[32m+[m[32m            :key="i"[m
[32m+[m[32m            :dimension="dimensions[i]"[m
[32m+[m[32m            />[m
[32m+[m[32m          <div>{{ nextUnlock }}</div>[m
[32m+[m[32m        </div>[m
[32m+[m[32m        <div class="l-laitela-unlocks-container" v-if="showReset">[m
[32m+[m[32m          <button[m[41m [m
[32m+[m[32m            v-for="upgrade in upgrades"[m[41m [m
[32m+[m[32m            :key="upgrade.id"[m[41m [m
[32m+[m[32m            class="o-laitela-shop-button"[m
[32m+[m[32m            :class="{'o-laitela-shop-button--available': upgrade.canBeBought }"[m
[32m+[m[32m            @click="upgrade.purchase()">[m[41m [m
[32m+[m[32m              {{ upgrade.description }} <br/> Costs: <b>{{ shorten(upgrade.cost, 2, 0) }}</b> Higgs Bosons[m[41m [m
[32m+[m[32m              <br/>Currently: {{ upgrade.formattedEffect }}, Next: {{ upgrade.formattedNextEffect }}[m
[32m+[m[32m          </button>[m
[32m+[m[32m        </div>[m
       </div>[m
     </div>`[m
 });[m
\ No newline at end of file[m
[1mdiff --git a/javascripts/core/celestials/laitela/annihilation-upgrades.js b/javascripts/core/celestials/laitela/annihilation-upgrades.js[m
[1mindex 087db2d3..7e2698a8 100644[m
[1m--- a/javascripts/core/celestials/laitela/annihilation-upgrades.js[m
[1m+++ b/javascripts/core/celestials/laitela/annihilation-upgrades.js[m
[36m@@ -67,4 +67,43 @@[m [mconst AnnihilationUpgrade = (function() {[m
   };[m
 }());[m
 [m
[31m-AnnihilationUpgrade.all = Object.values(AnnihilationUpgrade);[m
\ No newline at end of file[m
[32m+[m[32mAnnihilationUpgrade.all = Object.values(AnnihilationUpgrade);[m
[32m+[m
[32m+[m[32mclass DarkEnergyUpgradeState extends SetPurchasableMechanicState {[m
[32m+[m
[32m+[m[32m  get set() {[m
[32m+[m[32m    return player.celestials.laitela.darkEnergyUpgrades;[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  get currency() {[m
[32m+[m[32m    return player.celestials.laitela.darkEnergy;[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  set currency(value) {[m
[32m+[m[32m    player.celestials.laitela.darkEnergy = value;[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  get description() {[m
[32m+[m[32m    return this.config.description;[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  get canBeBought() {[m
[32m+[m[32m    return this.currency > this.cost;[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  get effect() {[m
[32m+[m[32m    return this.config.effect();[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  get formattedEffect() {[m
[32m+[m[32m    if (this.config.effectFormat === undefined) return `${shorten(this.effect, 2, 2)}x`;[m
[32m+[m
[32m+[m[32m    return this.config.effectFormat(this.effect);[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  purchase() {[m
[32m+[m[32m    if (!this.canBeBought) return;[m
[32m+[m[32m    this.currency -= this.cost;[m
[32m+[m[32m    this.isBought(true);[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/javascripts/core/celestials/laitela/laitela.js b/javascripts/core/celestials/laitela/laitela.js[m
[1mindex 5780d4f4..7657958b 100644[m
[1m--- a/javascripts/core/celestials/laitela/laitela.js[m
[1m+++ b/javascripts/core/celestials/laitela/laitela.js[m
[36m@@ -121,7 +121,7 @@[m [mconst Laitela = {[m
     return Decimal.floor(Decimal.pow(this.matter.dividedBy(1e8), 0.3));[m
   },[m
   get darkEnergyChance() {[m
[31m-    return this.celestial.higgs.plus(1).log10() / 4000;[m
[32m+[m[32m    return this.celestial.higgs.plus(1).log10() / 10000;[m
   },[m
 [m
   annihilate() {[m
[36m@@ -139,6 +139,7 @@[m [mconst Laitela = {[m
     );[m
     this.celestial.dimensions[0].amount = new Decimal(1);[m
     this.celestial.matter = new Decimal(0);[m
[32m+[m[32m    this.celestial.annihilated = true;[m
   }[m
 [m
 };[m
[1mdiff --git a/javascripts/core/celestials/laitela/matter_dimension.js b/javascripts/core/celestials/laitela/matter_dimension.js[m
[1mindex e3acfdf7..1d692fbf 100644[m
[1m--- a/javascripts/core/celestials/laitela/matter_dimension.js[m
[1m+++ b/javascripts/core/celestials/laitela/matter_dimension.js[m
[36m@@ -123,8 +123,11 @@[m [mfunction getMatterDimensionProduction(tier, ticks) {[m
 function getDarkEnergyProduction(tier, ticks) {[m
   const d = MatterDimension(tier);[m
   // The multiple ticks act just like more binomial samples[m
[31m-  const produced = binomialDistribution(d.amount.log10() * ticks.toNumber(), Laitela.darkEnergyChance);[m
[31m-  return produced * AnnihilationUpgrade.darkEnergyMult.effect;[m
[32m+[m[32m  const produced = binomialDistribution(ticks.times(d.amount.log10()), Laitela.darkEnergyChance);[m
[32m+[m
[32m+[m[32m  // Idk why but for some reason binomialDistribution sometimes returns Decimal and sometimes a number.[m
[32m+[m[32m  if (typeof produced === "number") return produced * AnnihilationUpgrade.darkEnergyMult.effect;[m
[32m+[m[32m  return produced.times(AnnihilationUpgrade.darkEnergyMult.effect).toNumber();[m
 }[m
 [m
 function matterDimensionLoop(realDiff) {[m
[1mdiff --git a/javascripts/core/player.js b/javascripts/core/player.js[m
[1mindex ccb6a88b..a20cb7c6 100644[m
[1m--- a/javascripts/core/player.js[m
[1m+++ b/javascripts/core/player.js[m
[36m@@ -421,9 +421,11 @@[m [mlet player = {[m
         timeSinceLastUpdate: 0[m
       })),[m
       maxAmGained: new Decimal(1),[m
[32m+[m[32m      annihilated: false,[m
       higgs: new Decimal(0),[m
       upgrades: {},[m
[31m-      darkEnergy: 0[m
[32m+[m[32m      darkEnergy: 0,[m
[32m+[m[32m      darkEnergyUpgrades: new Set()[m
     }[m
   },[m
   autoEcIsOn: true,[m
[1mdiff --git a/javascripts/core/secret-formula/celestials/annihilation-upgrade.js b/javascripts/core/secret-formula/celestials/annihilation-upgrade.js[m
[1mindex e578ad0d..66b97b61 100644[m
[1m--- a/javascripts/core/secret-formula/celestials/annihilation-upgrade.js[m
[1m+++ b/javascripts/core/secret-formula/celestials/annihilation-upgrade.js[m
[36m@@ -49,4 +49,19 @@[m [mGameDatabase.annihilationUpgrades = {[m
     effect: x => Math.pow(0.985, x),[m
     effectFormat: x => `${((1 - x) * 100).toFixed(2)}%`[m
   }[m
[31m-};[m
\ No newline at end of file[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32mGameDatabase.darkEnergyUpgrade = [[m
[32m+[m[32m  {[m
[32m+[m[32m    id: 1,[m
[32m+[m[32m    description: "Multiply Dark Matter Dimension production based on Dark Energy",[m
[32m+[m[32m    cost: 30,[m
[32m+[m[32m    effect: () => Math.log10(player.celestials.laitela.darkEnergy + 1) * 1.5[m
[32m+[m[32m  },[m
[32m+[m[32m  {[m
[32m+[m[32m    id: 2,[m
[32m+[m[32m    description: "Divide all Higgs Boson upgrade costs by 3",[m
[32m+[m[32m    cost: 70,[m
[32m+[m[32m    effect: () => 3[m
[32m+[m[32m  }[m
[32m+[m[32m];[m
\ No newline at end of file[m
[1mdiff --git a/stylesheets/styles.css b/stylesheets/styles.css[m
[1mindex f6373efb..bd0a0040 100644[m
[1m--- a/stylesheets/styles.css[m
[1m+++ b/stylesheets/styles.css[m
[36m@@ -6323,19 +6323,27 @@[m [mkbd {[m
 }[m
 [m
 .l-laitela-unlocks-container {[m
[31m-  width: 70rem;[m
[31m-  margin: auto;[m
[32m+[m[32m  width: 52rem;[m
[32m+[m[32m  display: flex;[m
[32m+[m[32m  flex-wrap: wrap;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.l-laitela-mechanics-container {[m
[32m+[m[32m  display: flex;[m
[32m+[m[32m  align-items: flex-start;[m
[32m+[m[32m  justify-content: center;[m
 }[m
 [m
 .o-laitela-shop-button {[m
[31m-  width: 30rem;[m
[32m+[m[32m  width: 22rem;[m
   padding: 1rem;[m
   background: white;[m
   border: .2rem solid black;[m
   border-radius: .5rem;[m
   margin-left: 1rem;[m
[31m-  margin-top: 2rem;[m
[32m+[m[32m  margin-bottom: 2rem;[m
   font-family: Typewriter;[m
[32m+[m[32m  min-height: 15rem;[m
 }[m
 [m
 .o-laitela-shop-button--available {[m
[36m@@ -6390,9 +6398,10 @@[m [mkbd {[m
   border: .2rem solid black;[m
   border-radius: .5rem;[m
   font-family: Typewriter, serif;[m
[31m-  margin: 2rem;[m
[32m+[m[32m  margin: 2rem auto;[m
   cursor: pointer;[m
   transition-duration: 0.3s;[m
[32m+[m[32m  display: block[m
 }[m
 [m
 .c-laitela-annihilation-button h2 {[m
