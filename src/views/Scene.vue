<template>
  <div class="scene" id="scene"></div>
</template>

<script setup>
import Base3d from "../utils/Base3d.js";
import { reactive, onMounted } from "vue";
const data = reactive({
  base3d: {},
});

onMounted(() => {
  data.base3d = new Base3d("#scene");
});
</script>