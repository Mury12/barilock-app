<template>
  <b-row>
    <b-col cols="12">
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
          </div>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="12" class="table-wrapper">
      <customer
        v-for="(table, index) in this.filteredTables"
        :key="index + customers.length"
      />
    </b-col>
  </b-row>
</template>

<script>
import Customer from "./Customer.vue";

export default {
  components: { Customer },
};
</script>

<style>
</style>
