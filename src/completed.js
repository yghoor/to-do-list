export function setCompleted(task) {
  if (task.completed === false) {
    task.completed = true;
  } else {
    task.completed = false;
  }
}

export function isCompleted(task) {
  if (task.completed === true) {
    return 'done';
  }

  return 'not-done';
}
