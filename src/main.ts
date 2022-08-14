import Vue from "./prototype";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import PageTitle from "@/components/PageTitle/PageTitle.vue";
import TheLoader from "@/components/TheLoader/TheLoader.vue";

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
  render: (h) => h(App),
}).$mount("#app");
