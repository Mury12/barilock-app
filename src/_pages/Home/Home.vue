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
        <b-col cols="12">
          <b-row class="text-left mb-3">
            <b-col cols="4"
              >Pesquisar mesa ou cliente
              <input v-model="search" />
            </b-col>
            <b-col cols="4">
              Filtrar mesas
              <div>
                <b-badge
                  :variant="filter.occupied ? 'info' : ''"
                  @click="filter.occupied = !filter.occupied"
                  class="pointer border rounded"
                >
                  Ocupadas
                </b-badge>
                <b-badge
                  :variant="filter.available ? 'info' : ''"
                  @click="filter.available = !filter.available"
                  class="pointer border rounded mt-2"
                >
                  Vazias
                </b-badge>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col
          cols="2"
          v-for="(table, index) in filteredTables"
          :key="index + customers.length"
        >
          <div
            class="
              c-table
              pointer
              d-flex
              align-items-center
              justify-content-center
            "
            @click="selectTable(table)"
            :class="{ occupied: table?.name }"
          >
            <div class="d-flex flex-column">
              {{ table?.tableNum || index + 1 }}<br />
              <small>{{ table?.name }}</small>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>
    <b-modal
      id="table-modal"
      size="xl"
      :title="`${selectedTable?.id} - ${selectedTable?.name}`"
    >
      <b-row v-if="selectedTable">
        <b-col cols="2" class="d-flex flex-column text-left">
          <b-button variant="success" class="mb-3"> Fazer pedido </b-button>
          <b-button variant="success"> Fechar comanda </b-button>
        </b-col>
        <b-col cols="4">
          <p>Mesa: {{ selectedTable.tableNum }}</p>
          <p>Cliente: {{ selectedTable.name }}</p>
          <p>ID da comanda: {{ selectedTable.order.id }}</p>
          <p>Estado: {{ selectedTable.order.status }}</p>
          <p>Horário: {{ selectedTable.order.createdAt }}</p>
          <p>Ultimo pedido: {{ selectedTable.order.updatedAt || "-" }}</p>
          <p>Total: R${{ customerOrderTotal.toFixed(2) }}</p>
        </b-col>
        <b-col cols="6">
          <h4>Itens na comanda</h4>
          <div class="order-item">
            <b-table
              responsive
              striped
              hover
              :items="selectedTable.order.items"
              :fields="['name', 'amount', 'price', 'total', 'status']"
            >
            </b-table>
          </div>
        </b-col>
      </b-row>
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
      filteredTables: [],
      search: "",
      filter: {
        occupied: false,
        available: false,
      },
    };
  },
  methods: {
    selectCompany(company) {
      this.selectedCompany = company;
      this.tables = new Array(+company.size)
        .fill(undefined)
        .map((t, i) => ({ tableNum: String(i + 1) }));
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
    searchTable() {
      const search = this.search;
      if (!search.length) {
        this.filteredTables = this.tables;
      } else {
        this.filteredTables = this.filteredTables.filter((table, index) => {
          return (
            String(index + 1).includes(search) ||
            table?.tableNum.includes(search) ||
            table?.name?.toLowerCase().includes(search.toLowerCase())
          );
        });
      }
    },
    filterTables() {
      const filter = this.filter;
      if (
        (!filter.occupied && !filter.available) ||
        (filter.occupied && filter.available)
      ) {
        this.filteredTables = this.tables;
        this.searchTable();
      } else {
        this.filteredTables = this.filteredTables.filter(
          (t) =>
            (filter.occupied && t.orderId) || (filter.available && !t.orderId)
        );
      }
    },
  },
  computed: {
    customerOrderTotal() {
      if (this.selectedTable?.order?.items) {
        return [this.selectedTable?.order?.items]
          .flat()
          .reduce((prev, curr) => (prev += +curr.total), 0);
      }
      return 0;
    },
  },
  watch: {
    search(n, o) {
      this.searchTable(n, o);
    },
    filter: {
      deep: true,
      handler(n) {
        this.filterTables(n);
      },
    },
    tables: {
      deep: true,
      handler() {
        this.filterTables();
        this.searchTable();
      },
    },
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
