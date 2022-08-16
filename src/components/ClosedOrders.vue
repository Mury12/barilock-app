<template>
  <div>
    <p class="text-left">
      {{ orders.length }} comandas fechadas <br />
      {{ totalPaid }} pagas<br />
      {{ orders.length - totalPaid }} não pagas <br />
      {{ currency }} {{ totalValue }} faturamento <br />
      {{ currency }} {{ profit }} em caixa <br />
      {{ currency }} {{ totalValue - profit }} em débito
    </p>
    <div class="d-flex flex-wrap" style="gap: 3px">
      <customer
        v-for="(order, index) in orders"
        :key="index"
        :customer="order"
      />
    </div>
  </div>
</template>

<script>
  import { mapStores } from "pinia";
  import { useMainStore } from "@/store";
  import orders from "@/mixins/orders";
  import Customer from "./Customer/Customer.vue";

  export default {
    components: { Customer },
    name: "OrderReport",
    mixins: [orders],
    computed: {
      ...mapStores(useMainStore),
      companyId() {
        return this.mainStore.getCurrentCompany?.id || undefined;
      },
      totalPaid() {
        return this.orders.reduce((acc, cur) => (acc += +cur.order.paid), 0);
      },
      totalValue() {
        return this.orders
          .reduce((acc, cur) => (acc += +cur.order.totalPrice), 0)
          .toFixed(2);
      },
      profit() {
        return this.orders
          .reduce((acc, cur) => {
            const { totalPrice, paid } = cur.order;
            if (+paid) return (acc += +totalPrice);
            return acc;
          }, 0)
          .toFixed(2);
      },
      currency() {
        return this.mainStore.getCurrency;
      },
    },
    created() {
      this.fetchClosedOrders(this.companyId, "closed");
    },
  };
</script>

<style></style>
