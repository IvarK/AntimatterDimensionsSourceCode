Vue.component("automator-single-block", {
  data() {
    return {
      b: {}
    }
  },
  props: {
    block: Object,
    updateBlock: Function,
    idx: Number
  },
  mounted() {
    this.b = this.block
    if (this.b.targets && !this.b.target) this.b.target = ""
    if (this.b.hasInput && !this.b.inputValue) this.b.inputValue = ""
  },
  template:
    `<div class="c-automator-block-row">
      <div class="o-automator-command">{{ b.cmd }}</div>
      <select v-if="b.targets" @change="updateBlock(block, idx)" v-model="b.target" class="o-automator-block-input">
        <option v-for="target in b.targets" :value="target">{{ target }}</option>
      </select>
      <input v-if="b.hasInput" v-model="b.inputValue" @change="updateBlock(b, idx)" class="o-automator-block-input"/>
    </div>`
});