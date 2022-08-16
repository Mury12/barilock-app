<template>
  <div
    style="width: 100px"
    class="c-table pointer position-relative d-flex align-items-center justify-content-center"
    @click="$emit('select', customer.tableNum)"
    :class="{
      occupied:
        (customer.name && customer.order.status === 'open') ||
        (customer.order && customer.order.paid === '1'),
      'bg-danger':
        customer.order &&
        customer.order.status === 'closed' &&
        customer.order.paid === '0',
    }"
  >
    <div
      class="position-absolute customer-meta d-flex align-items-center flex-column justify-content-center"
      v-if="order"
    >
      <small>{{ currency }} {{ order.totalPrice || "0.00" }}</small
      ><br />
      <small
        >{{ items.length }} pedido{{ items.length === 1 ? "" : "s" }} </small
      ><br />
      <small>{{ itemCount }} ite{{ itemCount === 1 ? "m" : "ns" }} </small
      ><br />
      <small>{{ status }}</small>
    </div>
    <div class="d-flex flex-column">
      {{ customer?.tableNum }}<br />
      <small>{{ customer?.name || "Livre" }}</small>
    </div>
  </div>
</template>

<script>
  import { mapState, mapStores } from "pinia";
  import { useMainStore } from "@/store";
  export default {
    name: "Customer",
    props: {
      customer: {
        type: Object,
        default: () => ({
          tableNum: 0,
        }),
      },
    },
    computed: {
      ...mapStores(useMainStore),
      order() {
        return this.customer.order;
      },
      items() {
        return this.order.items || [];
      },
      itemCount() {
        return this.items.reduce((acc, curr) => (acc += +curr.amount), 0);
      },
      status() {
        return this.order.status === "open"
          ? "Em andamento"
          : this.order.paid === "1"
          ? "Pago"
          : "Não pago";
      },
      currency() {
        return this.mainStore.getCurrency;
      },
    },
  };
</script>

<style>
  .bg-danger .customer-meta {
    color: white;
  }
  .c-table {
    background-color: rgb(0, 0, 0, 0.225);
    color: black;
    font-size: 1.5em;
    border-radius: 5px;
    height: 60px;
    border: 1px solid silver;
  }
  .c-table:hover .customer-meta {
    opacity: 1 !important;
  }

  .c-table small {
    font-size: 12px;
  }

  .customer-meta {
    opacity: 0;
    line-height: 12px;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: 200ms;
  }
  .occupied {
    background-color: var(--success);
    color: white;
  }
</style>
