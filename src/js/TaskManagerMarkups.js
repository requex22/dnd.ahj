export default class TaskManagerMarkups {
  constructor(container) {
    this.container = container;
  }

  static get mainMarkup() {
    return `
      <div class="tasklist">
        <div class="tasklist__bar">
          <h3 class="tasklist__header">todo</h3>
          <ul class="tasklist__todo tasklist__list"></ul>
          <div class="tasklist__footer">
            <span class="tasklist__add-task">+ add new task</span>
          </div>
        </div>
        <div class="tasklist__bar">
          <h3 class="tasklist__header">in progress</h3>
          <ul class="tasklist__in-progress tasklist__list"></ul>
          <div class="tasklist__footer">
            <span class="tasklist__add-task">+ add new task</span>
          </div>
        </div>
        <div class="tasklist__bar">
          <h3 class="tasklist__header">done</h3>
          <ul class="tasklist__done tasklist__list"></ul>
          <div class="tasklist__footer">
            <span class="tasklist__add-task">+ add new task</span>
          </div>
        </div>
      </div>
      `;
  }

  render() {
    this.container.insertAdjacentHTML("beforeend", this.constructor.mainMarkup);
  }

  static addTaskBlock() {
    const block = document.createElement("div");
    block.classList.add("tasklist__add-task-block");

    const textarea = document.createElement("textarea");
    textarea.classList.add("tasklist__task-input");
    textarea.placeholder = "Введите текст задачи...";

    const addButton = document.createElement("button");
    addButton.classList.add("tasklist__task-add-button");
    addButton.textContent = "Добавить задачу";

    const cancelButton = document.createElement("span");
    cancelButton.classList.add("tasklist__task-cancel-button");
    cancelButton.textContent = "×";

    block.appendChild(textarea);
    block.appendChild(addButton);
    block.appendChild(cancelButton);

    return block;
  }

  static taskBlock(input) {
    const task = document.createElement("div");
    task.classList.add("tasklist__task");
    task.textContent = input;

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("tasklist__task-delete-btn", "hidden");
    deleteButton.textContent = "\u00D7";
    task.appendChild(deleteButton);

    return task;
  }
}
