<template>
  <div id="_mobile-navbar">
    <b-navbar toggleable="lg" class="bg-dark text-white" type="dark">
      <b-navbar-brand href="#" class="text-white">Helo</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" class="text-white"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-row class="justify-content-between">
            <b-col cols="6" class="_mob-menu-item my-2" v-for="(item,idx) in items" :key="idx">
              <router-link class="no-decoration text-black" :to="item.uri">
                <b-card class="text-black">
                  <fa-icon :icon="item.icon" />
                  <br />
                  {{item.name}}
                </b-card>
              </router-link>
            </b-col>
            <b-col cols="6" class="_mob-menu-item my-2" @click="logout">
              <router-link class="no-decoration text-black" to="#">
                <b-card class="text-black">
                  <fa-icon icon="power-off" />
                  <br />Sair
                </b-card>
              </router-link>
            </b-col>
          </b-row>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import LoginService from "@/common/LoginService";

export default {
  data() {
    return {};
  },
  props: ["items"],
  methods: {
    logout: function () {
      if (LoginService.done()) {
        this.$emit("logout");
      }
    },
  },
};
</script>

<style scoped>
._mob-menu-item .card {
  height: 100px;
}
</style>
