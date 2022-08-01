<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="w-100 d-flex">
    <b-col cols="3">
      <h2>Meus Bares</h2>
      <div
        class="companies pointer"
        v-for="company in companies"
        @click="selectCompany(company)"
        :key="company.id"
      >
        <h4 :class="{ 'text-success': selectedCompany.id === company.id }">
          {{ company.name }}
        </h4>
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
          :key="table.id || index + customers.length + selectedCompany.id"
        >
          <div
            class="
              c-table
              my-1
              pointer
              d-flex
              align-items-center
              justify-content-center
            "
            @click="selectTable(index)"
            :class="{ occupied: table?.name }"
          >
            <div class="d-flex flex-column">
              {{ table?.tableNum }}<br />
              <small>{{ table?.name }}</small>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>

    <b-modal id="new-customer-modal">
      <b-form @submit.prevent="createCustomer">
        <label for="customer-name">Name</label><br />
        <b-input name="customer-name" required v-model="customer.name" />
        <br />
        <b-button type="submit" variant="success">Enviar</b-button>
      </b-form>
    </b-modal>

    <b-modal
      id="table-modal"
      size="xl"
      :title="`${getTable()?.id} - ${getTable()?.name}`"
    >
      <b-row v-if="getTable()" :key="updateKey">
        <b-col cols="2" class="d-flex flex-column text-left">
          <b-button variant="success" class="mb-3"> Fazer pedido </b-button>
          <b-button variant="success"> Fechar comanda </b-button>
        </b-col>
        <b-col cols="4">
          <p>Mesa: {{ getTable().tableNum }}</p>
          <p>Cliente: {{ getTable().name }}</p>
          <p>ID da comanda: {{ getTable().order.id }}</p>
          <p>Estado: {{ getTable().order.status }}</p>
          <p>Horário: {{ getTable().order.createdAt }}</p>
          <p>Ultimo pedido: {{ getTable().order.updatedAt || "-" }}</p>
          <p>Total: R${{ getTable().order.totalPrice }}</p>
        </b-col>
        <b-col cols="6">
          <h4>Itens na comanda</h4>
          <div class="order-item">
            <b-table
              responsive
              striped
              hover
              :items="getTable().order.items"
              :fields="['name', 'amount', 'price', 'total', 'status']"
            >
            </b-table>
          </div>

          <h5>Adicionar item</h5>
          <b-form @submit.prevent="addItem">
            <b-select
              value="0"
              :options="getOptions"
              v-model="order.menuItemId"
            >
              <option value="0" selected disabled>Selecione um item</option>
            </b-select>
            <label for="amount">Quantidade</label>
            <b-input
              value="1"
              type="number"
              name="amount"
              v-model="order.amount"
              min="1"
            />
            <b-button type="submit">Enviar</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import env from "../../../ws-routes";
export default {
  name: "Home",

  data() {
    return {
      updateKey: 0,
      companies: [],
      customers: [],
      products: [],
      order: {
        menuItemId: null,
        amount: 1,
      },
      customer: {
        name: "",
        companyId: undefined,
        tableNum: undefined,
      },
      selectedCompany: undefined,
      selectedTable: -1,
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
      this.fetchProducts(company.id);
    },
    selectTable(index) {
      this.selectedTable = index;
      if (this.getTable()?.id) {
        this.$bvModal.show("table-modal");
      } else {
        this.$bvModal.show("new-customer-modal");
      }
    },
    async addItem() {
      if (this.order.menuItemId && this.order.amount >= 1) {
        await this.$http.post(
          env.WS.ORDER.ADD_ITEM(this.getTable().order.id),
          this.order
        );
        this.$bvToast.toast("Item adicionado", {
          variant: "success",
        });
        this.fetchCustomers(this.selectedCompany.id);
      } else {
        this.$bvToast.toast("Precisa selecionar um item.", {
          variant: "danger",
        });
      }
    },
    async createCustomer() {
      try {
        await this.$http.post(env.WS.CUSTOMER.BASE, this.customer);

        this.customer.name = "";
        this.$bvToast.toast("Cliente adicionado com sucesso.");

        await this.fetchCustomers(this.customer.companyId);
        this.$bvModal.hide("new-customer-modal");

        const currentTable = this.selectedTable;
        this.selectedTable = -1;
        this.selectedTable = currentTable;

        setTimeout(() => {
          this.$bvModal.show("table-modal");
        }, 200);
      } catch (error) {
        console.error(error);
        this.$bvToast.toast("Erro ao criar cliente");
      }
    },
    async fetchCompanies() {
      const companies = await this.$http.get(env.WS.COMPANY.BASE);
      this.companies = companies;
      if (!this.selectedCompany) this.selectCompany(companies[0]);
    },
    async fetchCustomers(companyId) {
      const customers = await this.$http.get(
        env.WS.COMPANY.CUSTOMERS(companyId)
      );
      this.customers = customers;

      if (Array.isArray(customers))
        customers.forEach((customer) => {
          if (customer.tableNum) {
            this.tables[+customer.tableNum - 1] = customer;
          }
        });
      this.updateKey++;
    },
    async fetchProducts(companyId) {
      this.products = await this.$http.get(env.WS.COMPANY.MENU(companyId));
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
    getTable() {
      if (~this.selectedTable && this.tables[this.selectedTable].id) {
        return this.tables[this.selectedTable];
      }
      return undefined;
    },
  },
  computed: {
    getOptions() {
      return this.products.map((p) => ({
        value: p.id,
        text: `${p.product.name} - R$ ${p.price}`,
      }));
    },

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
    selectedTable() {
      this.customer.tableNum = this.tables[this.selectedTable].tableNum;
    },
    selectedCompany() {
      this.customer.companyId = this.selectedCompany.id;
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
