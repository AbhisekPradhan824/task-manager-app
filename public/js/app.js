$(document).ready(function() {
    // ✅ Dynamic API URL based on environment
    const API_URL = window.location.origin + '/api/tasks';
    
    console.log('🚀 App initialized');
    console.log('📡 API URL:', API_URL);

    // Test API connection
    testConnection();

    // Load tasks on page load
    loadTasks();

    // Add task form submission
    $('#taskForm').on('submit', function(e) {
        e.preventDefault();
        addTask();
    });

    // Test API connection
    function testConnection() {
        $.ajax({
            url: window.location.origin + '/api/health',
            method: 'GET',
            success: function(response) {
                console.log('✅ API Connection:', response);
            },
            error: function(err) {
                console.error('❌ API Connection failed:', err);
            }
        });
    }

    // ... rest of your code remains the same ...
    
    // Function to load all tasks
    function loadTasks() {
        console.log('📥 Loading tasks...');
        
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function(tasks) {
                console.log('✅ Tasks loaded:', tasks);
                displayTasks(tasks);
            },
            error: function(xhr, status, error) {
                console.error('❌ Error loading tasks:', {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    error: error
                });
                showError('Failed to load tasks. Please try again.');
            }
        });
    }

    function displayTasks(tasks) {
        const taskList = $('#taskList');
        taskList.empty();

        if (tasks.length === 0) {
            taskList.html(`
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h5>No tasks yet!</h5>
                    <p>Add your first task to get started.</p>
                </div>
            `);
            return;
        }

        tasks.forEach(task => {
            const taskHtml = `
                <div class="task-item ${task.status === 'completed' ? 'completed' : ''}" data-id="${task._id}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="task-title mb-1">${escapeHtml(task.title)}</h6>
                            <p class="task-description text-muted mb-2">${escapeHtml(task.description) || 'No description'}</p>
                            <span class="priority-badge priority-${task.priority}">
                                ${task.priority.toUpperCase()}
                            </span>
                            <span class="badge bg-${task.status === 'completed' ? 'success' : 'warning'} ms-2">
                                ${task.status}
                            </span>
                        </div>
                        <div class="task-actions">
                            <button class="btn btn-sm btn-success toggle-status" data-id="${task._id}" data-status="${task.status}">
                                <i class="fas fa-${task.status === 'completed' ? 'undo' : 'check'}"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-task" data-id="${task._id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            taskList.append(taskHtml);
        });
    }

    function addTask() {
        const title = $('#taskTitle').val().trim();
        const description = $('#taskDescription').val().trim();
        const priority = $('#taskPriority').val();

        if (!title) {
            showError('Please enter a task title');
            return;
        }

        const taskData = {
            title: title,
            description: description,
            priority: priority
        };

        console.log('📤 Sending task data:', taskData);

        $.ajax({
            url: API_URL,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: function(response) {
                console.log('✅ Task added:', response);
                showSuccess('Task added successfully!');
                $('#taskForm')[0].reset();
                loadTasks();
            },
            error: function(xhr, status, error) {
                console.error('❌ Error adding task:', xhr.responseText);
                showError('Failed to add task. Please try again.');
            }
        });
    }

    $(document).on('click', '.toggle-status', function() {
        const taskId = $(this).data('id');
        const currentStatus = $(this).data('status');
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

        $.ajax({
            url: `${API_URL}/${taskId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ status: newStatus }),
            success: function(response) {
                showSuccess('Task status updated!');
                loadTasks();
            },
            error: function(xhr, status, error) {
                showError('Failed to update task');
            }
        });
    });

    $(document).on('click', '.delete-task', function() {
        if (!confirm('Are you sure you want to delete this task?')) return;

        const taskId = $(this).data('id');

        $.ajax({
            url: `${API_URL}/${taskId}`,
            method: 'DELETE',
            success: function(response) {
                showSuccess('Task deleted successfully!');
                loadTasks();
            },
            error: function(xhr, status, error) {
                showError('Failed to delete task');
            }
        });
    });

    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    function showSuccess(message) {
        alert('✅ ' + message);
    }

    function showError(message) {
        alert('❌ ' + message);
    }
});