// Load tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

let input = document.getElementById("taskInput");

// Enter key support
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Initial load
displayTasks();

function addTask() {

    let task = input.value.trim();

    if (task === "") {
        alert("Enter a task");
        return;
    }

    tasks.push({
        text: task,
        completed: false
    });

    saveTasks();
    input.value = "";
    displayTasks();
}

function displayTasks() {

    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        if (filter === "completed" && !task.completed) return;
        if (filter === "pending" && task.completed) return;

        let li = document.createElement("li");

        // ✅ FIX #5: Build task text span using textContent to prevent XSS
        let span = document.createElement("span");
        span.className = task.completed ? "completed" : "";
        span.textContent = task.text;

        // Build checkbox
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleComplete(index);

        // Build task-left div
        let taskLeft = document.createElement("div");
        taskLeft.className = "task-left";
        taskLeft.appendChild(checkbox);
        taskLeft.appendChild(span);

        // Build edit button
        let editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editTask(index);

        // Build delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(index);

        // Build task-buttons div
        let taskButtons = document.createElement("div");
        taskButtons.className = "task-buttons";
        taskButtons.appendChild(editBtn);
        taskButtons.appendChild(deleteBtn);

        li.appendChild(taskLeft);
        li.appendChild(taskButtons);

        taskList.appendChild(li);
    });

    updateTaskCount();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

function editTask(index) {

    let newTask = prompt("Edit your task", tasks[index].text);

    if (newTask === null || newTask.trim() === "") return;

    tasks[index].text = newTask.trim();

    saveTasks();
    displayTasks();
}

function clearAllTasks() {

    if (confirm("Are you sure you want to clear all tasks?")) {

        // ✅ FIX #2: Only clear tasks visible under the current filter
        if (filter === "all") {
            tasks = [];
        } else if (filter === "completed") {
            tasks = tasks.filter(task => !task.completed);
        } else if (filter === "pending") {
            tasks = tasks.filter(task => task.completed);
        }

        saveTasks();
        displayTasks();
    }
}

function updateTaskCount() {

    // ✅ FIX #3: Show count based on active filter, not always total
    let count;
    let label;

    if (filter === "completed") {
        count = tasks.filter(t => t.completed).length;
        label = "Completed Tasks";
    } else if (filter === "pending") {
        count = tasks.filter(t => !t.completed).length;
        label = "Pending Tasks";
    } else {
        count = tasks.length;
        label = "Total Tasks";
    }

    document.getElementById("taskCount").innerText = `${label}: ${count}`;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasks(type) {
    filter = type;
    displayTasks();
}