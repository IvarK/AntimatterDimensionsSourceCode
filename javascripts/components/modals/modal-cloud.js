Vue.component('modal-cloud-load-conflict', {
    props: ['model', 'view'],
    template:
        '<div class="modal-options">\
            <strong>Your cloud save appears to be older than your local save. Please select which one you would like to keep.</strong>\
            <modal-cloud-conflict-record :view="conflict.local" :saveId="conflict.saveId" saveType="local">\
                <primary-button @click="handleClick(false)">Load local</primary-button>\
            </modal-cloud-conflict-record>\
            <modal-cloud-conflict-record :view="conflict.cloud" :saveId="conflict.saveId" saveType="cloud">\
                <primary-button @click="handleClick(true)">Load cloud</primary-button>\
            </modal-cloud-conflict-record>\
        </div>',
    computed: {
        conflict: function() {
            return this.view.modal.cloudConflicts[0];
        }
    },
    methods: {
        handleClick: function(invokeCallback) {
            let conflicts = this.view.modal.cloudConflicts;
            let isLastConflict = conflicts.length === 1;
            if (invokeCallback) {
                this.conflict.callback(isLastConflict)
            }
            if (isLastConflict){
                ui.hideModal();
            }
            conflicts.shift();
        }
    }
});

Vue.component('modal-cloud-conflict-record', {
    props: {
        saveId: Number,
        view: Object,
        saveType: String
    },
    template:
        '<div>\
            <strong>Save #{{ saveId + 1 }} ({{ saveType }}):</strong>\
            <span>Infinities: {{ view.infinities }}</span>\
            <span>Eternities: {{ view.eternities }}</span>\
            <slot></slot>\
        </div>'
});