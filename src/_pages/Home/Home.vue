<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="w-100 d-flex">
    <b-col cols="3">
      <b-row>
        <b-col cols="12">
          <h2>Menu</h2>
          <b-button variant="link"> Comandas fechadas</b-button>
        </b-col>
        <b-col cols="12">
          <h4>Meus Bares</h4>
          <div
            class="companies pointer"
            v-for="company in companies"
            @click="selectCompany(company)"
            :key="company.id"
          >
            <b-button
              variant="link"
              :class="{ 'text-success': selectedCompany.id === company.id }"
            >
              {{ company.name }}
            </b-button>
            {{ company.description }}
          </div>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="9" class="tables">
      <customer-container :company="selectedCompany" />
    </b-col>
  </div>
</template>

<script>
  import CustomerContainer from "../../components/Customer/CustomerContainer.vue";
  import companies from "../../mixins/companies";
  import { mapStores } from "pinia";
  import { useMainStore } from "../../store/index";

  export default {
    name: "Home",
    components: { CustomerContainer },
    mixins: [companies],
    data() {
      return {
        showingMenu: false,
      };
    },
    computed: {
      ...mapStores(useMainStore),
    },
    watch: {
      companies() {
        this.mainStore.setCompanies(this.companies);
      },
      products() {
        this.mainStore.setProducts(this.products);
      },
      selectedCompany(n) {
        this.mainStore.setCurrentCompany(n)
      }
    },
    mounted() {
      this.fetchCompanies();
    },
  };
</script>

<style scoped>
  .c-table {
    background-color: rgb(0, 0, 0, 0.225);
    color: black;
    font-size: 1.5em;
    border-radius: 5px;
    height: 60px;
    border: 1px solid silver;
  }
  .c-table small {
    font-size: 12px;
  }
  .occupied {
    background-color: var(--success);
    color: white;
  }
  .square {
    position: relative;
    width: 20px;
    height: 20px;
  }
  .selected {
    background-color: var(--success);
  }
  .anim {
    position: absolute;
    height: 100px;
    width: 100px;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-size: contain;
    animation: ghost forwards 1s;
  }

  @keyframes ghost {
    0% {
      opacity: 0;
      transform: translateY(-100px);
    }
    20% {
      opacity: 1;
      transform: translateY(-100px);
    }

    100% {
      opacity: 0;
      transform: translateY(-150px);
    }
  }
</style>
