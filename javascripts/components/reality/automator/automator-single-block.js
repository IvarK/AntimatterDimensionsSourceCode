"use strict";

Vue.component("automator-single-block", {
  data() {
    return {
      b: {}
    }
  },
  props: {
    block: Object,
    updateBlock: Function,
    deleteBlock: Function,
    lineNumber: Number,
  },
  mounted() {
    this.b = this.block
  },
  methods: {
    deleteBlockFromNest(id) {
      let idx = this.b.nest.findIndex( x => x.id == id)
      this.b.nest.splice(idx, 1)
    }
  },
  computed: {
    hasInput() {
      return this.b.hasInput && ( this.b.targetsWithoutInput ? !this.b.targetsWithoutInput.includes(this.b.target) : true )
    },
    hasSecondaryTargets() {
      return this.b.hasSecondaryTargets && ( this.b.targetsWithoutInput ? !this.b.targetsWithoutInput.includes(this.b.target) : true )
    }
  },
  template:
    `<div>
      <div class="c-automator-block-row">
        <div class="o-automator-linenumber">{{ lineNumber + 1 }}</div>
        <div class="o-automator-command">{{ b.cmd }}</div>
        <select v-if="b.targets" @change="updateBlock(block, b.id)" v-model="b.target" class="o-automator-block-input">
          <option v-for="target in b.targets" :value="target">{{ target }}</option>
        </select>
        <select v-if="hasSecondaryTargets" @change="updateBlock(block, b.id)" v-model="b.secondaryTarget" class="o-automator-block-input">
          <option v-for="target in b.secondaryTargets" :value="target">{{ target }}</option>
        </select>
        <input v-if="hasInput" v-model="b.inputValue" @change="updateBlock(b, b.id)" class="o-automator-block-input"/>
        <div @click="deleteBlock(b.id)" class="o-automator-block-delete">X</div>
      </div>
      <draggable v-if="block.nested" class="l-automator-nested-block" v-model="block.nest" group="code-blocks">
          <automator-single-block
            v-for="(block, index) in block.nest" 
            :key="block.id"
            :lineNumber="index"
            :block="block"
            :updateBlock="updateBlock"
            :deleteBlock="deleteBlockFromNest"></automator-single-block>
        </draggable>
    </div>`
});