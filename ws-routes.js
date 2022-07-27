const env = {
  NODE_ENV: "production",
  VERSION: "v0.0.1-alpha",
  NAME: "Vue Start",
  VUE_SESSION_TIMEOUT: 60,

  WS: {
    URL: "http://192.168.123.101:8081/ws/v2/",
    USER: {
      BASE: 'user/',
      LOGIN: 'user/login',
    },
    BP: {
      SESSIONS: 'sessions/'
    }
  }
}
export default env;