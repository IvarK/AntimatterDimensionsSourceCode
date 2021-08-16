"use strict";

Vue.component("sidebar-currency", {
  data() {
    return {
      AM: new Decimal(0),
      IP: new Decimal(0),
      EP: new Decimal(0),
      RM: new Decimal(0),
      IM: 0,
      showIP: false,
      showEP: false,
      showRM: false,
    };
  },
  methods: {
    update() {
      this.AM.copyFrom(Currency.antimatter.value);
      this.IP.copyFrom(Currency.infinityPoints.value);
      this.EP.copyFrom(Currency.eternityPoints.value);
      this.RM.copyFrom(Currency.realityMachines);
      this.IM = Currency.imaginaryMachines.value;
      this.showIP = PlayerProgress.infinityUnlocked();
      this.showEP = PlayerProgress.eternityUnlocked();
      this.showRM = PlayerProgress.realityUnlocked();
    }
  },
  template: `
    <div class="resource">
      <template v-if="showRM">
        <div v-if="IM === 0">
          <h2 class="o-sidebar-currency--reality">{{ format(RM, 2) }}</h2>
          <div class="resource-information">
            <span class="resource-name">Reality {{ "Machine" | pluralize(RM) }}</span>
          </div>
        </div>
        <div v-else>
          <h3 class="o-sidebar-currency--reality">
            {{ format(RM, 2) }}<br> + {{ format(IM, 2) }}i
          </h3>
          <div class="resource-information">
            <span class="resource-name">Machines</span>
          </div>
        </div>
      </template>
      <div v-else-if="showEP">
        <h2 class="o-sidebar-currency--eternity">
          {{ format(EP, 2) }}
        </h2>
        <div class="resource-information">
          <span class="resource-name">Eternity {{ "Point" | pluralize(EP) }}</span>
        </div>
      </div>
      <div v-else-if="showIP">
        <h2 class="o-sidebar-currency--infinity">
          {{ format(IP, 2) }}
        </h2>
        <div class="resource-information">
          <span class="resource-name">Infinity {{ "Point" | pluralize(IP) }}</span>
        </div>
      </div>
      <template v-else>
        <h2 class="o-sidebar-currency--antimatter">
          {{ format(AM, 2) }}
        </h2>
        <div class="resource-information">
          <span class="resource-name">Antimatter</span>
        </div>
      </template>
    </div>`
});
