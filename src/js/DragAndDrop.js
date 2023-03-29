import TaskManager from "./TaskManager";

export default class DragAndDrop {
  constructor() {
    this.draggedElement = null;
    this.ghostElement = null;
    this.dropPoint = null;

    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseleave = this.onMouseleave.bind(this);
    this.onMouseup = this.onMouseup.bind(this);

    this.shiftX = null;
    this.shiftY = null;
  }

  init() {
    document.addEventListener("mousedown", this.onMousedown);
    document.addEventListener("mousemove", this.onMousemove);
    document.addEventListener("mouseleave", this.onMouseleave);
    document.addEventListener("mouseup", this.onMouseup);
  }

  onMousedown(event) {
    if (!event.target.classList.contains("tasklist__task")) {
      return;
    }
    this.draggedElement = event.target;
    this.ghostElement = event.target.cloneNode(true);
    this.ghostElement.classList.add("dragged");
    document.body.appendChild(this.ghostElement);
    this.shiftX =
      event.pageX - this.draggedElement.getBoundingClientRect().left;
    this.shiftY = event.pageY - this.draggedElement.getBoundingClientRect().top;
    this.moveAt(event.pageX, event.pageY);
  }

  onMousemove(event) {
    if (
      event.clientX <= 0 ||
      event.clientY <= 0 ||
      event.clientX >= window.innerWidth ||
      event.clientY >= window.innerHeight
    ) {
      this.onMouseleave(event);
    }
    if (!event.target.classList.contains("tasklist__task-input")) {
      event.preventDefault();
    }
    if (!this.draggedElement) {
      return;
    }

    this.draggedElement.classList.add("hidden");

    const closest = document.elementFromPoint(event.clientX, event.clientY);
    this.moveAt(event.pageX, event.pageY);
    this.showDropPoint(closest, event);

    if (
      !closest.classList.contains("tasklist__task") &&
      !closest.classList.contains("tasklist__list") &&
      !closest.classList.contains("drop-point") &&
      this.dropPoint !== null
    ) {
      this.dropPoint.remove();
      this.dropPoint = null;
    }
  }

  onMouseleave() {
    if (!this.draggedElement) {
      return;
    }
    this.draggedElement.classList.remove("hidden");
    this.ghostElement.remove();
    this.ghostElement = null;
    this.draggedElement = null;
    if (this.dropPoint) {
      this.dropPoint.remove();
      this.dropPoint = null;
    }
  }

  onMouseup(event) {
    if (!this.draggedElement) {
      return;
    }
    const closest = document.elementFromPoint(event.clientX, event.clientY);
    if (
      !closest.classList.contains("tasklist__task") &&
      !closest.classList.contains("tasklist__list") &&
      !this.dropPoint
    ) {
      this.onMouseleave();
      return;
    }

    this.draggedElement.classList.remove("hidden");

    const closestParent = closest.closest(".tasklist__list");
    closestParent.appendChild(this.draggedElement);
    closestParent.insertBefore(this.draggedElement, this.dropPoint);

    this.ghostElement.remove();
    this.ghostElement = null;
    this.draggedElement = null;
    if (this.dropPoint) {
      this.dropPoint.remove();
      this.dropPoint = null;
    }

    const todoTasks = document
      .querySelector(".tasklist__todo")
      .getElementsByClassName("tasklist__task");
    const inProgressTasks = document
      .querySelector(".tasklist__in-progress")
      .getElementsByClassName("tasklist__task");
    const doneTasks = document
      .querySelector(".tasklist__done")
      .getElementsByClassName("tasklist__task");
    TaskManager.saveTaskList(todoTasks, inProgressTasks, doneTasks);
  }

  moveAt(pageX, pageY) {
    this.ghostElement.style.left = `${pageX - this.shiftX}px`;
    this.ghostElement.style.top = `${pageY - this.shiftY}px`;
  }

  showDropPoint(closest, event) {
    if (
      !closest.classList.contains("tasklist__task") &&
      !closest.classList.contains("tasklist__list")
    ) {
      return;
    }
    if (this.dropPoint) {
      this.dropPoint.remove();
      this.dropPoint = null;
    }

    this.dropPoint = document.createElement("div");
    this.dropPoint.classList.add("drop-point");
    const height = this.ghostElement.offsetHeight;
    this.dropPoint.style.height = `${height}px`;

    if (closest.classList.contains("tasklist__list")) {
      closest.appendChild(this.dropPoint);
    } else if (closest.classList.contains("tasklist__task")) {
      const { top } = closest.getBoundingClientRect();
      const closestParent = closest.closest(".tasklist__list");
      if (event.pageY > window.scrollY + top + closest.offsetHeight / 2) {
        closestParent.insertBefore(this.dropPoint, closest.nextElementSibling);
      } else {
        closestParent.insertBefore(this.dropPoint, closest);
      }
    }
  }
}
