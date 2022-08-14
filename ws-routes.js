import Axios from "axios";

Axios.defaults.baseURL = "http://192.168.123.101:8081/ws/v2/";

const env = {
  NODE_ENV: "production",
  VERSION: "v0.0.1-alpha",
  NAME: "Vue Start",
  VUE_SESSION_TIMEOUT: 60,

  WS: {
    URL: "http://192.168.123.101:8081/ws/v2/",
    USER: {
      BASE: "user",
      LOGIN: "user/login",
    },
    CUSTOMER: {
      BASE: "customer",
      GET: (id) => `${env.WS.CUSTOMER.BASE}/${id}`,
    },
    COMPANY: {
      BASE: "company",
      GET: (id) => `${env.WS.COMPANY.BASE}/${id}`,
      CUSTOMERS: (companyId) => `${env.WS.COMPANY.BASE}/${companyId}/customers`,
      PRODUCTS: (companyId) => `${env.WS.COMPANY.BASE}/${companyId}/products`,
      MENU: (companyId) => `${env.WS.COMPANY.BASE}/${companyId}/menu`,
    },
    ORDER: {
      BASE: "order",
      BYID: (orderId) => `${env.WS.ORDER.BASE}/${orderId}`,
    },
  },
};
export default env;
