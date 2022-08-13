<template>
  <div
    style="width: 100px"
    class="c-table pointer d-flex align-items-center justify-content-center"
    @click="$emit('select', customer.tableNum)"
    :class="{ occupied: customer?.name }"
  >
    <div class="d-flex flex-column">
      {{ customer?.tableNum }}<br />
      <small>{{ customer?.name || "Livre" }}</small>
    </div>
  </div>
</template>

<script>
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
};
</script>

<style>
.c-table {
  background-color: rgb(0, 0, 0, 0.225);
  color: black;
  font-size: 1.5em;
  border-radius: 5px;
  height: 60px;
  border: 1px solid silver;
}
.c-table small {
  font-size: 12px;
}
.occupied {
  background-color: var(--success);
  color: white;
}
</style>
