<template>
  <div
    style="width: 100px"
    class="c-table pointer d-flex align-items-center justify-content-center"
    @click="selectTable(table.tableNum - 1)"
    :class="{ occupied: table?.name }"
  >
    <div class="d-flex flex-column">
      {{ table?.tableNum }}<br />
      <small>{{ table?.name || "Livre" }}</small>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
