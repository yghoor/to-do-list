/**
 * @jest-environment jsdom
 */

import { setCompleted } from '../src/completed.js';
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

    taskEditor.addEventListener('blur', () => {
      task.description = `${taskEditor.value}`;

      if (taskEditor.value === '') {
        removeTask(task, tasksArray);
      }

      saveToStorage(tasksArray);

      currentItemText.textContent = `${taskEditor.value}`;
    });
  });
}

function displayItems(tasksArray) {
  tasksArray.forEach((task) => {
    const item = document.createElement('li');
    item.id = `item-${task.index}`;

    item.innerHTML = `
      <input type="checkbox">
      <span>${task.description}</span>
      <button type="button" class="menu-btn">&#8942;</button>
      <button type="button" class="delete-btn hidden"><i class="gg-trash"></i></button>`;

    itemsList.appendChild(item);

    const itemCheckbox = item.children[0];

    if (isCompleted(task) === 'done') {
      itemCheckbox.checked = true;
    }

    itemCheckbox.addEventListener('change', () => {
      setCompleted(task);
      saveToStorage(tasksArray);
    });

    addInputEditor(task, tasksArray);
  });
}

displayItems(tasks);

describe('task description editor', () => {
  const item = document.getElementById('item-2');
  const itemText = item.children[1];

  test('editor input replaces text in span', () => {
    itemText.click();

    expect(itemText.innerHTML).toEqual('<input type="text">');

    itemText.children[0].blur();
  });

  test('should display task description in editable input', () => {
    itemText.click();

    expect(itemText.children[0].value).toEqual('Task 2');

    itemText.children[0].blur();
  });

  test('editor can edit task description', () => {
    itemText.click();

    itemText.children[0].value = 'New Task 2';
    itemText.children[0].blur();

    expect(itemText.innerHTML).toEqual('New Task 2');
  });

  test('edited description displays in tasks array', () => {
    const expectedTask = [
      {
        index: 2,
        description: 'New Task 2',
        completed: false,
      },
    ];

    expect(tasks).toEqual(expect.arrayContaining(expectedTask));
  });

  test('task with edited description is stored in storage array', () => {
    const expectedStorage = [
      {
        index: 2,
        description: 'New Task 2',
        completed: false,
      },
    ];

    expect(storage).toEqual(expect.arrayContaining(expectedStorage));
  });

  describe('if description is empty', () => {
    test('element is removed from page', () => {
      itemText.click();

      itemText.children[0].value = '';
      itemText.children[0].blur();

      expect(itemsList.childElementCount).toBe(2);
      expect(document.getElementById('item-2')).toBeNull();
    });

    test('element is removed from array', () => {
      const expectedTask = [
        {
          index: 2,
          description: 'New Task 2',
          completed: false,
        },
      ];

      expect(tasks).not.toEqual(expect.arrayContaining(expectedTask));
      expect(tasks.length).toBe(2);
    });

    test('element is removed from storage', () => {
      const expectedStorage = [
        {
          index: 2,
          description: 'New Task 2',
          completed: false,
        },
      ];

      expect(storage).not.toEqual(expect.arrayContaining(expectedStorage));
      expect(storage.length).toBe(2);
    });
  });
});