<template>
  <div
    class="d-flex flex-column c-table bg-transparent pointer d-flex justify-content-center align-items-center mb-2"
    :class="{ disabled: !enabled }"
    style="width: 100px"
    @click="enabled ? $emit('click') : null"
  >
    <fa-icon :icon="icon" :class="`fa-2x text-${variant}`" /><br />
  </div>
</template>
<script>
  export default {
    name: "MenuButton",
    props: {
      enabled: {
        type: Boolean,
        enabled: true,
      },
      icon: {
        type: String,
        default: "plus-circle",
      },
      variant: {
        type: String,
        default: "success",
        required: false,
        validate: (v) =>
          ["success", "danger", "warn", "secondary", "primary"].includes(v),
      },
    },
  };
</script>
