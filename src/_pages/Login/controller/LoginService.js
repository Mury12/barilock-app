import Vue from "../../../prototype";
import { user } from "../../../models/user";
import Axios from "axios";

const LoginService = new Vue({
  data: {
    vm: this,
  },
  methods: {
    do: async function (username, password) {
      try {
        const result = await this.$http.post(this.$ws("USER", "LOGIN"), {
          username,
          password,
        });

        if ("token" in result) {
          this.$session.set("@app:user", JSON.stringify(result));
          this.$session.set("@app:token", JSON.stringify(result.token));
          Axios.defaults.headers.Authorization = result.token;
          return this.$util.respond(user);
        }
      } catch (err) {
        return this.$util.respond(err.response.data, true);
      }
    },
    done: function () {
      this.$session.destroy();
      return this.$util.respond("Saindo..");
    },
    check: function () {
      if (this.$session.get("@app:token")) {
        const user = this.$session.get("@app:user");
        if (user)
          return {
            authenticated: true,
            user: JSON.parse(user),
          };
      }
      return false;
    },
  },
});

export default LoginService;
