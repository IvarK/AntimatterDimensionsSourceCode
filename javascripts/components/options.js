Vue.component('options', {
    props: ['rows'],
    template:
    '<table>\
        <tr v-for="row in rows">\
          <td v-for="button in row" is="options-button" :button="button" />\
        </tr>\
     </table>'
});

Vue.component('options-button', {
    props: ['button'],
    template:
    '<button class="storebtn" style="color:black; width: 200px; height: 55px; font-size: 20px" @click="button.action">\
        {{ button.name }}\
    </button>'
});