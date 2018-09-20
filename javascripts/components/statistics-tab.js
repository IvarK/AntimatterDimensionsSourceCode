Vue.component('statistics-tab', {
    props: ['model'],
    template:
        '<statistics-stats-tab :player="model.player"></statistics-stats-tab>'
});
