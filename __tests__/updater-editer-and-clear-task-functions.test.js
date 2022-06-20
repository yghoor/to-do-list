/**
 * @jest-environment jsdom
 */

import { setCompleted } from '../src/completed.js';

document.body.innerHTML = `
  <div class="add-item">
    <button type="button" class="enter-button">&#8629;</button>
  </div>
  <ul id="list-items"></ul>`;

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
  {
    description: 'Task 4',
    completed: false,
    index: 4,
  },
  {
    description: 'Task 5',
    completed: false,
    index: 5,
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

    itemCheckbox.addEventListener('change', () => {
      setCompleted(task);
      saveToStorage(tasksArray);
    });

    addInputEditor(task, tasksArray);
  });
}

function refreshItemsList() {
  tasks = storage;
  itemsList.innerHTML = '';
  displayItems(tasks);
}

function clearCompletedTasks(tasksArray) {
  tasksArray = tasksArray.filter((task) => task.completed === false);
  renumberTaskIndexes(tasksArray);
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
      itemText.children[0].blur(); // Removes task 'Task 2' from tasks array

      expect(itemsList.childElementCount).toBe(4);
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
      expect(tasks.length).toBe(4);
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
      expect(storage.length).toBe(4);
    });

    describe('task renumber function', () => {
      test('task indexes are renumbered', () => {
        refreshItemsList();
        expect(document.getElementById('item-1').children[1].innerHTML).toEqual('Task 1');
        expect(document.getElementById('item-2').children[1].innerHTML).toEqual('Task 3');
        expect(document.getElementById('item-3').children[1].innerHTML).toEqual('Task 4');
        expect(document.getElementById('item-4').children[1].innerHTML).toEqual('Task 5');
      });
    });
  });
});

describe('task.completed updater', () => {
  test('task.completed is set to true in tasks array', () => {
    const item = document.getElementById('item-1');
    const itemCheckbox = item.children[0];
    itemCheckbox.click();

    expect(tasks[0].completed).toBe(true);
  });

  test('task.completed is set to true in storage', () => {
    expect(storage[0].completed).toEqual(true);
  });

  test('task.completed is set to false in tasks array', () => {
    const item = document.getElementById('item-1');
    const itemCheckbox = item.children[0];
    itemCheckbox.click();

    expect(tasks[0].completed).toEqual(false);
  });

  test('task.completed is set to false in storage', () => {
    expect(storage[0].completed).toEqual(false);
  });
});

describe('clear all completed function', () => {
  test('all completed tasks are removed from page', () => {
    const item3 = document.getElementById('item-3');
    const itemCheckbox3 = item3.children[0];
    itemCheckbox3.click();
    const item4 = document.getElementById('item-4');
    const itemCheckbox4 = item4.children[0];
    itemCheckbox4.click();

    clearCompletedTasks(tasks); // Removes tasks 'Task 4' and 'Task 5' from tasks array
    refreshItemsList();

    expect(itemsList.childElementCount).toBe(2);
    expect(document.getElementById('item-3')).toBeNull();
    expect(document.getElementById('item-4')).toBeNull();
  });

  test('all completed tasks are removed from tasks array', () => {
    const expectedRemovedTasks = [
      {
        description: 'Task 4',
        completed: false,
        index: 4,
      },
      {
        description: 'Task 5',
        completed: false,
        index: 5,
      },
    ];

    expect(tasks).not.toEqual(expect.arrayContaining(expectedRemovedTasks));
    expect(tasks.length).toBe(2);
  });

  test('all completed tasks are removed from storage', () => {
    const expectedRemovedStorage = [
      {
        description: 'Task 4',
        completed: false,
        index: 4,
      },
      {
        description: 'Task 5',
        completed: false,
        index: 5,
      },
    ];

    expect(storage).not.toEqual(expect.arrayContaining(expectedRemovedStorage));
    expect(storage.length).toBe(2);
  });
});