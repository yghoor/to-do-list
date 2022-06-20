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

