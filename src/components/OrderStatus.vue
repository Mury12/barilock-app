<template>
  <b-badge :variant="variant">{{ pState(status) }}</b-badge>
</template>

<script>
  import { status as pState } from "@/common/helpers";

  export default {
    name: "OrderStatus",
    props: {
      status: {
        type: String,
        default: "open",
      },
    },
    methods: {
      pState,
    },
    computed: {
      variant() {
        return this.status === "open" ? "info" : "danger";
      },
    },
  };
</script>

<style></style>
