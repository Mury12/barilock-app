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
        <p>Estado: <order-status :status="customer.order.status" /></p>
        <p>Abertura: {{ date(customer.order.createdAt) }}</p>
        <p>Ultimo pedido: {{ date(customer.order.updatedAt) }}</p>
        <p>Total: {{ currency }} {{ customer.order.totalPrice }}</p>
      </b-col>
      <b-col cols="6">
        <h4>Itens na comanda</h4>
        <div class="order-table">
          <b-table
            responsive
            striped
            hover
            :items="customer.order.items"
            sticky-header
            :fields="['name', 'amount', 'price', 'total', 'status']"
          >
            <template #cell(price)="row">
              {{ currency }} {{ row.item.price }}
            </template>
            <template #cell(total)="row">
              {{ currency }} {{ row.item.total }}
            </template>
          </b-table>
        </div>

        <h5>Adicionar item</h5>
        <b-form @submit.prevent="$emit('submit', customer.order.id)">
          <b-select
            value="null"
            :options="getOptions"
            v-model="order.menuItemId"
          >
            <option value="null" selected disabled>Selecione um item</option>
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
  import { mapStores } from "pinia";
  import { useMainStore } from "@/store";
  import { date, status } from "@/common/helpers";
  import OrderStatus from "../OrderStatus.vue";

  export default {
    name: "OrderModal",
    components: { OrderStatus },
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
    methods: {
      date,
      status,
    },
    computed: {
      ...mapStores(useMainStore),
      getOptions() {
        return this.products.map((p) => ({
          value: p.id,
          text: `${p.product.name} - R$ ${p.price}`,
        }));
      },
      currency() {
        return this.mainStore.getCurrency;
      },
    },
  };
</script>

<style>
  .order-table {
    max-height: 350px;
    overflow-y: auto;
  }
</style>
