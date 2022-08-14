<template>
  <div
    class="floating-menu position-fixed d-flex flex-column align-items-end"
    style="bottom: 30px; right: 30px; z-index: 999"
  >
    <transition mode="out-in" name="fade">
      <div class="floating-menu-content rounded card p-3" v-if="show">
        <menu-button :enabled="canAdd" @click="$emit('add')" />
        <menu-button icon="minus-circle" variant="danger" :enabled="canRemove" @click="$emit('remove')" />
      </div>
    </transition>
    <div
      class="floating-menu-icon rounded-circle pointer bg-info d-flex justify-content-center align-items-center text-white mt-2"
      style="width: 50px; height: 50px"
      @click="show = !show"
    >
      <fa-icon icon="cog" class="fa-2x" />
    </div>
  </div>
</template>

<script>
  import MenuButton from "./MenuButton.vue";
  export default {
    components: { MenuButton },
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
RemoveTableButton
