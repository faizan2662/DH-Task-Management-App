document.getElementById('add-task-btn').addEventListener('click', async () => {
    const task = document.getElementById('task-input').value;
    const dueDate = document.getElementById('due-date-input').value;
    const priority = document.getElementById('priority-input').value;
    const type = document.getElementById('type-input').value;
    const progress = document.getElementById('progress-input').value;

    let isValid = true;

    // Clear previous error messages
    clearErrors();

    // Validate input fields
    if (!task) {
        showError('task-error', 'Please enter a task.');
        isValid = false;
    }

    if (!dueDate) {
        showError('due-date-error', 'Please select a due date.');
        isValid = false;
    }

    if (!priority) {
        showError('priority-error', 'Please select a priority.');
        isValid = false;
    }

    if (!type) {
        showError('type-error', 'Please select a task type.');
        isValid = false;
    }

    if (!progress) {
        showError('progress-error', 'Please select progress.');
        isValid = false;
    }

    if (isValid) {
        await addTask({ task, dueDate, priority, type, progress });
        clearInputs();
        fetchTasks();
    }
});

// Clear all error messages
function clearErrors() {
    document.getElementById('task-error').innerText = '';
    document.getElementById('due-date-error').innerText = '';
    document.getElementById('priority-error').innerText = '';
    document.getElementById('type-error').innerText = '';
    document.getElementById('progress-error').innerText = '';
}

// Show specific error message
function showError(elementId, message) {
    document.getElementById(elementId).innerText = message;
}

// Clear input fields
function clearInputs() {
    document.getElementById('task-input').value = '';
    document.getElementById('due-date-input').value = '';
    document.getElementById('priority-input').value = '';
    document.getElementById('type-input').value = '';
    document.getElementById('progress-input').value = '';
}

// Add task (POST request)
async function addTask(taskData) {
    await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });
}

// Fetch and display tasks
async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();

    const taskTableBody = document.querySelector('#task-table tbody');
    taskTableBody.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskRow = `
            <tr id="task-row-${index}">
                <td><span id="task-text-${index}">${task.task}</span><input id="task-edit-${index}" class="edit-input form-control" type="text" value="${task.task}" style="display:none"></td>
                <td><span id="due-date-text-${index}">${task.dueDate}</span><input id="due-date-edit-${index}" class="edit-input form-control" type="date" value="${task.dueDate}" style="display:none"></td>
                <td><span id="priority-text-${index}">${task.priority}</span><select id="priority-edit-${index}" class="edit-input form-control" style="display:none">
                    <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                    <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                    <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                </select></td>
                <td><span id="type-text-${index}">${task.type}</span><select id="type-edit-${index}" class="edit-input form-control" style="display:none">
                    <option value="Work" ${task.type === 'Work' ? 'selected' : ''}>Work</option>
                    <option value="Personal" ${task.type === 'Personal' ? 'selected' : ''}>Personal</option>
                    <option value="Other" ${task.type === 'Other' ? 'selected' : ''}>Other</option>
                </select></td>
                <td><span id="progress-text-${index}">${task.progress}%</span><select id="progress-edit-${index}" class="edit-input form-control" style="display:none">
                    <option value="0" ${task.progress === '0' ? 'selected' : ''}>0%</option>
                    <option value="10" ${task.progress === '10' ? 'selected' : ''}>10%</option>
                    <option value="20" ${task.progress === '20' ? 'selected' : ''}>20%</option>
                    <option value="30" ${task.progress === '30' ? 'selected' : ''}>30%</option>
                    <option value="40" ${task.progress === '40' ? 'selected' : ''}>40%</option>
                    <option value="50" ${task.progress === '50' ? 'selected' : ''}>50%</option>
                    <option value="60" ${task.progress === '60' ? 'selected' : ''}>60%</option>
                    <option value="70" ${task.progress === '70' ? 'selected' : ''}>70%</option>
                    <option value="80" ${task.progress === '80' ? 'selected' : ''}>80%</option>
                    <option value="90" ${task.progress === '90' ? 'selected' : ''}>90%</option>
                    <option value="100" ${task.progress === '100' ? 'selected' : ''}>100%</option>
                </select></td>
                <td>
                    <button class="btn btn-warning" id="edit-btn-${index}" onclick="enableEdit(${index})">Edit</button>
                    <button class="btn btn-success edit-input" id="save-btn-${index}" onclick="saveTask(${index})" style="display:none">Save</button>
                    <button class="btn btn-danger" onclick="deleteTask(${index})">Delete</button>
                </td>
            </tr>
        `;
        taskTableBody.insertAdjacentHTML('beforeend', taskRow);
    });
}

// Enable task edit
function enableEdit(index) {
    // Hide display text and show edit input fields
    document.querySelectorAll(`#task-row-${index} .edit-input`).forEach(input => input.style.display = 'inline');
    document.querySelectorAll(`#task-row-${index} span`).forEach(span => span.style.display = 'none');

    document.getElementById(`edit-btn-${index}`).style.display = 'none'; // Hide Edit button
    document.getElementById(`save-btn-${index}`).style.display = 'inline'; // Show Save button
}

// Save edited task
async function saveTask(index) {
    const updatedTask = {
        task: document.getElementById(`task-edit-${index}`).value,
        dueDate: document.getElementById(`due-date-edit-${index}`).value,
        priority: document.getElementById(`priority-edit-${index}`).value,
        type: document.getElementById(`type-edit-${index}`).value,
        progress: document.getElementById(`progress-edit-${index}`).value
    };

    await fetch(`/api/tasks/${index}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    });

    fetchTasks(); // Re-fetch and update the task list
}

// Delete task (DELETE request)
async function deleteTask(index) {
    await fetch(`/api/tasks/${index}`, {
        method: 'DELETE',
    });
    fetchTasks();
}

// Fetch tasks on page load
fetchTasks();