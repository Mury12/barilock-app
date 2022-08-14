<template>
  <div v-if="company?.id">
    <floating-menu
      :canAdd="canAddTable"
      :canRemove="canRemoveTable"
      @add="addTable"
      @remove="removeTable"
    />
    <b-row>
      <b-col cols="12">
        <customer-filter v-if="false" />
      </b-col>
      <b-col cols="12" class="table-wrapper d-flex">
        <customer
          v-for="(customer, index) in customers"
          :customer="customer"
          :key="index"
          @select="selectCustomer"
        />
        <menu-button
          @click="addTable"
          :enabled="canAddTable"
          v-b-tooltip.right.hover="'Adicionar mesa'"
        />
      </b-col>
    </b-row>

    <!-- MODALS -->
    <order-modal
      :customer="getCustomer()"
      :order="order"
      :products="products"
      @submit="addItemToOrder"
    />
    <create-customer-modal
      :openOrderAfterInsert="openOrderAfterInsert"
      :index="selectedCustomer + 1"
      :companyId="+company.id"
      @created="fetchCustomers"
    />
    <b-modal hide-footer id="close-order-modal" title="Encerrar comanda">
      <b-checkbox name="order-paid" v-model="orderIsPaid"
        >Esta comanda foi paga</b-checkbox
      >
      <b-button variant="success" class="mt-3" @click="endOrder"
        >Enviar</b-button
      >
    </b-modal>
    <!-- END MODALS -->
  </div>
  <div v-else>
    <h5>Selecione um bar para mostrar mesas</h5>
  </div>
</template>

<script>
  import Customer from "./Customer.vue";
  import CustomerFilter from "./CustomerFilter.vue";
  import OrderModal from "./OrderModal.vue";
  import customers from "../../mixins/customers";
  import orders from "../../mixins/orders";
  import CreateCustomerModal from "./CreateCustomerModal.vue";
  import companies from "../../mixins/companies";
  import FloatingMenu from "../FloatingMenu/FloatingMenu.vue";
  import { mapStores } from "pinia";
  import { useMainStore } from "../../store";
  import MenuButton from "../FloatingMenu/MenuButton.vue";

  export default {
    name: "CustomerContainer",
    components: {
      Customer,
      CustomerFilter,
      OrderModal,
      CreateCustomerModal,
      FloatingMenu,
      MenuButton,
    },
    mixins: [customers, orders, companies],
    data() {
      return {
        orderIsPaid: true,
      };
    },
    props: {
      company: {
        type: Object,
        default: undefined,
      },
    },
    computed: {
      canAddTable() {
        return this.customers.length < (+this.selectedCompany?.size || 1e6);
      },
      canRemoveTable() {
        return !!(
          this.customers.length > 0 &&
          this.customers.reduce((acc, t) => (acc += t.name ? 0 : 1), 0)
        );
      },
      customerOrderTotal() {
        if (this.selectedTable?.order?.items) {
          return [this.selectedTable?.order?.items]
            .flat()
            .reduce((prev, curr) => (prev += +curr.total), 0);
        }
        return 0;
      },
      ...mapStores(useMainStore),
    },
    watch: {
      search() {
        this.searchTable();
      },
      async company(company) {
        this.customer.companyId = company.id;
        this.customers.splice(0);
        // TODO: use pinia
        this.selectCompany(company);
        while (this.customers.length < 10) this.addTable();
        await this.fetchCustomers(company.id);
        this.mainStore.setCustomers(this.customers);
        await this.fetchProducts(company.id);
        this.mainStore.setProducts(this.products);
      },
      filter: {
        deep: true,
        handler() {
          this.filterTables();
        },
      },
      customers: {
        deep: true,
        handler() {
          this.filterTables();
          this.searchTable();
        },
      },
      selectedCustomer() {
        this.customer.tableNum = this.customers[this.selectedCustomer].tableNum;
      },
    },
    methods: {
      async endOrder() {
        await this.closeOrder(this.getCustomer());
        this.customers[this.selectedCustomer] = {
          tableNum: String(this.selectedCustomer + 1),
        };
        await this.fetchCustomers(this.company.id);
      },
      async addItemToOrder(orderId) {
        await this.addItem(orderId);
        await this.fetchCustomers(this.company.id);
      },
    },
  };
</script>

<style>
  .table-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
</style>
