export function saveTasksToLocalStorage(tasksArray) {
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

