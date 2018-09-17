Vue.mixin({
    methods: {
        emitClick: function () {
            this.$emit('click')
        },
        emitInput: function(val) {
            this.$emit('input', val)
        }
    }
});

ui = new Vue({
    el: '#ui',
    data: ui
});

var updateVue = function () {
    ui.model.player = player;
};