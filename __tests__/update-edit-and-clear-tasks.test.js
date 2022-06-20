/**
 * @jest-environment jsdom
 */

import { setCompleted, isCompleted } from '../src/completed.js';
import { clearCompletedTasks } from '../src/crud.js';

document.body.innerHTML = `
  <div class="add-item">
    <button type="button" class="enter-button">&#8629;</button>
  </div>
  <ul id="list-items"></ul>`;

const itemsList = document.getElementById('list-items');

const tasks = [
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

function addInputEditor(task, tasksArray) {
  const currentItem = document.getElementById(`item-${task.index}`);
  const currentItemText = currentItem.children[1];

  currentItemText.addEventListener('click', () => {
    const taskEditor = document.createElement('input');
    taskEditor.type = 'text';
    taskEditor.value = task.description;

    if (currentItemText.innerHTML === task.description) {
      currentItemText.innerHTML = '';
      currentItemText.appendChild(taskEditor);
    }

    taskEditor.focus();

    taskEditor.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        task.description = `${taskEditor.value}`;

        if (taskEditor.value === '') {
          removeTask(task, tasksArray);
        }

        saveToStorage(tasksArray);

        currentItemText.textContent = `${taskEditor.value}`;
      }
    });
  });
}
