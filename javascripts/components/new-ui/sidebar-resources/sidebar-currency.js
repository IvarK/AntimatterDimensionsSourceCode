Vue.component("sidebar-currency", {
  data() {
    return {
      AM: new Decimal(0),
      IP: new Decimal(0),
      EP: new Decimal(0),
      RM: new Decimal(0),
      IM: 0,
      RS: new Decimal(0),
      showIP: false,
      showEP: false,
      showRM: false,
      showRS: false,
    };
  },
  methods: {
    update() {
      this.AM.copyFrom(Currency.antimatter.value);
      this.IP.copyFrom(Currency.infinityPoints.value);
      this.EP.copyFrom(Currency.eternityPoints.value);
      this.RM.copyFrom(Currency.realityMachines);
      this.IM = Currency.imaginaryMachines.value;
      this.RS.copyFrom(Currency.realityShards.value);
      this.showIP = PlayerProgress.infinityUnlocked();
      this.showEP = PlayerProgress.eternityUnlocked();
      this.showRM = PlayerProgress.realityUnlocked();
      this.showRS = Pelle.isDoomed;
    }
  },
  template: `
    <div class="resource">
      <template v-if="showRS">
      <h2 class="o-sidebar-currency--pelle">{{ format(RS, 2) }}</h2>
      <div class="resource-information">
        <span class="resource-name">{{ pluralize("Reality Shard", RS ) }}</span>
      </div>
      </template>
      <template v-else-if="showRM">
        <template v-if="IM === 0">
          <h2 class="o-sidebar-currency--reality">{{ format(RM, 2) }}</h2>
          <div class="resource-information">
            <span class="resource-name">{{ pluralize("Reality Machine", RM) }}</span>
          </div>
        </template>
        <template v-else>
          <h3 class="o-sidebar-currency--reality">
            {{ format(RM, 2) }}<br> + {{ format(IM, 2) }}i
          </h3>
          <div class="resource-information">
            <span class="resource-name">Machines</span>
          </div>
        </template>
      </template>
      <template v-else-if="showEP">
        <h2 class="o-sidebar-currency--eternity">
          {{ format(EP, 2) }}
        </h2>
        <div class="resource-information">
          <span class="resource-name">{{ pluralize("Eternity Point", EP) }}</span>
        </div>
      </template>
      <template v-else-if="showIP">
        <h2 class="o-sidebar-currency--infinity">
          {{ format(IP, 2) }}
        </h2>
        <div class="resource-information">
          <span class="resource-name">{{ pluralize("Infinity Point", IP) }}</span>
        </div>
      </template>
      <template v-else>
        <h2 class="o-sidebar-currency--antimatter">
          {{ format(AM, 2, 1) }}
        </h2>
        <div class="resource-information">
          <span class="resource-name">Antimatter</span>
        </div>
      </template>
    </div>`
});
