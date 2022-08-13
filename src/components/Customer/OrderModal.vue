<template>
  <b-modal
    hide-footer
    id="table-modal"
    size="xl"
    :title="`${customer?.id || ''} - ${customer?.name || ''}`"
  >
    <b-row v-if="customer">
      <b-col cols="2" class="d-flex flex-column text-left">
        <b-button variant="success" @click="$bvModal.show('close-order-modal')">
          Fechar comanda
        </b-button>
      </b-col>
      <b-col cols="4">
        <p>Mesa: {{ customer.tableNum }}</p>
        <p>Cliente: {{ customer.name }}</p>
        <p>ID da comanda: {{ customer.order.id }}</p>
        <p>Estado: {{ customer.order.status }}</p>
        <p>Horário: {{ customer.order.createdAt }}</p>
        <p>Ultimo pedido: {{ customer.order.updatedAt || "-" }}</p>
        <p>Total: R${{ customer.order.totalPrice }}</p>
      </b-col>
      <b-col cols="6">
        <h4>Itens na comanda</h4>
        <div class="order-item">
          <b-table
            responsive
            striped
            hover
            :items="customer.order.items"
            :fields="['name', 'amount', 'price', 'total', 'status']"
          >
          </b-table>
        </div>

        <h5>Adicionar item</h5>
        <b-form @submit.prevent="$emit('submit', customer.order.id)">
          <b-select value="0" :options="getOptions" v-model="order.menuItemId">
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
</template>

<script>
export default {
  name: "OrderModal",
  data() {
    return {};
  },
  props: {
    customer: {
      type: Object,
      default: undefined,
    },
    products: {
      type: Array,
      default: () => [],
    },
    order: {
      type: Object,
      default: () => ({
        menuItemId: null,
        amount: 1,
      }),
    },
  },
  computed: {
    getOptions() {
      return this.products.map((p) => ({
        value: p.id,
        text: `${p.product.name} - R$ ${p.price}`,
      }));
    },
  },
};
</script>

<style>
</style>
