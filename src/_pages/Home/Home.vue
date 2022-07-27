<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="w-100 d-flex">
    <b-col cols="3">
      <h2>Meus Bares</h2>
      <div
        class="companies pointer"
        v-for="(company, index) in companies"
        @click="selectCompany(company)"
        :key="index"
      >
        <h4>{{ company.name }}</h4>
        {{ company.description }}
      </div>
    </b-col>
    <b-col cols="9" class="tables">
      <b-row>
        <b-col
          cols="2"
          v-for="(table, index) in tables"
          :key="table?.name || index"
        >
          <div
            class="
              table
              pointer
              d-flex
              align-items-center
              justify-content-center
            "
            @click="selectTable(table)"
            :class="{ occupied: table?.name }"
          >
            <div class="d-flex flex-column">
              {{ index }}<br />
              <small>{{ table?.name }}</small>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>
    <b-modal
      v-if="selectedTable"
      id="table-modal"
      :title="`${selectedTable.id} - ${selectedTable.name}`"
    >
      {{ selectedTable }}
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {
      companies: [],
      customers: [],
      selectedCompany: undefined,
      selectedTable: undefined,
      tables: [],
    };
  },
  methods: {
    selectCompany(company) {
      this.selectedCompany = company;
      this.tables = new Array(+company.size).fill(undefined);
      this.fetchCustomers(company.id);
    },
    selectTable(table) {
      if (table?.id) {
        this.selectedTable = table;
        this.$bvModal.show("table-modal");
      } else this.$bvToast.toast("Esta mesa está vazia!", { variant: "warn" });
    },
    async fetchCompanies() {
      const companies = await this.$http.get(
        "http://192.168.123.101:8081/ws/v2/company"
      );
      this.companies = companies;
    },
    async fetchCustomers(companyId) {
      const customers = await this.$http.get(
        `http://192.168.123.101:8081/ws/v2/company/${companyId}/customer`
      );
      this.customers = customers;

      if (Array.isArray(customers))
        customers.forEach((customer) => {
          if (customer.tableNum) {
            this.tables[+customer.tableNum - 1] = customer;
          }
        });
    },
  },
  mounted() {
    this.fetchCompanies();
  },
};
</script>

<style scoped>
.table {
  background-color: rgb(0, 0, 0, 0.225);
  color: black;
  font-size: 1.5em;
  border-radius: 5px;
  height: 60px;
  border: 1px solid silver;
}
.table small {
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
