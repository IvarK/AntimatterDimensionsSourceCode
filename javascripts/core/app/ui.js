Vue.mixin({
    methods: {
        emitClick: function() {
            this.$emit('click');
        },
        emitInput: function(val) {
            this.$emit('input', val);
        },
        emitClose: function() {
            this.$emit('close');
        }
    }
});

ui = new Vue({
    el: '#ui',
    data: ui,
    methods: {
        showModal: function(name) {
            ui.view.modal.current = Modal[name] ? Modal[name] : name;
        },
        hideModal: function () {
            ui.view.modal.current = undefined;
        }
    }
});

var Modal = {
    animationOptions: "modal-animation-options",
    confirmationOptions: "modal-confirmation-options",
    loadGame: "modal-load-options"
};

var updateVue = function () {
    ui.model.player = player;
};