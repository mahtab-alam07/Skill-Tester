
let tasks = JSON.parse(
  localStorage.getItem("tasks")
) || [];

let currentFilter = "all";

// Save tasks in browser
function saveTasks() {
  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

// Add new task
document.getElementById("taskForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();

    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") return;

    tasks.push({
      id: Date.now(),
      title: text,
      completed: false
    });

    input.value = "";

    saveTasks();
    showTasks();
  });

// Display tasks
function showTasks() {

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks.filter(task => {
    if (currentFilter === "pending") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML =
      '<p class="empty">No tasks found. Add a new task!</p>';
  }

  filtered.forEach(task => {

    const div = document.createElement("div");
    div.className = "task";

    if (task.completed) {
      div.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      toggleTask(task.id);
    });

    const title = document.createElement("p");
    title.textContent = task.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete";

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    div.append(checkbox, title, deleteBtn);
    list.appendChild(div);
  });

  updateStats();
}

// Complete task
function toggleTask(id) {

  tasks = tasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();
  showTasks();
}

// Delete task
function deleteTask(id) {

  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  showTasks();
}

// Update dashboard counters
function updateStats() {

  document.getElementById("total").textContent =
    tasks.length;

  document.getElementById("pending").textContent =
    tasks.filter(task => !task.completed).length;

  document.getElementById("completed").textContent =
    tasks.filter(task => task.completed).length;
}

// Filter buttons
document.querySelectorAll(".filter").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelector(".filter.active")
      .classList.remove("active");

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    showTasks();
  });
});

// Start application
showTasks();
