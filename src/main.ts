import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import HomePage from "./components/HomePage.vue";
import CreateTodo from "./components/CreateTodo.vue";
import TodoDetails from "./components/TodoDetails.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faGripLines,
  faPenToSquare,
  faSquareCheck,
  faSquareXmark,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { createRouter, createWebHistory } from "vue-router";
import { helpers, required } from "@vuelidate/validators";

export const BASE_URL = "https://calm-plum-jaguar-tutu.cyclic.app/todos";
export type Todo = {
  createdAt: string;
  isComplete: boolean;
  todoName: string;
  updatedAt: string;
  _id: string;
};

const includesVue = (val: string) => val.toLowerCase().includes("vue");
const noSymbolsIncluded = (val: string) =>
  new RegExp("^[A-Za-z0-9 ]*$").test(val);

export const TODO_NAME_RULES = {
  todoName: {
    required: helpers.withMessage("Title is required", required),
    includesVue: helpers.withMessage('Title must include "Vue"', includesVue),
    noSymbolsIncluded: helpers.withMessage(
      "Title cannot contain symbols",
      noSymbolsIncluded
    ),
  },
};

/* add icons to the library */
library.add(
  faAngleUp,
  faAngleDown,
  faGripLines,
  faPenToSquare,
  faSquareCheck,
  faSquareXmark,
  faTrash
);

const routes = [
  { path: "/", redirect: "/todos" },
  {
    path: "/todos",
    component: HomePage,
  },
  { path: "/todos/add", component: CreateTodo },
  { path: "/todos/:id", component: TodoDetails },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
