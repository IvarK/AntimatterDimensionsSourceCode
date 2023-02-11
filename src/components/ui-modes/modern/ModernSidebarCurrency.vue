<script>
export default {
  name: "ModernSidebarCurrency",
  data() {
    return {
      AM: new Decimal(0),
      IP: new Decimal(0),
      EP: new Decimal(0),
      RM: new Decimal(0),
      IM: 0,
      RS: new Decimal(0),
      machineStr: "",
      showIP: false,
      showEP: false,
      showRM: false,
      showRS: false,
    };
  },
  methods: {
    update() {
      this.AM.copyFrom(Currency.antimatter);
      this.IP.copyFrom(Currency.infinityPoints.value.floor());
      this.EP.copyFrom(Currency.eternityPoints.value.floor());
      this.RM.copyFrom(Currency.realityMachines.value.floor());
      this.IM = Currency.imaginaryMachines.value;
      this.RS.copyFrom(Currency.realityShards);
      this.machineStr = formatMachines(this.RM, this.IM);
      this.showIP = PlayerProgress.infinityUnlocked();
      this.showEP = PlayerProgress.eternityUnlocked();
      this.showRM = PlayerProgress.realityUnlocked();
      this.showRS = Pelle.isDoomed;
    }
  },
};
</script>

<template>
  <div class="c-sidebar-resource">
    <template v-if="showRS">
      <h2 class="o-sidebar-currency--pelle">
        {{ format(RS, 2) }}
      </h2>
      <div class="c-sidebar-resource__information">
        <span class="c-sidebar-resource__name">{{ pluralize("Reality Shard", RS) }}</span>
      </div>
    </template>
    <template v-else-if="showRM">
      <template v-if="IM === 0">
        <h2 class="o-sidebar-currency--reality">
          {{ format(RM, 2) }}
        </h2>
        <div class="c-sidebar-resource__information">
          <span class="c-sidebar-resource__name">{{ pluralize("Reality Machine", RM) }}</span>
        </div>
      </template>
      <template v-else>
        <h3 class="o-sidebar-currency--reality">
          {{ machineStr }}
        </h3>
        <div class="c-sidebar-resource__information">
          <span class="c-sidebar-resource__name">Machines</span>
        </div>
      </template>
    </template>
    <template v-else-if="showEP">
      <h2 class="o-sidebar-currency--eternity">
        {{ format(EP, 2) }}
      </h2>
      <div class="c-sidebar-resource__information">
        <span class="c-sidebar-resource__name">{{ pluralize("Eternity Point", EP) }}</span>
      </div>
    </template>
    <template v-else-if="showIP">
      <h2 class="o-sidebar-currency--infinity">
        {{ format(IP, 2) }}
      </h2>
      <div class="c-sidebar-resource__information">
        <span class="c-sidebar-resource__name">{{ pluralize("Infinity Point", IP) }}</span>
      </div>
    </template>
    <template v-else>
      <h2 class="o-sidebar-currency--antimatter">
        {{ format(AM, 2, 1) }}
      </h2>
      <div class="c-sidebar-resource__information">
        <span class="c-sidebar-resource__name">Antimatter</span>
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
