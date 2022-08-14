<template>
  <b-form class @keyup.enter="auth">
    <label>
      Nome de usuário:
      <br />
      <b-input type="text" placeholder="Garry" v-model="username" />
    </label>
    <br />
    <label>
      Sua senha:
      <br />
      <b-input type="password" placeholder="•••••••••" v-model="password" />
    </label>
    <br />
    <transition mode="out-in" name="shrink-fade">
      <div v-if="!request.onRequest">
        <b-button
          :disabled="request.onRequest"
          type="button"
          @click="auth"
          variant="success"
          >Entrar</b-button
        >
      </div>
      <b-spinner type="grow" variant="success" v-if="request.onRequest" />
    </transition>
  </b-form>
</template>

<script>
  import apiClient from "@/common/LoginService";

  export default {
    data() {
      return {
        username: "mury",
        password: "jujuba",
        request: {
          success: false,
          msg: "",
        },
      };
    },
    methods: {
      auth: async function () {
        if (this.request.onRequest) return;
        this.$root.onRequest = true;
        this.request.requested = false;
        try {
          const result = await apiClient.login(this.username, this.password);
          if (result) {
            this.request.success = result.success;
            this.request.msg = result.msg;
            this.$root.profile = result.user;
            this.$root.authenticated = true;
          }
        } catch (error) {
          this.$bvToast.toast(error.response.data.status.error, {
            title: "Error",
            variant: "danger",
          });
        } finally {
          this.request.requested = true;
          this.$root.onRequest = false;
          this.$bvToast.toast(this.request.msg, {
            title: "Mensagem",
            autoHideDelay: 5000,
            appendToast: false,
            variant: this.request.success ? "success" : "danger",
          });
        }
      },
    },
    beforeMount() {
      const auth = apiClient.checkToken();
      if (auth) {
        this.$root.authenticated = auth.authenticated;
        this.$root.profile = auth.user;
        this.$router.push("/home");
      }
    },
  };
</script>

<style scoped></style>
