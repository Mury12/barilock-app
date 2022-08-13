<template>
  <div
    class="floating-menu position-fixed d-flex flex-column align-items-end"
    style="bottom: 30px; right: 30px; z-index: 999"
  >
    <transition mode="out-in" name="fade">
      <div class="floating-menu-content rounded card p-3" v-if="show">
        <div
          class="
            d-flex
            flex-column
            c-table
            bg-transparent
            pointer
            d-flex
            justify-content-center
            align-items-center
            mb-2
          "
          :class="{ disabled: !canAdd }"
          style="width: 100px"
          @click="canAdd ? $emit('add') : null"
        >
          <fas icon="plus-circle" class="fa-2x text-success" /><br />
        </div>
        <div
          class="
            d-flex
            flex-column
            c-table
            bg-transparent
            pointer
            d-flex
            justify-content-center
            align-items-center
          "
          :class="{ disabled: !canRemove }"
          style="width: 100px"
          @click="canRemove ? $emit('remove') : null"
        >
          <fas icon="minus-circle" class="fa-2x text-danger" /><br />
        </div>
      </div>
    </transition>
    <div
      class="
        floating-menu-icon
        rounded-circle
        pointer
        bg-info
        d-flex
        justify-content-center
        align-items-center
        text-white
        mt-2
      "
      style="width: 50px; height: 50px"
      @click="show = !show"
    >
      <fas icon="cog" class="fa-2x" />
    </div>
  </div>
</template>

<script>
export default {
  name: "FloatingMenu",
  data() {
    return {
      show: false,
    };
  },
  props: {
    canAdd: {
      type: Boolean,
      default: false,
    },
    canRemove: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}
</style>
