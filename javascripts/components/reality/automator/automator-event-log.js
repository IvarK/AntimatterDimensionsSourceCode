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
      events: [],
      newestFirst: false,
      timestampMode: 0,
      currentTime: 0,
    };
  },
  methods: {
    update() {
      // eslint-disable-next-line no-nested-ternary
      const sorted = AutomatorData.eventLog.sort((a, b) => (a.timestamp === b.timestamp
        ? (a.thisReality === b.thisReality
          ? a.line - b.line
          : a.thisReality - b.thisReality)
        : a.timestamp - b.timestamp));
      this.events = this.newestFirst ? sorted.reverse() : sorted;
      this.currentTime = Date.now();
    },
    clearLog() {
      AutomatorData.clearEventLog();
    },
    sortStyle(selected) {
      return {
        "color": selected ? "green" : ""
      };
    },
    timestampStyle(selected) {
      return {
        "color": this.timestampMode === selected ? "green" : ""
      };
    },
    timestampModeConst(key) {
      return AUTOMATOR_EVENT_TIMESTAMP_MODE[key];
    },
    timestamp(entry) {
      switch (this.timestampMode) {
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.DISABLED:
          return "";
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.THIS_REALITY:
          return `, ${TimeSpan.fromSeconds(entry.thisReality).toStringShort()} in this Reality`;
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
    }
  },
  template: `
    <div class="c-automator-docs-page">
      <div>
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
          @click="clearLog()"
          v-tooltip="'Clear all entries'"
        />
      </div>
      <div>
        <b>Timestamp style:</b>
        <button
          :style="timestampStyle(timestampModeConst('DISABLED'))"
          class="fas fa-ban"
          @click="timestampMode = timestampModeConst('DISABLED')"
          v-tooltip="'No timestamps'"
        />
        <button
          :style="timestampStyle(timestampModeConst('THIS_REALITY'))"
          class="fas fa-stopwatch"
          @click="timestampMode = timestampModeConst('THIS_REALITY')"
          v-tooltip="'Current time this Reality'"
        />
        <button
          :style="timestampStyle(timestampModeConst('RELATIVE_NOW'))"
          class="fas fa-clock"
          @click="timestampMode = timestampModeConst('RELATIVE_NOW')"
          v-tooltip="'Time elapsed since event'"
        />
        <button
          :style="timestampStyle(timestampModeConst('RELATIVE_PREV'))"
          class="fas fa-arrow-left"
          @click="timestampMode = timestampModeConst('RELATIVE_PREV')"
          v-tooltip="'Time elapsed since event'"
        />
        <button
          :style="timestampStyle(timestampModeConst('DATE_TIME'))"
          class="fas fa-user-clock"
          @click="timestampMode = timestampModeConst('DATE_TIME')"
          v-tooltip="'Date and time'"
        />
      </div>
      <span
        v-for="event in events"
        :key="timestamp(event) + timestampMode + event.line"
      >
        <b>Line {{ event.line }}{{ timestamp(event) }}:</b>
        <div class="c-automator-docs-page__indented">
          <i>{{ event.message }}</i>
        </div>
      </span>
    </div>`
});
