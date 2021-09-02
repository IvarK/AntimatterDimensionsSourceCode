"use strict";

const AUTOMATOR_EVENT_TIMESTAMP_MODE = {
  DISABLED: 0,
  THIS_REALITY: 1,
  RELATIVE_NOW: 2,
  RELATIVE_PREV: 3,
  DATE_TIME: 4,
};

Vue.component("automator-event-log", {
  data() {
    return {
      unsortedEvents: [],
      newestFirst: false,
      timestampMode: 0,
      currentTime: 0,
      maxEntries: 0,
      clearOnReality: false,
      clearOnRestart: false,
    };
  },
  watch: {
    newestFirst(newValue) {
      player.options.automatorEvents.newestFirst = newValue;
    },
    timestampMode(newValue) {
      player.options.automatorEvents.timestampType = newValue;
    },
    clearOnReality(newValue) {
      player.options.automatorEvents.clearOnReality = newValue;
    },
    clearOnRestart(newValue) {
      player.options.automatorEvents.clearOnRestart = newValue;
    }
  },
  computed: {
    events() {
      // eslint-disable-next-line no-nested-ternary
      const sorted = this.unsortedEvents.sort((a, b) => (a.timestamp === b.timestamp
        ? (a.thisReality === b.thisReality
          ? a.line - b.line
          : a.thisReality - b.thisReality)
        : a.timestamp - b.timestamp));
      return this.newestFirst ? sorted.reverse() : sorted;
    },
    clearTooltip() {
      return `Clear all entries (Max. ${this.maxEntries})`;
    }
  },
  methods: {
    update() {
      const eventSettings = player.options.automatorEvents;
      this.unsortedEvents = AutomatorData.eventLog;
      this.newestFirst = eventSettings.newestFirst;
      this.timestampMode = eventSettings.timestampType;
      this.currentTime = Date.now();
      this.maxEntries = eventSettings.maxEntries;
      this.clearOnReality = eventSettings.clearOnReality;
      this.clearOnRestart = eventSettings.clearOnRestart;
    },
    clearLog() {
      AutomatorData.clearEventLog();
      this.update();
    },
    sortStyle(selected) {
      return {
        "color": selected ? "green" : ""
      };
    },
    timestampStyle(key) {
      return {
        "color": this.timestampMode === AUTOMATOR_EVENT_TIMESTAMP_MODE[key] ? "green" : ""
      };
    },
    clearRealityStyle() {
      return {
        "color": this.clearOnReality ? "green" : ""
      };
    },
    clearRestartStyle() {
      return {
        "color": this.clearOnRestart ? "green" : ""
      };
    },
    setTimestampMode(key) {
      this.timestampMode = AUTOMATOR_EVENT_TIMESTAMP_MODE[key];
    },
    timestamp(entry) {
      switch (this.timestampMode) {
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.DISABLED:
          return "";
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.THIS_REALITY:
          return `, ${TimeSpan.fromSeconds(entry.thisReality).toStringShort()} (real-time) in Reality`;
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.RELATIVE_NOW:
          return `, ${TimeSpan.fromMilliseconds(this.currentTime - entry.timestamp).toStringShort()} ago`;
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.RELATIVE_PREV:
          if (entry.timegap === entry.timestamp) return `, first logged event`;
          return `, ${TimeSpan.fromMilliseconds(entry.timegap).toStringShort()} after previous event`;
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.DATE_TIME:
          // By default this also gives day of the week and time zone, so remove those
          return `, ${new Date(entry.timestamp).toString().replace(/^.{4}(.*:..:..).*$/u, "$1")}`;
        default:
          throw Error("Unrecognized timestamp mode in Automator event log");
      }
    },
    scrollToLine(line) {
      AutomatorTextUI.scrollToLine(line);
      AutomatorTextUI.updateHighlightedLine(line, "Event");
    }
  },
  template: `
    <div class="c-automator-docs-page">
      <div>
        <i>Note: These are not saved and disappear on refresh</i>
        <br>
        <b>Entry Sorting:</b>
        <button
          :style="sortStyle(!newestFirst)"
          class="fas fa-angle-down"
          @click="newestFirst = false"
          v-tooltip="'Oldest results first'"
        />
        <button
          :style="sortStyle(newestFirst)"
          class="fas fa-angle-up"
          @click="newestFirst = true"
          v-tooltip="'Newest results first'"
        />
        <button
          class="fas fa-trash"
          @click="clearLog"
          v-tooltip="clearTooltip"
        />
        <button
          :style="clearRealityStyle()"
          class="fas fa-eraser"
          @click="clearOnReality = !clearOnReality"
          v-tooltip="'Clear event log every Reality'"
        />
        <button
          :style="clearRestartStyle()"
          class="fas fa-backspace"
          @click="clearOnRestart = !clearOnRestart"
          v-tooltip="'Clear event log on script restart'"
        />
      </div>
      <div>
        <b>Timestamp style:</b>
        <button
          :style="timestampStyle('DISABLED')"
          class="fas fa-ban"
          @click="setTimestampMode('DISABLED')"
          v-tooltip="'No timestamps'"
        />
        <button
          :style="timestampStyle('THIS_REALITY')"
          class="fas fa-stopwatch"
          @click="setTimestampMode('THIS_REALITY')"
          v-tooltip="'Current time this Reality'"
        />
        <button
          :style="timestampStyle('RELATIVE_NOW')"
          class="fas fa-clock"
          @click="setTimestampMode('RELATIVE_NOW')"
          v-tooltip="'Time elapsed since event'"
        />
        <button
          :style="timestampStyle('RELATIVE_PREV')"
          class="fas fa-arrow-left"
          @click="setTimestampMode('RELATIVE_PREV')"
          v-tooltip="'Time since last event'"
        />
        <button
          :style="timestampStyle('DATE_TIME')"
          class="fas fa-user-clock"
          @click="setTimestampMode('DATE_TIME')"
          v-tooltip="'Date and time'"
        />
      </div>
      <span
        v-for="(event, id) in events"
        :key="id"
      >
        <b>Line {{ event.line }}{{ timestamp(event) }}:</b>
        <button
          class="fas fa-arrow-circle-right"
          @click="scrollToLine(event.line)"
          v-tooltip="'Jump to line'"
        />
        <div class="c-automator-docs-page__indented">
          <i>{{ event.message }}</i>
        </div>
      </span>
    </div>`
});
