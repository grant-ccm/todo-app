<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import axios from "axios";

const BASE_URL = "https://calm-plum-jaguar-tutu.cyclic.app/todos";

type Todo = {
  createdAt: string;
  isComplete: boolean;
  todoName: string;
  updatedAt: string;
  _id: string;
};

const props = defineProps<{
  titleFilter: string;
  statusFilter: "all" | "complete" | "incomplete";
}>();

const todos: Ref<Todo[]> = ref([]);
const editingTodo: Ref<Todo | null> = ref(null);
const addingTodo: Ref<string | null> = ref(null);
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
    : filteredTodos.value.toSorted((a, b) => {
        if (
          (a.todoName > b.todoName && titleSort.value === "asc") ||
          (a.todoName < b.todoName && titleSort.value === "desc")
        ) {
          return 1;
        } else if (
          (a.todoName < b.todoName && titleSort.value === "asc") ||
          (a.todoName > b.todoName && titleSort.value === "desc")
        ) {
          return -1;
        } else return 0;
      })
);

async function getTodos() {
  try {
    const response = await axios.get(BASE_URL);
    todos.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function updateTodo(updatedTodo: Todo) {
  try {
    const updatedAt = new Date().toISOString();
    await axios.put(`${BASE_URL}/${updatedTodo._id}`, {
      ...updatedTodo,
      updatedAt,
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteTodo(todoId: string) {
  try {
    await axios.delete(`${BASE_URL}/${todoId}`);
    await getTodos();
  } catch (error) {
    console.log(error);
  }
}

async function postNewTodo() {
  try {
    await axios.post(BASE_URL, {
      todoName: addingTodo.value,
      isComplete: false,
    });
    addingTodo.value = null;
    await getTodos();
  } catch (error) {
    console.log(error);
  }
}

async function handleEditClick(todo: Todo) {
  if (editingTodo.value && editingTodo.value._id === todo._id) {
    await updateTodo(editingTodo.value);
    await getTodos();
    editingTodo.value = null;
  } else {
    editingTodo.value = { ...todo };
  }
}

onMounted(() => {
  getTodos();
});
</script>

<template>
  <table>
    <tr>
      <th class="title-header" @click="handleSortChange">
        <span>Title</span>
        <font-awesome-icon class="sort-icon" :icon="titleSortIcon" />
      </th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
    <tr class="todo-container" v-for="todo in sortedTodos" :key="todo._id">
      <td class="name-container">
        <input
          v-if="editingTodo && editingTodo._id === todo._id"
          type="text"
          v-model="editingTodo.todoName"
        />
        <span v-else>
          {{ todo.todoName }}
        </span>
      </td>
      <td class="complete-container">
        <template v-if="editingTodo && editingTodo._id === todo._id">
          <input
            type="radio"
            v-model="editingTodo.isComplete"
            :value="true"
          />Complete
          <input
            type="radio"
            v-model="editingTodo.isComplete"
            :value="false"
          />Incomplete
        </template>
        <span v-else>
          {{ todo.isComplete ? "Complete" : "Incomplete" }}
        </span>
      </td>
      <td class="action-container">
        <template v-if="editingTodo && editingTodo._id === todo._id">
          <font-awesome-icon
            class="action-icon"
            @click="handleEditClick(todo)"
            icon="fa-solid fa-square-check"
          />
          <font-awesome-icon
            class="action-icon"
            @click="editingTodo = null"
            icon="fa-solid fa-square-xmark"
          />
        </template>
        <template v-else>
          <font-awesome-icon
            class="action-icon"
            @click="handleEditClick(todo)"
            icon="fa-solid fa-pen-to-square"
          />
          <font-awesome-icon
            class="action-icon"
            @click="deleteTodo(todo._id)"
            icon="fa-solid fa-trash"
          />
        </template>
      </td>
    </tr>
    <tr v-if="addingTodo !== null">
      <td class="name-container">
        <input
          type="text"
          placeholder="New Todo title..."
          v-model="addingTodo"
        />
      </td>
      <td class="complete-container">Incomplete</td>
      <td class="action-container">
        <font-awesome-icon
          class="action-icon"
          @click="postNewTodo"
          icon="fa-solid fa-square-check"
        />
        <font-awesome-icon
          class="action-icon"
          @click="addingTodo = null"
          icon="fa-solid fa-square-xmark"
        />
      </td>
    </tr>
  </table>
  <button v-if="addingTodo === null" @click="addingTodo = ''">
    Add New Todo
  </button>
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
}
tr:nth-child(even) {
  background-color: rgb(227, 227, 227);
}
td {
  padding: 10px;
  text-align: left;
}

.title-header {
  position: relative;
  cursor: pointer;
}
.sort-icon {
  position: absolute;
  top: 10px;
  right: 100px;
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

.new-todo-container {
  display: flex;
}

tr input {
  width: 80%;
}
</style>
