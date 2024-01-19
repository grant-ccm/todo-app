<script setup lang="ts">
import { Ref, ref } from "vue";
import TheTable from "./components/TheTable.vue";

type StatusFilter = "all" | "complete" | "incomplete";

const titleFilter = ref("");
const statusFilter: Ref<StatusFilter> = ref("all");
</script>

<template>
  <div class="container">
    <div class="filter-container">
      <div class="title-filter-container">
        <label><h3>Filter by Title:</h3> </label>
        <input
          type="text"
          v-model="titleFilter"
          placeholder="Enter some text..."
        />
      </div>
      <div class="status-filter-container">
        <label>
          <h3>Filter by Status:</h3>
        </label>
        <div>
          <input type="radio" v-model="statusFilter" value="all" />
          <label>All</label>
        </div>
        <div>
          <input type="radio" v-model="statusFilter" value="complete" />
          <label>Complete</label>
        </div>
        <div>
          <input type="radio" v-model="statusFilter" value="incomplete" />
          <label>Incomplete</label>
        </div>
      </div>
    </div>
    <TheTable :title-filter="titleFilter" :status-filter="statusFilter" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.filter-container {
  display: flex;
  gap: 50px;
  margin-bottom: 20px;
}
.title-filter-container {
  display: flex;
  flex-direction: column;
  text-align: left;
  height: 100%;
}
.title-filter-container input {
  padding: 5px;
}
.status-filter-container {
  text-align: left;
}
</style>
