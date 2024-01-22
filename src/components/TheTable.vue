<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import { BASE_URL, Todo } from "../main";
import axios from "axios";
import { useRouter } from "vue-router";
import TheLoader from "./TheLoader.vue";

const props = defineProps<{
  titleFilter: string;
  statusFilter: "all" | "complete" | "incomplete";
}>();

const router = useRouter();

const todos = ref<Todo[]>([]);
const status = ref<"" | "loading" | "deleting">("loading");

const titleSort: Ref<"none" | "asc" | "desc"> = ref("none");
const titleSortIcon = computed(() =>
  titleSort.value === "none"
    ? "fa-solid fa-grip-lines"
    : titleSort.value === "asc"
    ? "fa-solid fa-angle-up"
    : "fa-solid fa-angle-down"
);

const filteredTodos = computed(() =>
  todos.value.filter(
    (todo) =>
      todo.todoName.toLowerCase().includes(props.titleFilter.toLowerCase()) &&
      (props.statusFilter === "all" ||
        (props.statusFilter === "complete" && todo.isComplete) ||
        (props.statusFilter === "incomplete" && !todo.isComplete))
  )
);

function handleSortChange() {
  titleSort.value =
    titleSort.value === "none"
      ? "asc"
      : titleSort.value === "asc"
      ? "desc"
      : "none";
}

const sortedTodos = computed(() =>
  titleSort.value === "none"
    ? filteredTodos.value
    : filteredTodos.value.toSorted((a, b) =>
        titleSort.value === "asc"
          ? a.todoName.localeCompare(b.todoName, "en", { sensitivity: "base" })
          : b.todoName.localeCompare(a.todoName, "en", { sensitivity: "base" })
      )
);

async function getTodos() {
  const response = await axios.get(BASE_URL);
  return response.data.data;
}

async function deleteTodo(id: string) {
  await axios.delete(`${BASE_URL}/${id}`);
}

async function handleDeleteClick(id: string) {
  status.value = "deleting";
  try {
    await deleteTodo(id);
    const response = await getTodos();
    todos.value = response;
  } catch (error) {
    console.log(error);
  } finally {
    status.value = "";
  }
}

onMounted(async () => {
  try {
    const response = await getTodos();
    todos.value = response;
  } catch (error) {
    console.log(error);
  } finally {
    status.value = "";
  }
});
</script>

<template>
  <TheLoader v-if="status === 'deleting'" message="Deleting Todo" />
  <TheLoader v-if="status === 'loading'" />
  <table v-else>
    <tr>
      <th class="title-header" @click="handleSortChange">
        <span>Title</span>
        <font-awesome-icon :icon="titleSortIcon" />
      </th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
    <tr class="todo-container" v-for="todo in sortedTodos" :key="todo._id">
      <td class="name-container">
        {{ todo.todoName }}
      </td>
      <td class="complete-container">
        {{ todo.isComplete ? "Complete" : "Incomplete" }}
      </td>
      <td class="action-container">
        <font-awesome-icon
          class="action-icon"
          @click="router.push('/todos/' + todo._id)"
          icon="fa-solid fa-pen-to-square"
        />
        <font-awesome-icon
          class="action-icon"
          @click="handleDeleteClick(todo._id)"
          icon="fa-solid fa-trash"
        />
      </td>
    </tr>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
  margin: 20px 0px;
}
th {
  background-color: purple;
  color: white;
  padding: 5px 0px;
  font-size: 20px;
}
tr:nth-child(even) {
  background-color: rgb(227, 227, 227);
}
td {
  padding: 10px;
  text-align: left;
}

.title-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
}
.name-container {
  width: 300px;
}
.complete-container {
  width: 200px;
}
.action-container {
  width: 200px;
  font-size: 24px;
  text-align: center;
}
.action-icon {
  margin: 0px 20px;
  cursor: pointer;
}
</style>
