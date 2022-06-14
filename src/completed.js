export function setCompleted(task) {
  if (task.completed === false) {
    task.completed = true;
  } else {
    task.completed = false;
  }
}
