import './style.css';
import { setCompleted, isCompleted } from './completed.js';

const tasks = [
  {
    description: 'do task #1',
    completed: false,
    index: 0,
  },
  {
    description: 'do task #2',
    completed: false,
    index: 1,
  },
  {
    description: 'do task #3',
    completed: false,
    index: 2,
  },
  {
    description: 'do task #4',
    completed: false,
    index: 3,
  },
];

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

    if (isCompleted(task) === 'done') {
      item.children[1].classList.add('done');
    } else {
      item.children[1].classList.remove('done');
    }

  });
}

displayItems(tasks);
