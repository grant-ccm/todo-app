<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { BASE_URL, TODO_NAME_RULES, Todo } from "../main";
import axios from "axios";
import TheLoader from "./TheLoader.vue";

type TodoForm = {
  todoName: string;
  isComplete: boolean;
  editing: boolean;
};

const route = useRoute();
const router = useRouter();

const displayLoader = ref(true);
const todo = ref<Todo | undefined>();
const editingTodo = ref<TodoForm>({
  todoName: "",
  isComplete: false,
  editing: false,
});

const rules = {
  ...TODO_NAME_RULES,
  isComplete: { required: helpers.withMessage("Status is required", required) },
};

const validator = useVuelidate(rules, editingTodo);

function toggleEditTodo() {
  editingTodo.value =
    todo.value && !editingTodo.value.editing
      ? {
          todoName: todo.value.todoName,
          isComplete: todo.value.isComplete,
          editing: true,
        }
      : { todoName: "", isComplete: false, editing: false };
}

async function getTodoById(id: string) {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data.data;
}

async function updateTodo(title: string, complete: boolean) {
  await axios.post(BASE_URL, {
    todoName: title,
    isComplete: complete,
  });
}

async function deleteTodo(id: string) {
  await axios.delete(`${BASE_URL}/${id}`);
}

async function submitForm() {
  validator.value.$touch();
  if (
    !editingTodo.value.editing ||
    todo.value === undefined ||
    validator.value.$invalid
  )
    return;
  displayLoader.value = true;
  try {
    await deleteTodo(todo.value._id);
    await updateTodo(editingTodo.value.todoName, editingTodo.value.isComplete);
    // Don't want to revisit this id route... shouldn't exist anymore
    router.replace("/todos");
  } catch (error) {
    console.log(error);
  } finally {
    displayLoader.value = false;
  }
}

onMounted(async () => {
  try {
    const todoId = route.params.id;
    if (typeof todoId === "string") {
      const response = await getTodoById(todoId);
      todo.value = response;
    }
  } catch (error) {
    console.log(error);
  } finally {
    displayLoader.value = false;
  }
});
</script>

<template>
  <div>
    <h2>Todo Details</h2>
    <p>
      View the details of your todo, edit the name, or change the completion
      status
    </p>
    <div v-if="!editingTodo.editing && todo" class="detail-container">
      <div>
        <label>Todo Name:</label>
        <span>{{ todo.todoName }}</span>
      </div>
      <div>
        <label>Status:</label>
        <span>{{ todo.isComplete ? "Complete" : "Incomplete" }}</span>
      </div>
      <div>
        <label>Created At:</label>
        <span>{{ todo.createdAt }}</span>
      </div>
      <div>
        <label>Updated At:</label>
        <span>{{ todo.updatedAt }}</span>
      </div>
      <button @click="toggleEditTodo">Edit</button>
    </div>
    <form
      v-else-if="editingTodo.editing && todo"
      class="detail-container"
      @submit.prevent="submitForm"
    >
      <div class="status-container">
        <label>Todo Name:</label>
        <input type="text" v-model.trim="editingTodo.todoName" />
        <div class="error-message">
          {{ validator?.todoName?.$errors[0]?.$message }}
        </div>
      </div>
      <div class="status-container">
        <label>Status:</label>
        <div>
          <input
            type="radio"
            id="complete"
            v-model="editingTodo.isComplete"
            :value="true"
          />
          <label for="complete">Complete</label>
          <input
            type="radio"
            id="incomplete"
            v-model="editingTodo.isComplete"
            :value="false"
          />
          <label for="incomplete">Incomplete</label>
        </div>
        <div class="error-message">
          {{ validator?.isComplete?.$errors[0]?.$message }}
        </div>
      </div>
      <TheLoader v-if="displayLoader" message="Updating Todo" />
      <div v-else class="button-container">
        <button @click="toggleEditTodo">Cancel</button>
        <button type="submit">Save</button>
      </div>
    </form>
    <TheLoader v-else-if="displayLoader" />
  </div>
</template>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}
.status-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
label {
  font-weight: 600;
  padding-right: 20px;
}
button {
  align-self: center;
}
.error-message {
  color: red;
  font-size: 12px;
}
.button-container {
  display: flex;
  justify-content: space-between;
  align-self: center;
  width: 200px;
}
form {
  display: flex;
  flex-direction: column;
}
</style>
