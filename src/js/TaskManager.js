/* eslint-disable default-case */
import TaskManagerMarkups from "./TaskManagerMarkups";

export default class TaskManager {
  constructor(markups) {
    this.markups = markups;
    try {
      this.storage = JSON.parse(localStorage.getItem("tasklist"));
    } catch (e) {
      this.storage = null;
    }
    this.todoTasks = null;
    this.inProgressTasks = null;
    this.doneTasks = null;
  }

  init() {
    this.markups.render();
    document.addEventListener("click", this.constructor.onClick.bind(this));

    const todoList = document.querySelector(".tasklist__todo");
    const inProgressList = document.querySelector(".tasklist__in-progress");
    const doneList = document.querySelector(".tasklist__done");

    if (this.storage !== null) {
      for (const list in this.storage) {
        if (this.storage[list].length !== 0) {
          this.storage[list].forEach((task) => {
            const taskBlock = TaskManagerMarkups.taskBlock(task);
            switch (list) {
              case "todoList":
                todoList.appendChild(taskBlock);
                break;
              case "inProgressList":
                inProgressList.appendChild(taskBlock);
                break;
              case "doneList":
                doneList.appendChild(taskBlock);
                break;
            }
          });
        }
      }
    }

    this.todoTasks = document
      .querySelector(".tasklist__todo")
      .getElementsByClassName("tasklist__task");
    this.inProgressTasks = document
      .querySelector(".tasklist__in-progress")
      .getElementsByClassName("tasklist__task");
    this.doneTasks = document
      .querySelector(".tasklist__done")
      .getElementsByClassName("tasklist__task");
  }

  static onClick(event) {
    if (event.target.classList.contains("tasklist__add-task")) {
      this.constructor.showAddTaskBlock(event);
    } else if (
      event.target.classList.contains("tasklist__task-cancel-button")
    ) {
      this.constructor.hideAddTaskBlock(event);
    } else if (event.target.classList.contains("tasklist__task-add-button")) {
      this.addTask(event);
    } else if (event.target.classList.contains("tasklist__task-delete-btn")) {
      this.removeTask(event);
    }
  }

  static showAddTaskBlock(event) {
    event.target.classList.add("hidden");
    event.target
      .closest(".tasklist__footer")
      .appendChild(TaskManagerMarkups.addTaskBlock());
  }

  static hideAddTaskBlock(event) {
    event.target
      .closest(".tasklist__footer")
      .querySelector(".tasklist__add-task")
      .classList.remove("hidden");
    event.target.closest(".tasklist__add-task-block").remove();
  }

  addTask(event) {
    const targetInput = event.target
      .closest(".tasklist__add-task-block")
      .querySelector(".tasklist__task-input");
    const { value } = targetInput;
    if (value.length === 0) {
      targetInput.style.borderColor = "red";
      targetInput.blur();
      return;
    }
    const task = TaskManagerMarkups.taskBlock(value);
    const tasklist = event.target
      .closest(".tasklist__bar")
      .querySelector(".tasklist__list");
    tasklist.appendChild(task);

    const hidden = event.target
      .closest(".tasklist__footer")
      .querySelector(".tasklist__add-task");
    hidden.classList.remove("hidden");
    event.target.closest(".tasklist__add-task-block").remove();
    this.constructor.saveTaskList(
      this.todoTasks,
      this.inProgressTasks,
      this.doneTasks
    );
  }

  removeTask(event) {
    event.target.closest(".tasklist__task").remove();
    this.constructor.saveTaskList(
      this.todoTasks,
      this.inProgressTasks,
      this.doneTasks
    );
  }

  static saveTaskList(todo, inProgress, done) {
    const todoList = [];
    const inProgressList = [];
    const doneList = [];
    [...todo].forEach((task) => todoList.push(task.textContent.slice(0, -1)));
    [...inProgress].forEach((task) =>
      inProgressList.push(task.textContent.slice(0, -1))
    );
    [...done].forEach((task) => doneList.push(task.textContent.slice(0, -1)));

    const objToSave = JSON.stringify({ todoList, inProgressList, doneList });
    localStorage.setItem("tasklist", objToSave);
  }
}
