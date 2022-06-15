import './style.css';
import { setCompleted, isCompleted } from './completed.js';
import {
  addTask, removeTask, addInputEditor, clearCompletedTasks,
} from './crud.js';
import { saveTasksToLocalStorage, inspectLocalStorage } from './local-storage.js';

let tasks = [];

const itemsList = document.getElementById('list-items');

function displayItems(tasksArray) {
  tasksArray.forEach((task) => {
    const item = document.createElement('li');
    item.id = `item-${task.index}`;

    item.innerHTML = `
      <input type="checkbox">
      <span>${task.description}</span>
      <button type="button" id="menu-btn">&#8942;</button>
      <button type="button" id="delete-btn" class="hidden"><i class="gg-trash"></i></button>`;

    itemsList.appendChild(item);

    const itemText = item.children[1];
    const itemCheckbox = item.children[0];

    if (isCompleted(task) === 'done') {
      itemText.classList.add('done');
      itemCheckbox.checked = true;
    } else {
      itemText.classList.remove('done');
    }

    itemCheckbox.addEventListener('change', () => {
      setCompleted(task);
      saveTasksToLocalStorage(tasksArray);

      if (isCompleted(task) === 'done') {
        itemText.classList.add('done');
      } else {
        itemText.classList.remove('done');
      }
    });

    const deleteButton = item.children[3];

    deleteButton.addEventListener('click', () => {
      removeTask(task, tasksArray);
      // eslint-disable-next-line no-use-before-define
      refreshItemsList();
    });

    addInputEditor(task, tasksArray);
  });
}

function refreshItemsList() {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  itemsList.innerHTML = '';
  displayItems(tasks);
}

const itemInput = document.getElementById('item-input');
const enterButton = document.querySelector('.enter-button');

enterButton.addEventListener('click', () => {
  addTask(tasks, itemInput.value);
  saveTasksToLocalStorage(tasks);
  refreshItemsList();
  itemInput.value = '';
});

itemInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    enterButton.click();
  }
});

const clearButton = document.getElementById('clear-completed');

clearButton.addEventListener('click', () => {
  clearCompletedTasks(tasks);
  refreshItemsList();
});

if (inspectLocalStorage()) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  displayItems(tasks);
}
