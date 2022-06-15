export function addTask(tasksArray, currentItemInput) {
  tasksArray.push({
    description: currentItemInput,
    completed: false,
    index: tasksArray.length + 1,
  });
}

export function addInputEditor(task, tasksArray) {
  const currentItem = document.getElementById(`item-${task.index}`);
  const currentItemText = currentItem.children[1];
  const menuButton = currentItem.children[2];
  const deleteButton = currentItem.children[3];

  currentItemText.addEventListener('click', () => {
    const taskEditor = document.createElement('input');
    taskEditor.type = 'text';
    taskEditor.className = 'edit-task';
    taskEditor.value = task.description;

    if (currentItemText.innerHTML === task.description) {
      currentItemText.innerHTML = '';
      currentItemText.appendChild(taskEditor);

      menuButton.classList.add('hidden');
      deleteButton.classList.remove('hidden');
      deleteButton.classList.add('shown');

      currentItem.classList.add('bg-yellow');
    }

    taskEditor.focus();

    taskEditor.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        task.description = `${taskEditor.value}`;

        if (taskEditor.value === '') {
          removeTask(task, tasksArray);
        }

        saveTasksToLocalStorage(tasksArray);

        menuButton.classList.remove('hidden');
        deleteButton.classList.add('hidden');
        deleteButton.classList.remove('shown');
        currentItem.classList.remove('bg-yellow');

        currentItemText.textContent = `${taskEditor.value}`;
      }
    });

    taskEditor.addEventListener('blur', () => {
      task.description = `${taskEditor.value}`;

      if (taskEditor.value === '') {
        removeTask(task, tasksArray);
      }

      saveTasksToLocalStorage(tasksArray);

      menuButton.classList.remove('hidden');
      deleteButton.classList.add('hidden');
      deleteButton.classList.remove('shown');
      currentItem.classList.remove('bg-yellow');

      currentItemText.textContent = `${taskEditor.value}`;
    });
  });
}
