<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

withDefaults(defineProps<{ message?: string }>(), { message: "Loading" });

const interval = ref();
const dots = ref("");

onMounted(() => {
  interval.value = setInterval(() => {
    dots.value = ".".repeat((dots.value.length + 1) % 4);
  }, 500);
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div>{{ message }}{{ dots }}</div>
</template>
