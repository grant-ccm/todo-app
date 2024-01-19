import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
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

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
