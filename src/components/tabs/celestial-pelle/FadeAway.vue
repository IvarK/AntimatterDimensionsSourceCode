<script>
export default {
  name: "FadeAway",
  data() {
    return {
      opacity: 0
    };
  },
  methods: {
    update() {
      this.opacity = (GameEnd.endState - END_STATE_MARKERS.FADE_AWAY) / 2;
    }
  }
};
</script>

<template>
  <div
    class="c-background-overlay"
    :style="{
      opacity,
      pointerEvents: opacity > 1 ? 'auto' : 'none'
    }"
  />
</template>

<style scoped>
.c-background-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
  background-color: #ffffff;
}

.t-dark .c-background-overlay,
.t-dark-metro .c-background-overlay {
  background-image: url("../../../../public/images/dark-bg.png");
  background-position: center;
}

.t-inverted .c-background-overlay,
.t-inverted-metro .c-background-overlay,
.t-amoled .c-background-overlay,
.t-amoled-metro .c-background-overlay,
.t-s11 .c-background-overlay {
  background-color: black;
}

.t-s1 .c-background-overlay {
  background: url("../../../../public/images/s1-bg.svg") no-repeat;
  background-attachment: fixed;
  background-color: #d72621;
  background-position: center bottom;
  background-size: 100%;
}

.t-s1 .c-background-overlay::before {
  content: "";
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-image: url("../../../../public/images/snow1.png"),
  url("../../../../public/images/snow2.png"),
  url("../../../../public/images/snow3.png");
  animation: a-snow 10s linear infinite, a-snow-fade 10s cubic-bezier(0, 0.3, 1, 0.7) infinite;
}

.t-s2 .c-background-overlay {
  background: url("../../../../public/images/s2-bg.svg") no-repeat;
  background-color: white;
  background-position-x: 50%;
  background-position-y: 50%;
  background-size: 50%;
}

.t-s4 .c-background-overlay {
  background: #ff00ff;
  border-radius: 0 !important;
}

.t-s4 .c-background-overlay::after {
  content: "";
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #0fff0f;
  border-radius: 40%;
}

.t-s5 .c-background-overlay {
  background: url("../../../../public/images/s5-bg.jpg");
  background-position-x: 50%;
  background-position-y: 50%;
  background-size: 150%;
}

.t-s6 .c-background-overlay,
.t-s10 .c-background-overlay {
  background: black;
  background-image: url("../../../../public/images/stars-bg.png");
  background-position: center;
  background-size: 100%;
}

.t-s8 .c-background-overlay {
  background: url("../../../../public/images/s8-bg.jpg") no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.t-s12 .c-background-overlay {
  background: url("../../../../public/images/s12-bg.jpg") no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: brightness(0.5);
}
</style>
