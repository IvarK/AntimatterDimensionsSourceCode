Vue.component('modal-load-game', {
    props: ['model'],
    template:
        '<modal-options @close="emitClose" :closeButton="true">\
            <modal-load-record :saveId="0" :model="model"></modal-load-record>\
            <modal-load-record :saveId="1" :model="model"></modal-load-record>\
            <modal-load-record :saveId="2" :model="model"></modal-load-record>\
        </modal-options>'
});

Vue.component('modal-load-record', {
    props: {
        saveId: Number,
        model: Object
    },
    template:
        '<div>\
            <strong>Save #{{ saveId + 1 }}: <span v-if="isSelected">(selected)</span></strong>\
            <span style="width: 320px;">Antimatter: {{ antimatter }}</span>\
            <primary-button @click="loadSave">Load</primary-button>\
        </div>',
    computed: {
        isSelected: function() {
            return currentSave === this.saveId;
        },
        antimatter: function() {
            if (this.isSelected){
                return this.formatMoney(this.model.player.money);
            }
            let save = saves[this.saveId];
            return this.formatMoney(save ? new Decimal(save.money) : 10);
        }
    },
    methods: {
        loadSave: function() {
            change_save(this.saveId);
        },
        formatMoney: function(money) {
            formatPostBreak = true;
            let formatted = shortenMoney(money);
            formatPostBreak = false;
            return formatted;
        }
    }
});