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

function refreshItemsList() {
  tasks = storage;
  itemsList.innerHTML = '';
  displayItems(tasks);
}

enterButton.addEventListener('click', () => {
  addTask(tasks, itemInput);
  saveToStorage(tasks);
  refreshItemsList();
});

describe('task addition tests', () => {
  test('task is added to page after click', () => {
    enterButton.click();

    const itemText = document.getElementById('item-4').children[1].textContent;

    expect(itemText).toEqual(itemInput);
  });

  test('task is added to array after click', () => {
    const expectedTasks = [
      {
        index: 4,
        description: itemInput,
        completed: false,
      },
    ];

    expect(tasks).toEqual(expect.arrayContaining(expectedTasks));
  });

  test('task is added to storage after click', () => {
    const expectedStorage = [
      {
        index: 4,
        description: itemInput,
        completed: false,
      },
    ];

    expect(storage).toEqual(expect.arrayContaining(expectedStorage));
  });
});

describe('task removal tests', () => {
  test('task is removed from page after click', () => {
    const item = document.getElementById('item-4');
    const deleteButton = item.children[3];

    deleteButton.click();

    expect(itemsList.childElementCount).toBe(3);
    expect(document.getElementById('item-4')).toBeNull();
  });

  test('task is removed from array after click', () => {
    const expectedTask = [
      {
        index: 4,
        description: itemInput,
        completed: false,
      },
    ];

    expect(tasks).not.toEqual(expect.arrayContaining(expectedTask));
  });

  test('task is removed from storage after click', () => {
    const expectedStorage = [
      {
        index: 4,
        description: 'Item-4',
        completed: false,
      },
    ];

    expect(storage).not.toEqual(expect.arrayContaining(expectedStorage));
  });
});