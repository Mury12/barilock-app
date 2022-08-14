<template>
  <b-modal
    id="new-customer-modal"
    hide-footer
    :title="`Nº ${index} - Abrir comanda`"
  >
    <b-form @submit.prevent="addCustomer">
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
</template>

<script>
  import customers from "../../mixins/customers";

  export default {
    name: "CreateCustomerModal",
    mixins: [customers],
    data() {
      return {
        openOrderAfterInsert: true,
      };
    },
    props: {
      index: {
        type: Number,
        default: undefined,
      },
      companyId: {
        type: Number,
        default: undefined,
      },
    },
    methods: {
      async addCustomer() {
        await this.createCustomer();
        this.$emit("created", this.companyId);
      },
    },
    watch: {
      index(index) {
        console.debug(index);
        this.customer.tableNum = index;
        setTimeout(() => {
          this.$refs.customerNameInput?.focus();
        }, 100);
      },
    },
    mounted() {
      this.customer.companyId = this.companyId;
    },
  };
</script>

<style></style>
