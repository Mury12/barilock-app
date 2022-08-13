<template>
  <b-modal
    id="new-customer-modal"
    hide-footer
    :title="`Nº ${index + 1} - Abrir comanda`"
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
</template>

<script>
import customers from "../../mixins/customers";

export default {
  name: "CreateCustomerModal",
  mixins: [customers],
  data() {
    return {};
  },
  props: {
    openOrderAfterInsert: {
      type: Boolean,
      default: true,
    },
    index: {
      type: Number,
      default: undefined,
    },
    companyId: {
      type: Number,
      default: undefined,
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

<style>
</style>
