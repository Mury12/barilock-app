import env from "../../ws-routes";

export default {
  data() {
    return {
      order: {
        menuItemId: null,
        amount: 1,
      },
      openOrderAfterInsert: true,
    };
  },
  methods: {
    async addItem(orderId) {
      if (this.order.menuItemId && this.order.amount >= 1) {
        await this.$http.post(env.WS.ORDER.BYID(orderId), this.order);
        this.$bvToast.toast("Item adicionado", {
          variant: "success",
        });
      } else {
        this.$bvToast.toast("Precisa selecionar um item.", {
          variant: "danger",
        });
      }
    },
    async closeOrder(customer) {
      try {
        await this.$http.put(env.WS.ORDER.BYID(customer.order.id), {
          status: "closed",
          paid: this.orderIsPaid,
        });

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
  },
};
