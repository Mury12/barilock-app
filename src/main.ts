import Vue from "./prototype";
import App from "./App.vue";
import { createPinia, PiniaVuePlugin } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import PageTitle from "@/components/PageTitle/PageTitle.vue";
import TheLoader from "@/components/TheLoader/TheLoader.vue";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

library.add(fas);
Vue.component("fa-icon", FontAwesomeIcon);
Vue.component("PageTitle", PageTitle);
Vue.component("TheLoader", TheLoader);

import router from "./router.js";

Vue.config.productionTip = false;

new Vue({
  router,
  data: {
    authenticated: false,
    profile: {},
    onRequest: false,
  },
  pinia,
  render: (h) => h(App),
}).$mount("#app");
