<template>
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
          @click="$emit('sort')"
          class="pointer border rounded mt-2"
        >
          Ordenar mesas
        </b-badge>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "CustomerFilter",
  props: {
    search: {
      type: String,
      default: "",
    },
    filter: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style>
</style>
