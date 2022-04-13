import Vue from "vue";
import PortalVue from 'portal-vue';

import { BootstrapVue, IconsPlugin, ToastPlugin, ModalPlugin } from "bootstrap-vue";

import { firestorePlugin } from 'vuefire';
import VueJwtDecode from 'vue-jwt-decode';
// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import vuetify from "./plugins/vuetify";

import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead);

Vue.use(PortalVue);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);

import VueToast from 'vue-toast-notification';
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueToast, {
  // global options
});
Vue.use(firestorePlugin);
Vue.use(VueJwtDecode);

Vue.filter('toCurrency', function (value) {
  if (typeof value !== "number") {
      return value;
  }
  var formatter = new Intl.NumberFormat('es-PY', {
      style: 'decimal',
      //currency: 'PYG',
      //currencyDisplay: 'PYG',
      useGrouping : true,
      minimumFractionDigits: 0
  });
  return formatter.format(value);
});

Vue.config.productionTip = false;

const app = new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

store.$app = app;