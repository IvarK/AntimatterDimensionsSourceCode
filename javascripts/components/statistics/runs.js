const pastRunsMixin = {
    methods: {
        runGain(run) {
            return shortenDimensions(run[1])
        }
    }
};

Vue.component('statistic-past-infinities', {
    mixins: [pastRunsMixin],
    props: ['model'],
    template:
        '<statistic-past-runs\
            :runs="model.player.lastTenRuns"\
            singular="Infinity"\
            plural="Infinities"\
            points="IP"\
            :reward="reward"\
            >\
        </statistic-past-runs>',
    data: function() {
        return {
            reward: function(run) {
                return this.runGain(run) + " IP";
            }
        }
    }
});

Vue.component('statistic-past-eternities', {
    mixins: [pastRunsMixin],
    props: ['model'],
    template:
        '<statistic-past-runs\
            :runs="model.player.lastTenEternities"\
            singular="Eternity"\
            plural="Eternities"\
            points="EP"\
            :reward="reward"\
            >\
        </statistic-past-runs>',
    data: function() {
        return {
            reward: function(run) {
                return this.runGain(run) + " EP";
            }
        }
    }
});

Vue.component('statistic-past-realities', {
    mixins: [pastRunsMixin],
    props: ['model'],
    template:
        '<statistic-past-runs\
            :runs="model.player.lastTenRealities"\
            singular="Reality"\
            plural="Realities"\
            points="RM"\
            :reward="reward"\
            >\
        </statistic-past-runs>',
    data: function() {
        return {
            reward: function(run) {
                let rm = run[1].eq(1) ? " reality machine" : " reality machines";
                return this.runGain(run) + rm + " and a level " + run[2] + " glyph";
            }
        }
    }
});

Vue.component('statistic-past-runs', {
    mixins: [pastRunsMixin],
    props: {
        runs: Array,
        singular: String,
        plural: String,
        points: String,
        reward: Function
    },
    data: function() {
        return {
            tabs: [
                { name: "Statistics", component: "statistics-stats-tab" },
            ]
        };
    },
    template:
        '<div class="statstab2">\
            <div v-for="(run, index) in runs">\
                <span>The {{ singular }} {{ index + 1 }} {{ index === 0 ? singular : plural }} ago took {{ runTime(run) }} </span>\
                <span>and gave {{ reward(run) }}. {{ averageRunGain(run) }}</span>\
            </div>\
            <br>\
            <div>\
                <span>Last 10 {{ plural }} average time: {{ runTime(averageRun) }} </span>\
                <span>Average {{ points }} gain: {{ averageRunGain(averageRun) }} {{ points }}.</span>\
            </div>\
        </div>',
    methods: {
        averageGain: function(time, amount) {
            let rpm = gainRatePerMinute(amount, time);
            var tempstring = shorten(rpm) + " IP/min";
            if (rpm < 1) tempstring = shorten(rpm * 60) + " IP/hour";
            return tempstring;
        },
        averageRunGain: function(run) {
            return this.averageGain(run[0], run[1]);
        },
        runTime(run) {
            return timeDisplayShort(run[0]);
        }
    },
    computed: {
        averageRun: function() {
            return averageRun(this.runs);
        }
    }
});