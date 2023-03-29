import DragAndDrop from "./DragAndDrop";
import TaskManager from "./TaskManager";
import TaskManagerMarkups from "./TaskManagerMarkups";

const container = document.querySelector(".container");
const markups = new TaskManagerMarkups(container);
const taskManager = new TaskManager(markups);
const dnd = new DragAndDrop();

taskManager.init();
dnd.init();
