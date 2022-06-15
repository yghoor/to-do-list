export function addTask(tasksArray, currentItemInput) {
  tasksArray.push({
    description: currentItemInput,
    completed: false,
    index: tasksArray.length + 1,
  });
}

