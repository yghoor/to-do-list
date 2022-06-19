/**
 * @jest-environment jsdom
 */

import { addTask } from '../src/crud.js';

document.body.innerHTML = `
  <div class="add-item">
    <button type="button" class="enter-button">&#8629;</button>
  </div>
  <ul id="list-items"></ul>`;

const enterButton = document.querySelector('.enter-button');
const itemsList = document.getElementById('list-items');

let tasks = [
  {
    description: 'Task 1',
    completed: false,
    index: 1,
  },
  {
    description: 'Task 2',
    completed: false,
    index: 2,
  },
  {
    description: 'Task 3',
    completed: false,
    index: 3,
  },
];

let storage = [];

const itemInput = 'Task-4';

function saveToStorage(tasksArray) {
  storage = tasksArray;
}

function renumberTaskIndexes(tasksArray) {
  tasksArray.forEach((task, taskNum) => {
    task.index = taskNum + 1;
  });
  saveToStorage(tasksArray);
}

function removeTask(task, tasksArray) {
  const currentItem = document.getElementById(`item-${task.index}`);
  itemsList.removeChild(currentItem);

  const taskIndex = task.index - 1;

  tasksArray.splice(taskIndex, 1);

  renumberTaskIndexes(tasksArray);
}

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

    const deleteButton = item.children[3];

    deleteButton.addEventListener('click', () => {
      removeTask(task, tasksArray);
      saveToStorage(tasksArray);
      // eslint-disable-next-line no-use-before-define
      refreshItemsList();
    });
  });
}
