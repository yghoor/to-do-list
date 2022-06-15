import './style.css';
import { setCompleted, isCompleted } from './completed.js';
import {
  addTask, removeTask, addInputEditor, clearCompletedTasks,
} from './crud.js';
import { saveTasksToLocalStorage, inspectLocalStorage } from './local-storage.js';

let tasks = [];

const itemsList = document.getElementById('list-items');

function displayItems(tasksArr) {
  tasksArr.forEach((task) => {
    const item = document.createElement('li');
    item.id = `item-${task.index}`;

    item.innerHTML = `
      <input type="checkbox">
      <span>${task.description}</span>
      <button type="button">&#8942;</button>`;

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
      saveTasksToLocalStorage();

      if (isCompleted(task) === 'done') {
        itemText.classList.add('done');
      } else {
        itemText.classList.remove('done');
      }
    });
  });
}

if (inspectLocalStorage()) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  displayItems(tasks);
}
