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

