<script setup lang="ts">
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { BASE_URL, TODO_NAME_RULES } from "../main";
import axios from "axios";
import { useRouter } from "vue-router";

const formData = ref({ todoName: "" });

const router = useRouter();

const validator = useVuelidate(TODO_NAME_RULES, formData);

async function postNewTodo(title: string) {
  try {
    await axios.post(BASE_URL, {
      todoName: title,
      isComplete: false,
    });
  } catch (error) {
    console.log(error);
  }
}

async function submitForm() {
  validator.value.$touch();
  if (!validator.value.$invalid) {
    await postNewTodo(formData.value.todoName);
    router.push("/todos");
  }
}
</script>

<template>
  <div>
    <h2>Create a New Todo</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label>Todo Title:</label>
        <input type="text" v-model.trim="formData.todoName" />
      </div>
      <div class="error-message">
        {{ validator?.todoName?.$errors[0]?.$message }}
      </div>
      <button type="submit">Save Todo</button>
    </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
label {
  font-weight: 500;
  padding-right: 15px;
}
button {
  max-width: 150px;
}
.error-message {
  color: red;
  font-size: 12px;
}
</style>
