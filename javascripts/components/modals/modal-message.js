Vue.component('modal-message', {
    template:
        `<div class="c-modal-message l-modal-content--centered">
            <div
              class="c-modal-message__text"
              v-html="$viewModel.modal.message"
            />
            <primary-button
              class="c-primary-btn--width-medium c-modal-message__okay-btn"
              @click="emitClose"
            >Okay</primary-button>
        </div>`
});