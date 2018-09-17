Vue.mixin({
    methods: {
        emitClick: function() {
            this.$emit('click')
        },
        emitInput: function(val) {
            this.$emit('input', val)
        }
    }
});

ui = new Vue({
    el: '#ui',
    data: ui,
    methods: {
        showModal: function(name) {
            ui.view.modal = Modal[name] ? Modal[name] : name;
        },
        hideModal: function () {
            ui.view.modal = undefined;
        }
    }
});

var Modal = {
    animationOptions: "modal-animation-options",
    confirmationOptions: "modal-confirmation-options",
};

var updateVue = function () {
    ui.model.player = player;
};