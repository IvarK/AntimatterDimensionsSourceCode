Vue.component('modal-message', {
    template:
        '<div class="modal-message">\
            <div v-html="$viewModel.modal.message"/>\
            <primary-button @click="emitClose">Okay</primary-button>\
        </div>'
});