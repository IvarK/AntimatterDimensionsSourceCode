Vue.component('statistics-tab', {
    props: ['model'],
    data: function() {
        return {
            tabs: [
                { name: "Statistics", component: "statistics-stats-tab" },
            ]
        };
    },
    template:
        '<subtabbed-container :tabs="tabs" :model="model"></subtabbed-container>'
});
