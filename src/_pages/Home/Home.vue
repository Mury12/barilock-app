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
                <b-badge
                  :variant="filter.available ? 'info' : ''"
                  @click="sortTables"
                  class="pointer border rounded mt-2"
                >
                  Ordenar mesas
                </b-badge>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" class="table-wrapper">
          <div
            v-for="(table, index) in this.filteredTables"
            :key="index + customers.length"
            style="width: 100px"
            class="
              c-table
              pointer
              d-flex
              align-items-center
              justify-content-center
            "
            @click="selectTable(table.tableNum)"
            :class="{ occupied: table?.name }"
          >
            <div class="d-flex flex-column">
              {{ table?.tableNum }}<br />
              <small>{{ table?.name || "Livre" }}</small>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>

    <b-modal
      id="new-customer-modal"
      hide-footer
      :title="`Nº ${selectedTable + 1} - Abrir comanda`"
    >
      <b-form @submit.prevent="createCustomer">
        <label for="customer-name">Name</label><br />
        <b-input
          ref="customerNameInput"
          name="customer-name"
          required
          v-model="customer.name"
        />
        <b-checkbox v-model="openOrderAfterInsert"
          >Abrir comanda ao concluir</b-checkbox
        >
        <br />
        <b-button type="submit" variant="success">Enviar</b-button>
      </b-form>
    </b-modal>

    <b-modal
      hide-footer
      id="table-modal"
      size="xl"
      :title="`${getTable()?.id || ''} - ${getTable()?.name || ''}`"
    >
      <b-row v-if="getTable()" :key="updateKey">
        <b-col cols="2" class="d-flex flex-column text-left">
          <b-button
            variant="success"
            @click="$bvModal.show('close-order-modal')"
          >
            Fechar comanda
          </b-button>
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

    <b-modal hide-footer id="close-order-modal" title="Encerrar comanda">
      <b-checkbox name="order-paid" v-model="orderIsPaid"
        >Esta comanda foi paga</b-checkbox
      >
      <b-button variant="success" class="mt-3" @click="closeOrder"
        >Enviar</b-button
      >
    </b-modal>

    <div
      class="floating-menu position-fixed d-flex flex-column align-items-end"
      style="bottom: 30px; right: 30px; z-index: 999"
    >
      <transition mode="out-in" name="fade">
        <div class="floating-menu-content rounded card p-3" v-if="showingMenu">
          <div
            class="
              d-flex
              flex-column
              c-table
              bg-transparent
              pointer
              d-flex
              justify-content-center
              align-items-center
              mb-2
            "
            :class="{ disabled: !canAddTable }"
            style="width: 100px"
            @click="canAddTable ? addTable() : null"
          >
            <fas icon="plus-circle" class="fa-2x text-success" /><br />
          </div>
          <div
            class="
              d-flex
              flex-column
              c-table
              bg-transparent
              pointer
              d-flex
              justify-content-center
              align-items-center
            "
            :class="{ disabled: !canRemoveTable }"
            style="width: 100px"
            @click="canRemoveTable ? removeTable() : null"
          >
            <fas icon="minus-circle" class="fa-2x text-danger" /><br />
          </div>
        </div>
      </transition>
      <div
        class="
          floating-menu-icon
          rounded-circle
          pointer
          bg-info
          d-flex
          justify-content-center
          align-items-center
          text-white
          mt-2
        "
        style="width: 50px; height: 50px"
        @click="showingMenu = !showingMenu"
      >
        <fas icon="cog" class="fa-2x" />
      </div>
    </div>
  </div>
</template>

<script>
import env from "../../../ws-routes";
export default {
  name: "Home",

  data() {
    return {
      showingMenu: false,
      orderIsPaid: true,
      openOrderAfterInsert: true,
      updateKey: 0,
      companies: [],
      customers: [],
      products: [],
      availableTables: [],
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
    async closeOrder() {
      try {
        await this.$http.put(env.WS.ORDER.BYID(this.getTable().order.id), {
          status: "closed",
          paid: this.orderIsPaid,
        });

        this.$bvToast.toast(
          `Comanda nº ${this.getTable().order.id} de ${
            this.getTable().name
          } foi finalizada como ${this.orderIsPaid ? "paga" : "não paga"}`,
          {
            title: "Sucesso",
            variant: "success",
          }
        );

        this.tables[this.selectedTable] = {
          tableNum: String(this.selectedTable + 1),
        };
        await this.fetchCustomers(this.selectedCompany.id);
        this.$bvModal.hide("close-order-modal");
        this.$bvModal.hide("table-modal");
        this.orderIsPaid = true;
      } catch (error) {
        this.$bvToast.toast(error.message, {
          variant: "error",
          title: "Erro",
        });
      }
    },
    syncAvailableTables(tableNum) {
      const tableIdx = this.availableTables.findIndex(
        (num) => num === tableNum
      );
      if (~tableIdx) this.availableTables.splice(tableIdx, 1);
    },
    sortAvailableTables() {
      this.availableTables.sort((a, b) => (a > b ? 1 : -1));
    },
    sortTables() {
      this.tables = this.tables.sort((a, b) =>
        a.tableNum > b.tableNum ? 1 : -1
      );
    },
    removeTable() {
      const removeIdx = this.tables.map((t) => t.name).lastIndexOf(undefined);
      if (~removeIdx) {
        this.availableTables.push(this.tables[removeIdx].tableNum);
        this.tables.splice(removeIdx, 1);
      }
      this.sortAvailableTables();
    },
    addTable() {
      this.tables.push({
        tableNum: this.availableTables[0],
      });
      this.availableTables.shift();
      this.sortAvailableTables();
    },
    async selectCompany(company) {
      this.selectedCompany = company;
      this.availableTables = new Array(+this.selectedCompany.size)
        .fill(0)
        .map((_, i) => i + 1);
      await this.fetchProducts(company.id);
      await this.fetchCustomers(company.id);
    },
    selectTable(tableNum) {
      this.selectedTable = this.tables.findIndex(
        (t) => t.tableNum === tableNum
      );
      if (this.getTable()?.id) {
        this.$bvModal.show("table-modal");
      } else {
        this.$bvModal.show("new-customer-modal");

        setTimeout(() => {
          this.$refs.customerNameInput.focus();
        }, 100);
      }
    },
    addOrUpdateCustomer(customer, sort = false) {
      const customerIdx = this.tables.findIndex(
        (t) => +t.tableNum === +customer.tableNum
      );
      console.debug(customerIdx, customer.tableNum, this.tables);
      if (!~customerIdx) this.tables.push(customer);
      else {
        this.tables[customerIdx] = customer;
      }
      this.sortAvailableTables();
      if (sort) this.sortTables();
    },
    async addItem() {
      if (this.order.menuItemId && this.order.amount >= 1) {
        await this.$http.post(
          env.WS.ORDER.BYID(this.getTable().order.id),
          this.order
        );
        this.$bvToast.toast("Item adicionado", {
          variant: "success",
        });
        await this.fetchCustomers(this.selectedCompany.id);
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
        this.$bvToast.toast("Cliente adicionado com sucesso.", {
          variant: "success",
        });

        await this.fetchCustomers(this.selectedCompany.id);
        this.refreshFilters();
        this.$bvModal.hide("new-customer-modal");

        const currentTable = this.selectedTable;
        this.selectedTable = -1;
        this.selectedTable = currentTable;

        if (this.openOrderAfterInsert) {
          setTimeout(() => {
            this.$bvModal.show("table-modal");
          }, 200);
        }
      } catch (error) {
        console.error(error);
        this.$bvToast.toast("Erro ao criar cliente", {
          variant: "error",
        });
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

      if (Array.isArray(customers)) {
        customers.forEach((customer) => {
          if (customer.tableNum) {
            this.addOrUpdateCustomer(customer);
            this.syncAvailableTables(+customer.tableNum);
          }
        });
      }
      this.updateKey++;
      this.sortTables();
      this.filterTables();
    },
    async fetchProducts(companyId) {
      this.products = await this.$http.get(env.WS.COMPANY.MENU(companyId));
    },
    searchTable() {
      const search = this.search;
      if (!search.length) {
        this.filterTables();
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
    refreshFilters() {
      const aux = { ...this.filter, search: this.search };
      if (this.filter.occupied || this.filter.available) {
        this.filter = {
          occupied: aux.occupied,
          available: aux.available,
        };
      } else {
        this.searchTable();
      }
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
    canAddTable() {
      return this.tables.length < (+this.selectedCompany?.size || 1e6);
    },
    canRemoveTable() {
      return (
        this.tables.length > 0 &&
        this.tables.reduce((acc, t) => (acc += t.name ? 0 : 1), 0)
      );
    },
  },
  watch: {
    search() {
      this.searchTable();
    },

    filter: {
      deep: true,
      handler() {
        this.filterTables();
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
      this.tables.splice(0);
    },
  },
  mounted() {
    this.fetchCompanies();
  },
};
</script>

<style scoped>
.table-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
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
.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
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
