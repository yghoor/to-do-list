export function saveTasksToLocalStorage(tasksArray) {
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

export function inspectLocalStorage() {
  if (localStorage.getItem('tasks')) {
    return true;
  }
  return false;
}