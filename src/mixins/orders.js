import orderApi from "@/common/OrderService";
import customerApi from "@/common/CustomerService";

export default {
  data() {
    return {
      order: {
        menuItemId: null,
        amount: 1,
      },
      openOrderAfterInsert: true,
      orderIsPaid: true,
      orders: [],
    };
  },
  methods: {
    async addItem(orderId) {
      try {
        await orderApi.addItem(orderId, this.order);
        this.$bvToast.toast("Item adicionado", {
          variant: "success",
        });
      } catch (error) {
        this.$bvToast.toast(error.message, {
          variant: "danger",
        });
      }
    },
    async closeOrder(customer) {
      try {
        await orderApi.closeOrder(customer, this.orderIsPaid);

        this.$bvToast.toast(
          `Comanda nº ${customer.order.id} de ${
            customer.name
          } foi finalizada como ${this.orderIsPaid ? "paga" : "não paga"}`,
          {
            title: "Sucesso",
            variant: "success",
          }
        );

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
    async fetchClosedOrders(companyId) {
      const orders = await customerApi.fetchCustomers(companyId, "closed");
      if (Array.isArray(orders)) this.orders.push(...orders);
    },
  },
};
