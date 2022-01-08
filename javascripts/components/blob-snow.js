Vue.component("blob-snow", {
  methods: {
    text() {
      LEN = 23;
      START = "\uE010";
      START_HEX = START.codePointAt(0) || 65;
      const BLOBS = [];
      for (i = 0; i < LEN; i++) {
        char = String.fromCharCode(START_HEX + i);
        BLOBS.push(char);
      }

      return `${BLOBS[Math.floor(Math.random() * BLOBS.length)]}`;
    }
  },

  template: `
    <div class="snowflakes" aria-hidden="true">
    <div class="snowflake">{{ text() }}</div>
    <div class="snowflake">{{ text() }}</div>
    <div class="snowflake">{{ text() }}</div>
    <div class="snowflake">{{ text() }}</div>
    <div class="snowflake">{{ text() }}</div>
    <div class="snowflake">{{ text() }}</div>
    <div class="snowflake">{{ text() }}</div>
    <div class="snowflake">{{ text() }}</div>
    <div class="snowflake">{{ text() }}</div>
    </div>` });