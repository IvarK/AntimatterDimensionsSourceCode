"use strict";

Vue.component("notation-wheel", {
  props: {
    segments: {
      default() {
        return [
          {
            textFillStyle: '#fff',
            fillStyle: '#000',
            text: 'Prize 1'
          },
          {
            textFillStyle: '#000',
            fillStyle: '#fadede',
            text: 'Prize 2'
          },
          {
            textFillStyle: '#fff',
            fillStyle: '#000',
            text: 'Prize 3'
          },
          {
            textFillStyle: '#000',
            fillStyle: '#fadede',
            text: 'Prize 4'
          },
          {
            textFillStyle: '#fff',
            fillStyle: '#000',
            text: 'Prize 5'
          },
          {
            textFillStyle: '#000',
            fillStyle: '#fadede',
            text: 'Prize 6'
          },
          {
            textFillStyle: '#fff',
            fillStyle: '#000',
            text: 'Prize 7'
          },
          {
            textFillStyle: '#000',
            fillStyle: '#fadede',
            text: 'Prize 8'
          }
        ]
      }
    }
  },
  data() {
    return {
      loadingPrize: false,
      theWheel: null,
      modalPrize: false,
      wheelPower: 1,
      wheelSpinning: false,
      prizeName: 'BUY 1 GET 1',
      WinWheelOptions: {
        textFontSize: 14,
        outterRadius: 410,
        innerRadius: 25,
        lineWidth: 8,
        animation: {
          type: 'spinOngoing',
          duration: 0.5
        }
      }
    }
  },
  computed: {
    notations: () => Notations.all,
    segments: () => {
      const ret = [];
      for (const notation of notations) {
        const color = Math.floor(Math.random()*16777215).toString(16);
        ret.push(
          {
            text: notation.name,
            textFillStyle: `#${color}`,
            fillStyle: `#${(Number(`0x1${color}`) ^ 0xFFFFFF).toString(16).substr(1)}`,
          }
        )
      }
    }
  },
  mounted() {
    this.initSpin()
  },
  updated() { },
  created() { },
  methods: {
    showPrize() {
      this.modalPrize = true
    },
    hidePrize() {
      this.modalPrize = false
    },
    startSpin() {
      if (this.wheelSpinning === false) {
        this.theWheel.startAnimation()
        this.wheelSpinning = true
        this.theWheel = new Winwheel({
          ...this.WinWheelOptions,
          numSegments: this.segments.length,
          segments: this.segments,
          animation: {
            type: 'spinToStop',
            duration: 5,
            spins: 5,
            callbackFinished: this.onFinishSpin
          }
        })

        // example input prize number get from Backend
        // Important thing is to set the stopAngle of the animation before stating the spin.

        var prizeNumber = Math.floor(Math.random() * this.segments.length) // or just get from Backend
        var stopAt = 360 / this.segments.length * prizeNumber - 360 / this.segments.length / 2 // center pin
        // var stopAt = 360 / this.segments.length * prizeNumber - Math.floor(Math.random() * 60) //random location
        this.theWheel.animation.stopAngle = stopAt
        this.theWheel.startAnimation()
        this.wheelSpinning = false
      }
    },
    resetWheel() {
      this.theWheel = new Winwheel({
        ...this.WinWheelOptions,
        numSegments: this.segments.length,
        segments: this.segments
      })

      if (this.wheelSpinning) {
        this.theWheel.stopAnimation(false) // Stop the animation, false as param so does not call callback function.
      }

      this.theWheel.rotationAngle = 0 // Re-set the wheel angle to 0 degrees.
      this.theWheel.draw() // Call draw to render changes to the wheel.
      this.wheelSpinning = false // Reset to false to power buttons and spin can be clicked again.
    },
    initSpin() {
      this.loadingPrize = true
      this.resetWheel()
      this.loadingPrize = false
    },
    onFinishSpin(indicatedSegment) {
      this.prizeName = indicatedSegment.text
      this.showPrize()
    }
  },
  template: `
    <div class="vue-winwheel">
      <div class="mobile-container">
        <div class="wheel-wrapper">
          <div class="canvas-wrapper">
            <canvas id="canvas" width="310" height="310">
              <p style="{color: white}" align="center">Sorry, your browser doesn't support canvas. Please try Google Chrome.</p>
            </canvas>
          </div>
          <div class="button-wrapper">
            <a class="btn btn-play" href="#" @click.prevent="startSpin()" v-if="!loadingPrize && !wheelSpinning">SPIN!</a>
          </div>
        </div>
      </div>
      <div class="custom-modal modal-mask" id="modalSpinwheel" v-if="modalPrize">
        <div slot="body">
          <a href="" @click.prevent="hidePrize()" class="modal-dismiss">
            <i class="icon_close"></i>
          </a>
          <h2>
            Yay you got the prize!!
          </h2>
          <h1> {{prizeName}}</h1>
        </div>
      </div>
    </div>
  `
});