<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="w-100 d-flex">
    <div
      class="square mx-2 pointer"
      :class="{ selected: selected.includes(idx + 1) }"
      v-for="(i, idx) in items"
      :key="idx"
      @click="addOrRemove(idx + 1)"
    >
      {{ idx + 1 }}
      <div
        v-if="selected.includes(idx + 1)"
        class="square anim"
        :style="{
          backgroundImage: `url(${ghost})`,
        }"
      >
        {{ idx + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
import GhostImage from "../../assets/ghost.png";

export default {
  name: "Ghost",

  data() {
    return {
      items: [],
      selected: [],
      ghost: GhostImage,
    };
  },
  methods: {
    addOrRemove(idx) {
      const found = this.selected.indexOf(idx);
      if (!~found) this.selected.push(idx);
      else this.selected.splice(found, 1);
    },
  },
  mounted() {
    this.items = Array(10).fill("");
  },
};
</script>

<style scoped>
.square {
  position: relative;
  width: 20px;
  height: 20px;
}
.selected {
  background-color: var(--success);
}
.anim {
  position: absolute;
  height: 100px;
  width: 100px;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-size: contain;
  animation: ghost forwards 1s;
}

@keyframes ghost {
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }
  20% {
    opacity: 1;
    transform: translateY(-100px);
  }

  100% {
    opacity: 0;
    transform: translateY(-150px);
  }
}
</style>
