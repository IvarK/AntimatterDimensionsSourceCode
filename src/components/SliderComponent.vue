<script>
import PlusMinusButton from "@/components/PlusMinusButton";

/*
* This is based on vue-slider-component
* downloaded from https://github.com/NightCatSama/vue-slider-component
* It's modified to support showing the slider value in the slider.
*/
/*
The MIT License (MIT)

Copyright (c) 2016 NightCatSama.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Unsharp text [#166](https://github.com/NightCatSama/vue-slider-component/issues/166)
const roundToDPR = (function () {
  const r = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  return value => Math.round(value * r) / r
})()

export default {
  name: "SliderComponent",
  components: {
    PlusMinusButton
  },
  props: {
    width: {
      type: String,
      default: 'auto'
    },
    height: {
      type: String,
      default: "6px"
    },
    data: {
      type: Array,
      default: null
    },
    dotSize: {
      type: [String, Number],
      default: "16px"
    },
    dotWidth: {
      type: String,
      required: false
    },
    dotHeight: {
      type: String,
      required: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    interval: {
      type: Number,
      default: 1
    },
    show: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: [Boolean, Array],
      default: false
    },
    piecewise: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: [String, Boolean],
      default: 'always'
    },
    eventType: {
      type: String,
      default: 'auto'
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    reverse: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    clickable: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 0.5
    },
    realTime: {
      type: Boolean,
      default: false
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array, Object],
      default: 0
    },
    piecewiseLabel: {
      type: Boolean,
      default: false
    },
    debug: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: false
    },
    minRange: {
      type: Number
    },
    maxRange: {
      type: Number
    },
    processDraggable: {
      type: Boolean,
      default: false
    },
    useKeyboard: {
      type: Boolean,
      default: false
    },
    actionsKeyboard: {
      type: Array,
      default() {
        return [(i) => i - 1, (i) => i + 1]
      }
    },
    piecewiseFilter: {
      type: Function
    },
    tooltipMerge: {
      type: Boolean,
      default: true
    },
    startAnimation: {
      type: Boolean,
      default: false
    },
    enableCross: {
      type: Boolean,
      default: true
    },
    valueInDot: {
      type: Boolean,
      default: false
    },
    plusMinusButtons: {
      type: Boolean,
      default: false,
    },
    sliderStyle: [Array, Object, Function],
    focusStyle: [Array, Object, Function],
    tooltipDir: [Array, String],
    xformatter: [String, Function], // Global mixin defines formatter
    mergeFormatter: [String, Function],
    piecewiseStyle: Object,
    disabledStyle: Object,
    piecewiseActiveStyle: Object,
    processStyle: Object,
    processClass: String,
    bgStyle: Object,
    bgClass: String,
    tooltipStyle: [Array, Object, Function],
    disabledDotStyle: [Array, Object, Function],
    labelStyle: Object,
    labelActiveStyle: Object,
    dotClass: [String, Array]
  },
  data() {
    return {
      flag: false,
      dragFlag: false,
      crossFlag: false,
      keydownFlag: null,
      focusFlag: false,
      processFlag: false,
      processSign: null,
      size: 0,
      fixedValue: 0,
      focusSlider: 0,
      currentValue: 0,
      currentSlider: 0,
      isComponentExists: true,
      isMounted: false,
      dotAxialSizePx: 1,
    }
  },
  computed: {
    tooltipFormatHelper() {
      if (this.mergeFormatter) {
        return this.mergeFormatting(this.val[0], this.val[1]);
      }
      if (this.xformatter) {
        if (this.val[0] === this.val[1]) return this.formatting(this.val[0]);
        return this.formatting(this.val[0]) + "-" + this.formatting(this.val[1]);
      }
      if (this.val[0] === this.val[1]) return this.val[0];
      return this.val[0] + "-" + this.val[1];
    },
    dotWidthVal() {
      return this.dotWidth || this.dotSize;
    },
    dotHeightVal() {
      return this.dotHeight || this.dotSize;
    },
    flowDirection() {
      return `l-ad-slider--${this.direction + (this.reverse ? '-reverse' : '')}`
    },
    tooltipMergedPosition() {
      if (!this.isMounted) return {}
      const tooltipDirection = this.tooltipDirection[0]
      if (this.$refs.dot0) {
        const style = {}
        style[tooltipDirection] = `-${(this.dotAxialSizePx / 2) - (this.size / 2) + 9}px`
        style['left'] = `50%`
        return style
      }
    },
    tooltipDirection() {
      const dir = this.tooltipDir || (this.direction === 'vertical' ? 'left' : 'top')
      if (Array.isArray(dir)) {
        return this.isRange ? dir : dir[1]
      } else {
        return this.isRange ? [dir, dir] : dir
      }
    },
    tooltipStatus() {
      return this.tooltip === 'hover' && this.flag ? 'ad-slider-always' : this.tooltip ? `ad-slider-${this.tooltip}` : ''
    },
    tooltipClass() {
      return [`ad-slider-tooltip-${this.tooltipDirection}`, 'ad-slider-tooltip']
    },
    disabledArray() {
      return Array.isArray(this.disabled) ? this.disabled : [this.disabled, this.disabled]
    },
    boolDisabled() {
      return this.disabledArray.every(b => b === true)
    },
    isDisabled() {
      return this.eventType === 'none' ? true : this.boolDisabled
    },
    disabledClass() {
      return this.boolDisabled ? 'l-ad-slider--disabled' : ''
    },
    stateClass() {
      return {
        'ad-slider-state-process-drag': this.processFlag,
        'ad-slider-state-drag': this.flag && !this.processFlag && !this.keydownFlag,
        'ad-slider-state-focus': this.focusFlag
      }
    },
    isRange() {
      return Array.isArray(this.value)
    },
    slider() {
      return this.isRange ? [this.$refs.dot0, this.$refs.dot1] : [this.$refs.dot0]
    },
    minimum() {
      return this.data ? 0 : this.min
    },
    val: {
      get() {
        return this.data ? (this.isRange ? [this.data[this.currentValue[0]], this.data[this.currentValue[1]]] : this.data[this.currentValue]) : this.currentValue
      },
      set(val) {
        if (this.data) {
          if (this.isRange) {
            const index0 = this.data.indexOf(val[0])
            const index1 = this.data.indexOf(val[1])
            if (index0 > -1 && index1 > -1) {
              this.currentValue = [index0, index1]
            }
          } else {
            const index = this.data.indexOf(val)
            if (index > -1) {
              this.currentValue = index
            }
          }
        } else {
          this.currentValue = val
        }
      }
    },
    currentIndex() {
      if (this.isRange) {
        return this.data ? this.currentValue : [this.getIndexByValue(this.currentValue[0]), this.getIndexByValue(this.currentValue[1])]
      } else {
        return this.getIndexByValue(this.currentValue)
      }
    },
    indexRange() {
      if (this.isRange) {
        return this.currentIndex
      } else {
        return [0, this.currentIndex]
      }
    },
    maximum() {
      return this.data ? (this.data.length - 1) : this.max
    },
    multiple() {
      const decimals = `${this.interval}`.split('.')[1]
      return decimals ? Math.pow(10, decimals.length) : 1
    },
    spacing() {
      return this.data ? 1 : this.interval
    },
    total() {
      if (this.data) {
        return this.data.length - 1
      } else if (Math.floor((this.maximum - this.minimum) * this.multiple) % (this.interval * this.multiple) !== 0) {
        this.printError('Prop[interval] is illegal, Please make sure that the interval can be divisible')
      }
      return (this.maximum - this.minimum) / this.interval
    },
    usableSize() {
      return this.size - this.dotAxialSizePx;
    },
    gap() {
      return this.usableSize / this.total
    },
    position() {
      if (this.isRange) {
        return [(this.currentValue[0] - this.minimum) / this.spacing * this.gap + this.dotAxialSizePx / 2, (this.currentValue[1] - this.minimum) / this.spacing * this.gap + this.dotAxialSizePx / 2]
      } else {
        return ((this.currentValue - this.minimum) / this.spacing * this.gap + this.dotAxialSizePx / 2)
      }
    },
    isFixed() {
      return this.fixed || this.minRange
    },
    limit() {
      if (this.isRange) {
        if (this.isFixed) {
          return [[this.dotAxialSizePx / 2, this.dotAxialSizePx / 2 + (this.total - this.fixedValue) * this.gap], [this.fixedValue * this.gap + this.dotAxialSizePx / 2, this.size - this.dotAxialSizePx / 2]]
        } else {
          return [[this.dotAxialSizePx / 2, this.position[1]], [this.position[0], this.size - this.dotAxialSizePx / 2]];
        }
      } else {
        return [this.dotAxialSizePx / 2, this.size - this.dotAxialSizePx / 2];
      }
    },
    valueLimit() {
      return this.isRange ? this.isFixed ? [[this.minimum, this.maximum - (this.fixedValue * (this.spacing * this.multiple)) / this.multiple], [this.minimum + (this.fixedValue * (this.spacing * this.multiple)) / this.multiple, this.maximum]] : [[this.minimum, this.currentValue[1]], [this.currentValue[0], this.maximum]] : [this.minimum, this.maximum]
    },
    idleSlider() {
      return this.currentSlider === 0 ? 1 : 0
    },
    wrapStyles() {
      let ret = this.direction === 'vertical' ? {
        height: this.height,
      } : {
        width: this.width,
      }
      if (this.plusMinusButtons) {
        ret[this.direction === "vertical" ? "margin-top" : "margin-right"] = "0.5rem";
        ret[this.direction === "vertical" ? "margin-bottom" : "margin-left"] = "0.5rem";
      }
      return ret;
    },
    sliderStyles() {
      if (Array.isArray(this.sliderStyle)) {
        return this.isRange ? this.sliderStyle : this.sliderStyle[1]
      } else if (typeof this.sliderStyle === 'function') {
        return this.sliderStyle(this.val, this.currentIndex)
      } else {
        return this.isRange ? [this.sliderStyle, this.sliderStyle] : this.sliderStyle
      }
    },
    focusStyles() {
      if (Array.isArray(this.focusStyle)) {
        return this.isRange ? this.focusStyle : this.focusStyle[1]
      } else if (typeof this.focusStyle === 'function') {
        return this.focusStyle(this.val, this.currentIndex)
      } else {
        return this.isRange ? [this.focusStyle, this.focusStyle] : this.focusStyle
      }
    },
    disabledDotStyles() {
      const disabledStyle = this.disabledDotStyle
      if (Array.isArray(disabledStyle)) {
        return disabledStyle
      } else if (typeof disabledStyle === 'function') {
        const style = disabledStyle(this.val, this.currentIndex)
        return Array.isArray(style) ? style : [style, style]
      } else if (disabledStyle) {
        return [disabledStyle, disabledStyle]
      } else {
        return [{
          backgroundColor: '#ccc'
        }, {
          backgroundColor: '#ccc'
        }]
      }
    },
    tooltipStyles() {
      if (Array.isArray(this.tooltipStyle)) {
        return this.isRange ? this.tooltipStyle : this.tooltipStyle[1]
      } else if (typeof this.tooltipStyle === 'function') {
        return this.tooltipStyle(this.val, this.currentIndex)
      } else {
        return this.isRange ? [this.tooltipStyle, this.tooltipStyle] : this.tooltipStyle
      }
    },
    elemStyles() {
      return this.direction === 'vertical' ? {
        width: this.width,
        height: '100%',
        position: "relative"
      } : {
        height: this.height,
        position: "relative"
      }
    },
    draggableStyle() {
      return {
        cursor: this.boolDisabled ? "default" : "pointer"
      };
    },
    dotStyles() {
      let ret = {
        width: this.dotWidthVal,
        height: this.dotHeightVal,
        position: "absolute",
      }
      if (this.direction === "vertical") {
        ret.left = "50%";
      } else {
        ret.top = "50%";
      }
      return ret;
      /*
      return this.direction === 'vertical' ? {
        width: this.dotWidthVal,
        height: this.dotHeightVal,
        left: `${(-(this.dotWidthVal - this.width) / 2)}px`
      } : {
          width: `${this.dotWidthVal}px`,
          height: `${this.dotHeightVal}px`,
          top: `${(-(this.dotHeightVal - this.height) / 2)}px`
        }*/
    },
    piecewiseDotStyle() {
      return {
        width: this.width,
        height: this.height,
      };
    },
    piecewiseDotWrap() {
      if (!this.piecewise && !this.piecewiseLabel) {
        return false
      }
      let arr = []
      for (let i = 0; i <= this.total; i++) {
        const style = this.direction === 'vertical' ? {
          bottom: `${this.gap * i - this.usableSize / 2 }px`,
          left: 0
        } : {
          left: `${this.gap * i - this.usableSize / 2 }px`,
          top: 0
        }
        const index = this.reverse ? (this.total - i) : i
        const label = this.data ? this.data[index] : (this.spacing * index) + this.min
        if (this.piecewiseFilter && !this.piecewiseFilter({ index, label })) {
          continue
        }
        arr.push({
          style,
          index,
          label: this.xformatter ? this.formatting(label) : label
        })
      }
      return arr
    },
  },
  watch: {
    value(val) {
      this.flag || this.setValue(val, true)
    },
    max(val) {
      if (val < this.min) {
        return this.printError('The maximum value can not be less than the minimum value.')
      }
      const resetVal = this.limitValue(this.val)
      this.setValue(resetVal)
      this.refresh()
    },
    min(val) {
      if (val > this.max) {
        return this.printError('The minimum value can not be greater than the maximum value.')
      }
      const resetVal = this.limitValue(this.val)
      this.setValue(resetVal)
      this.refresh()
    },
    show(bool) {
      if (bool && !this.size) {
        this.$nextTick(() => {
          this.refresh()
        })
      }
    },
    fixed() {
      this.computedFixedValue()
    },
    minRange() {
      this.computedFixedValue()
    },
    reverse() {
      this.$refs.process.style.cssText = ''
      this.refresh()
    },
  },
  methods: {
    bindEvents() {
      document.addEventListener('touchmove', this.moving, { passive: false })
      document.addEventListener('touchend', this.moveEnd, { passive: false })
      document.addEventListener('mousedown', this.blurSlider)
      document.addEventListener('mousemove', this.moving)
      document.addEventListener('mouseup', this.moveEnd)
      document.addEventListener('mouseleave', this.moveEnd)
      document.addEventListener('keydown', this.handleKeydown)
      document.addEventListener('keyup', this.handleKeyup)
      window.addEventListener('resize', this.refresh)
      if (this.isRange && this.tooltipMerge) {
        this.$refs.dot0.addEventListener('transitionend', this.handleOverlapTooltip)
        this.$refs.dot1.addEventListener('transitionend', this.handleOverlapTooltip)
      }
    },
    unbindEvents() {
      document.removeEventListener('touchmove', this.moving)
      document.removeEventListener('touchend', this.moveEnd)
      document.removeEventListener('mousedown', this.blurSlider)
      document.removeEventListener('mousemove', this.moving)
      document.removeEventListener('mouseup', this.moveEnd)
      document.removeEventListener('mouseleave', this.moveEnd)
      document.removeEventListener('keydown', this.handleKeydown)
      document.removeEventListener('keyup', this.handleKeyup)
      window.removeEventListener('resize', this.refresh)
      if (this.isRange && this.tooltipMerge) {
        this.$refs.dot0.removeEventListener('transitionend', this.handleOverlapTooltip)
        this.$refs.dot1.removeEventListener('transitionend', this.handleOverlapTooltip)
      }
    },
    handleKeydown(e) {
      if (!this.useKeyboard || !this.focusFlag) {
        return false
      }
      switch (e.keyCode) {
        case 37:
        case 40:
          e.preventDefault()
          this.keydownFlag = true
          this.flag = true
          this.changeFocusSlider(this.actionsKeyboard[0])
          break
        case 38:
        case 39:
          e.preventDefault()
          this.keydownFlag = true
          this.flag = true
          this.changeFocusSlider(this.actionsKeyboard[1])
          break
      }
    },
    handleKeyup() {
      if (this.keydownFlag) {
        this.keydownFlag = false
        this.flag = false
      }
    },
    changeFocusSlider(fn) {
      if (this.isRange) {
        let arr = this.currentIndex.map((index, i) => {
          if (i === this.focusSlider || this.fixed) {
            const val = fn(index)
            const range = this.fixed ? this.valueLimit[i] : [0, this.total]
            if (val <= range[1] && val >= range[0]) {
              return val
            }
          }
          return index
        })
        if (arr[0] > arr[1]) {
          this.focusSlider = this.focusSlider === 0 ? 1 : 0
          arr = arr.reverse()
        }
        this.setIndex(arr)
      } else {
        this.setIndex(fn(this.currentIndex))
      }
    },
    blurSlider(e) {
      const dot = this.isRange ? this.$refs[`dot${this.focusSlider}`] : this.$refs.dot
      if (!dot || dot === e.target || dot.contains(e.target)) {
        return false
      }
      this.focusFlag = false
    },
    formatting(value) {
      return typeof this.xformatter === 'string' ? this.xformatter.replace(/\{value\}/, value) : this.xformatter(value)
    },
    mergeFormatting(value1, value2) {
      return typeof this.mergeFormatter === 'string' ? this.mergeFormatter.replace(/\{(value1|value2)\}/g, (_, key) => key === 'value1' ? value1 : value2) : this.mergeFormatter(value1, value2)
    },
    getPos(e) {
      this.realTime && this.getStaticData()
      var rect = this.$refs.elem.getBoundingClientRect();
      return this.direction === 'vertical' ? (this.reverse ? (e.clientY - rect.top) : (this.size - (e.clientY - rect.top))) : (this.reverse ? (this.size - (e.clientX - rect.left)) : (e.clientX - rect.left))
    },
    processClick(e) {
      if (this.fixed) {
        e.stopPropagation()
      }
    },
    wrapClick(e) {
      if (this.isDisabled || !this.clickable || this.processFlag || this.dragFlag) return false
      const pos = this.getPos(e)
      if (this.isRange) {
        if (this.disabledArray.every(b => b === false)) {
          this.currentSlider = pos > ((this.position[1] - this.position[0]) / 2 + this.position[0]) ? 1 : 0
        } else if (this.disabledArray[0]) {
          if (pos < this.position[0]) return false
          this.currentSlider = 1
        } else if (this.disabledArray[1]) {
          if (pos > this.position[1]) return false
          this.currentSlider = 0
        }
      }
      if (this.disabledArray[this.currentSlider]) {
        return false
      }
      this.setValueOnPos(pos)
      if (this.isRange && this.tooltipMerge) {
        const timer = setInterval(() => this.handleOverlapTooltip(), 16.7)
        setTimeout(() => window.clearInterval(timer), this.speed * 1000)
      }
    },
    moveStart(e, index = 0, isProcess) {
      if (this.disabledArray[index]) {
        return false
      }
      if (this.stopPropagation) {
        e.stopPropagation()
      }
      if (this.isRange) {
        this.currentSlider = index
        if (isProcess) {
          if (!this.processDraggable) {
            return false
          }
          this.processFlag = true
          this.processSign = {
            pos: this.position,
            start: this.getPos((e.targetTouches && e.targetTouches[0]) ? e.targetTouches[0] : e)
          }
        }
        if (!this.enableCross && this.val[0] === this.val[1]) {
          this.crossFlag = true
        }
      }
      if (!isProcess && this.useKeyboard) {
        this.focusFlag = true
        this.focusSlider = index
      }
      this.flag = true
      this.$emit('drag-start', this)
    },
    moving(e) {
      if (this.stopPropagation) {
        e.stopPropagation()
      }
      if (!this.flag) return false
      e.preventDefault()
      if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0]
      if (this.processFlag) {
        this.currentSlider = 0
        this.setValueOnPos(this.processSign.pos[0] + this.getPos(e) - this.processSign.start, true)
        this.currentSlider = 1
        this.setValueOnPos(this.processSign.pos[1] + this.getPos(e) - this.processSign.start, true)
      } else {
        this.dragFlag = true
        this.setValueOnPos(this.getPos(e), true)
      }
      if (this.isRange && this.tooltipMerge) {
        this.handleOverlapTooltip()
      }
    },
    moveEnd(e) {
      if (this.stopPropagation) {
        e.stopPropagation()
      }
      if (this.flag) {
        this.$emit('drag-end', this)
        if (this.lazy && this.isDiff(this.val, this.value)) {
          this.syncValue()
        }
      } else {
        return false
      }
      this.flag = false
      window.setTimeout(() => {
        this.crossFlag = false
        this.dragFlag = false
        this.processFlag = false
      }, 0)
      this.setPosition()
    },
    setValueOnPos(pos, isDrag) {
      const range = this.isRange ? this.limit[this.currentSlider] : this.limit
      const valueRange = this.isRange ? this.valueLimit[this.currentSlider] : this.valueLimit
      const index = Math.round((pos - this.dotAxialSizePx / 2) / this.gap)
      if (pos >= range[0] && pos <= range[1]) {
        const v = this.getValueByIndex(index)
        this.setTransform(pos)
        this.setCurrentValue(v, isDrag)
        if (this.isRange && (this.fixed || this.isLessRange(pos, index))) {
          this.setTransform(pos + ((this.fixedValue * this.gap) * (this.currentSlider === 0 ? 1 : -1)), true)
          this.setCurrentValue((v * this.multiple + (this.fixedValue * this.spacing * this.multiple * (this.currentSlider === 0 ? 1 : -1))) / this.multiple, isDrag, true)
        }
      } else {
        const anotherSlider = pos < range[0] ? 0 : 1
        const currentSlider = anotherSlider === 0 ? 1 : 0
        this.setTransform(range[anotherSlider])
        this.setCurrentValue(valueRange[anotherSlider])
        if (this.isRange && (this.fixed || this.isLessRange(pos, index))) {
          this.setTransform(this.limit[this.idleSlider][anotherSlider], true)
          this.setCurrentValue(this.valueLimit[this.idleSlider][anotherSlider], isDrag, true)
        } else if (this.isRange && (this.enableCross || this.crossFlag) && !this.isFixed && !this.disabledArray[anotherSlider] && this.currentSlider === currentSlider) {
          this.focusSlider = anotherSlider
          this.currentSlider = anotherSlider
        }
      }
      this.crossFlag = false
    },
    isLessRange(pos, index) {
      if (!this.isRange || (!this.minRange && !this.maxRange)) {
        return false
      }
      const diff = this.currentSlider === 0 ? this.currentIndex[1] - index : index - this.currentIndex[0]
      if (this.minRange && diff <= this.minRange) {
        this.fixedValue = this.minRange
        return true
      }
      if (this.maxRange && diff >= this.maxRange) {
        this.fixedValue = this.maxRange
        return true
      }
      this.computedFixedValue()
      return false
    },
    isDiff(a, b) {
      if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
        return true
      } else if (Array.isArray(a) && a.length === b.length) {
        return a.some((v, i) => v !== b[i])
      }
      return a !== b
    },
    setCurrentValue(val, isDrag, isIdleSlider) {
      const slider = isIdleSlider ? this.idleSlider : this.currentSlider
      if (val < this.minimum || val > this.maximum) return false
      if (this.isRange) {
        if (this.isDiff(this.currentValue[slider], val)) {
          this.currentValue.splice(slider, 1, val)
          if (!this.lazy || !this.flag) {
            this.syncValue()
          }
        }
      } else if (this.isDiff(this.currentValue, val)) {
        this.currentValue = val
        if (!this.lazy || !this.flag) {
          this.syncValue()
        }
      }
      isDrag || this.setPosition()
    },
    getValueByIndex(index) {
      return ((this.spacing * this.multiple) * index + (this.minimum * this.multiple)) / this.multiple
    },
    getIndexByValue(value) {
      return Math.round((value - this.minimum) * this.multiple) / (this.spacing * this.multiple)
    },
    setIndex(val) {
      if (Array.isArray(val) && this.isRange) {
        let value
        if (this.data) {
          value = [this.data[val[0]], this.data[val[1]]]
        } else {
          value = [this.getValueByIndex(val[0]), this.getValueByIndex(val[1])]
        }
        this.setValue(value)
      } else {
        val = this.getValueByIndex(val)
        if (this.isRange) {
          this.currentSlider = val > ((this.currentValue[1] - this.currentValue[0]) / 2 + this.currentValue[0]) ? 1 : 0
        }
        this.setCurrentValue(val)
      }
    },
    increment(dir) {
      if (this.boolDisabled) return;
      const newVal = this.getValue() + dir * this.interval;
      if (newVal > this.max || newVal < this.min) return;
      this.setValue(newVal);
    },
    setValue(val, noCb, speed) {
      if (this.isDiff(this.val, val)) {
        const resetVal = this.limitValue(val)
        this.val = this.isRange ? resetVal.concat() : resetVal
        this.computedFixedValue()
        this.syncValue(noCb)
      }
      this.$nextTick(() => this.setPosition(speed))
    },
    computedFixedValue() {
      if (!this.isFixed) {
        this.fixedValue = 0
        return false
      }
      this.fixedValue = Math.max(this.fixed ? this.currentIndex[1] - this.currentIndex[0] : 0, this.minRange || 0)
    },
    setPosition(speed) {
      this.flag || this.setTransitionTime(speed === undefined ? this.speed : speed)
      if (this.isRange) {
        this.setTransform(this.position[0], this.currentSlider === 1)
        this.setTransform(this.position[1], this.currentSlider === 0)
      } else {
        this.setTransform(this.position)
      }
      this.flag || this.setTransitionTime(0)
    },
    setTransform(val, isIdleSlider) {
      const slider = isIdleSlider ? this.idleSlider : this.currentSlider
      const value = roundToDPR((this.direction === 'vertical' ? ((this.dotAxialSizePx / 2) - val) : (val - (this.dotAxialSizePx / 2))) * (this.reverse ? -1 : 1))
      const translateValue = this.direction === 'vertical' ? `translate(-50%, ${value}px)` : `translate(${value}px, -50%)`
      const processSize = this.fixed ? `${this.fixedValue * this.gap}px` : `${slider === 0 ? this.position[1] - val : val - this.position[0]}px`
      const processPos = this.fixed ? `${slider === 0 ? val : (val - this.fixedValue * this.gap)}px` : `${slider === 0 ? val : this.position[0]}px`
      this.slider[slider].style.transform = translateValue
      this.slider[slider].style.WebkitTransform = translateValue
      this.slider[slider].style.msTransform = translateValue
      if (this.isRange) {
        if (this.direction === 'vertical') {
          this.$refs.process.style.height = processSize
          this.$refs.process.style[this.reverse ? 'top' : 'bottom'] = processPos
        } else {
          this.$refs.process.style.width = processSize
          this.$refs.process.style[this.reverse ? 'right' : 'left'] = processPos
        }
      } else {
        if (this.direction === 'vertical') {
          this.$refs.process.style.height = `${val}px`
          this.$refs.process.style[this.reverse ? 'top' : 'bottom'] = 0
        } else {
          this.$refs.process.style.width = `${val}px`
          this.$refs.process.style[this.reverse ? 'right' : 'left'] = 0
        }
      }
    },
    setTransitionTime(time) {
      // In order to avoid browser merge style and modify together
      time || this.$refs.process.offsetWidth
      for (let i = 0; i < this.slider.length; i++) {
        this.slider[i].style.transitionDuration = `${time}s`
        this.slider[i].style.WebkitTransitionDuration = `${time}s`
      }
      if (this.isRange) {
        this.$refs.process.style.transitionDuration = `${time}s`
        this.$refs.process.style.WebkitTransitionDuration = `${time}s`
      } else {
        this.$refs.process.style.transitionDuration = `${time}s`
        this.$refs.process.style.WebkitTransitionDuration = `${time}s`
      }
    },
    limitValue(val) {
      if (this.data) {
        return val
      }
      const inRange = (v) => {
        if (v < this.min) {
          this.printError(`The value of the slider is ${val}, the minimum value is ${this.min}, the value of this slider can not be less than the minimum value`)
          return this.min
        } else if (v > this.max) {
          this.printError(`The value of the slider is ${val}, the maximum value is ${this.max}, the value of this slider can not be greater than the maximum value`)
          return this.max
        }
        return v
      }
      if (this.isRange) {
        return val.map((v) => inRange(v))
      } else {
        return inRange(val)
      }
    },
    isActive(index) {
      return index >= this.indexRange[0] && index <= this.indexRange[1]
    },
    syncValue(noCb) {
      let val = this.isRange ? this.val.concat() : this.val
      this.$emit('input', val)
      this.keydownFlag && this.$emit('on-keypress', val)
      noCb || this.$emit('callback', val)
    },
    getValue() {
      return this.val
    },
    getIndex() {
      return this.currentIndex
    },
    getStaticData() {
      if (this.$refs.elem) {
        this.size = this.direction === 'vertical' ? this.$refs.elem.offsetHeight : this.$refs.elem.offsetWidth
        this.dotAxialSizePx = this.direction === 'vertical' ? this.$refs.dot0.clientHeight : this.$refs.dot0.clientWidth;
      }
    },
    refresh() {
      if (this.$refs.elem) {
        this.getStaticData()
        this.computedFixedValue()
        this.setPosition(0)
      }
    },
    printError(msg) {
      if (this.debug) {
        console.error(`[VueSlider error]: ${msg}`)
      }
    },
    handleOverlapTooltip() {
      const isDirectionSame = this.tooltipDirection[0] === this.tooltipDirection[1]
      if (this.isRange && isDirectionSame) {
        const tooltip0 = this.reverse ? this.$refs.tooltip1 : this.$refs.tooltip0
        const tooltip1 = this.reverse ? this.$refs.tooltip0 : this.$refs.tooltip1
        const tooltip0Rect = tooltip0.getBoundingClientRect()
        const tooltip1Rect = tooltip1.getBoundingClientRect()
        const tooltip0Right = tooltip0Rect.right
        const tooltip1Left = tooltip1Rect.left
        const tooltip0Y = tooltip0Rect.top
        const tooltip1Y = tooltip1Rect.top + tooltip1Rect.height
        const horizontalOverlap = this.direction === 'horizontal' && tooltip0Right > tooltip1Left
        const verticalOverlap = this.direction === 'vertical' && tooltip1Y > tooltip0Y
        if (horizontalOverlap || verticalOverlap) {
          this.handleDisplayMergedTooltip(true)
        } else {
          this.handleDisplayMergedTooltip(false)
        }
      }
    },
    handleDisplayMergedTooltip(show) {
      const tooltip0 = this.$refs.tooltip0
      const tooltip1 = this.$refs.tooltip1
      const mergedTooltip = this.$refs.process.getElementsByClassName('vue-merged-tooltip')[0]
      if (show) {
        tooltip0.style.visibility = 'hidden'
        tooltip1.style.visibility = 'hidden'
        mergedTooltip.style.visibility = 'visible'
      } else {
        tooltip0.style.visibility = 'visible'
        tooltip1.style.visibility = 'visible'
        mergedTooltip.style.visibility = 'hidden'
      }
    },
    dotContents() {
      if (Notations.current.name === "Blind" || Theme.current().name === "S9" ) return "";
      // Doesn't work if the slider needs to show more precision than integers,
      // but I don't think we have any such sliders.
      return this.valueInDot ? Math.round(this.getValue()) : '';
    },
  },
  mounted() {
    this.isComponentExists = true
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return this.printError('window or document is undefined, can not be initialization.')
    }
    this.$nextTick(() => {
      if (this.isComponentExists) {
        this.getStaticData()
        this.setValue(this.limitValue(this.value), true, this.startAnimation ? this.speed : 0)
        this.bindEvents()
        if (this.isRange && this.tooltipMerge && !this.startAnimation) {
          this.$nextTick(() => {
            this.handleOverlapTooltip()
          })
        }
      }
    })
    this.isMounted = true
  },
  beforeDestroy() {
    this.isComponentExists = false
    this.unbindEvents()
  }
};
</script>

<template>
  <div :class="['l-ad-slider', flowDirection, disabledClass, { 'l-ad-slider--has-label': piecewiseLabel }]"
       v-show="show">
    <PlusMinusButton v-if="plusMinusButtons" type="minus" @click="increment(-1)"/>
    <div ref="wrap"
         :class="['l-ad-slider__wrap', stateClass]"
         :style="[wrapStyles, boolDisabled ? disabledStyle : null]"
         @click="wrapClick">
      <div ref="elem" aria-hidden="true" :class="['l-ad-slider__bg', 'c-ad-slider__bg', bgClass]"
        :style="[elemStyles, bgStyle, draggableStyle]"
        @mousedown="moveStart($event, 0, true)"
        @touchstart="moveStart($event, 0, true)"
      >
        <template v-if="isRange">
          <div
            ref="dot0"
            key="dot0"
            :class="[tooltipStatus, 'l-ad-slider__dot', 'c-ad-slider__dot',
            {
              'l-ad-slider__dot--focus': focusFlag && focusSlider === 0,
              'l-ad-slider__dot--dragging': flag && currentSlider === 0,
              'l-ad-slider__dot--disabled': !boolDisabled && disabledArray[0]
            }
          ]"
            :style="dotStyles"
            @mousedown="moveStart"
            @touchstart="moveStart"
          >
            <div
              :class="['l-ad-slider__dot-handle', 'c-ad-slider__dot-handle', dotClass]"
              :style="[
              (!boolDisabled && disabledArray[0])
              ? disabledDotStyles[0]
              : null,
              sliderStyles[0],
              focusFlag && focusSlider === 0 ? focusStyles[0]: null
            ]"
            ></div>
            <div ref="tooltip0" :class="['ad-slider-tooltip-' + tooltipDirection[0], 'ad-slider-tooltip-wrap']">
              <span class="ad-slider-tooltip" :style="tooltipStyles[0]">{{ xformatter ? formatting(val[0]) : val[0] }}</span>
            </div>
          </div>
          <div
            ref="dot1"
            key="dot1"
            :class="[tooltipStatus, 'l-ad-slider__dot', 'c-ad-slider__dot',
            {
              'l-ad-slider__dot--focus': focusFlag && focusSlider === 1,
              'l-ad-slider__dot--dragging': flag && currentSlider === 1,
              'l-ad-slider__dot--disabled': !boolDisabled && disabledArray[1]
            }
          ]"
            :style="dotStyles"
            @mousedown="moveStart($event, 1)"
            @touchstart="moveStart($event, 1)"
          >
            <div
              :class="['l-ad-slider__dot-handle', 'c-ad-slider__dot-handle', dotClass]"
              :style="[
              (!boolDisabled && disabledArray[1])
              ? disabledDotStyles[1]
              : null,
              sliderStyles[1],
              focusFlag && focusSlider === 1 ? focusStyles[1]: null
            ]"
            ></div>
            <div ref="tooltip1" :class="['ad-slider-tooltip-' + tooltipDirection[1], 'ad-slider-tooltip-wrap']">
              <span class="ad-slider-tooltip" :style="tooltipStyles[1]">{{ xformatter ? formatting(val[1]) : val[1] }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            ref="dot0"
            key="dot0"
            :class="[tooltipStatus, 'l-ad-slider__dot', 'c-ad-slider__dot',
            {
              'l-ad-slider__dot--focus': focusFlag && focusSlider === 0,
              'l-ad-slider__dot--dragging': flag && currentSlider === 0
            }
          ]"
            :style="dotStyles"
            @mousedown="moveStart"
            @touchstart="moveStart"
          >
            <div :class="['l-ad-slider__dot-handle', 'c-ad-slider__dot-handle', dotClass]"
                 :style="[sliderStyles, focusFlag && focusSlider === 0 ? focusStyles : null]">
              {{dotContents(0)}}
            </div>
            <div :class="['ad-slider-tooltip-' + tooltipDirection, 'ad-slider-tooltip-wrap']">
              <span class="ad-slider-tooltip" :style="tooltipStyles">{{ xformatter ? formatting(val) : val }}</span>
            </div>
          </div>
        </template>
        <ul class="ad-slider-piecewise">
          <li
            v-for="(piecewiseObj, index) in piecewiseDotWrap"
            class="ad-slider-piecewise-item"
            :style="[piecewiseDotStyle, piecewiseObj.style]"
            :key="index"
          >
            <span
              v-if="piecewise"
              class="ad-slider-piecewise-dot"
              :style="[ piecewiseStyle, isActive(piecewiseObj.index) ? piecewiseActiveStyle : null ]"
            ></span>

            <span
              v-if="piecewiseLabel"
              class="ad-slider-piecewise-label"
              :style="[ labelStyle, isActive(piecewiseObj.index) ? labelActiveStyle : null ]"
            >
              {{ piecewiseObj.label }}
            </span>
          </li>
        </ul>
        <div
          ref="process"
          :class="['l-ad-slider__process', 'c-ad-slider__process', { 'ad-slider-process-draggable': isRange && processDraggable }, processClass]"
          :style="[elemStyles, bgStyle, draggableStyle]"
          @click="processClick"
        >
          <div
            ref="mergedTooltip"
            :class="['vue-merged-tooltip', 'ad-slider-tooltip-' + tooltipDirection[0], 'ad-slider-tooltip-wrap']"
            :style="tooltipMergedPosition"
          >
            <span class="ad-slider-tooltip" :style="tooltipStyles">
              {{ tooltipFormatHelper }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <PlusMinusButton v-if="plusMinusButtons" type="plus" @click="increment(1)"/>
  </div>
</template>
