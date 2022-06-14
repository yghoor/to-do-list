import './style.css';
import { setCompleted, isCompleted } from './completed.js';

const tasks = [];

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

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
      item.children[0].checked = true;
    } else {
      item.children[1].classList.remove('done');
    }

    item.children[0].addEventListener('change', () => {
      setCompleted(task);
      saveTasksToLocalStorage();

      if (isCompleted(task) === 'done') {
        item.children[1].classList.add('done');
      } else {
        item.children[1].classList.remove('done');
      }
    });
  });
}

saveTasksToLocalStorage();
displayItems(tasks);
