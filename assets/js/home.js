$(function () {
    $("#sortable1, #sortable2, #sortable3").sortable({
        connectWith: ".connectedSortable",
        stop: function (event, ui) {
            const senderContainer = event.target;
            const senderContainerParent = senderContainer.parentElement;
            const senderContainerTasks = senderContainer.children;
            const p = document.createElement('p');
            p.innerText = 'No Task Available';
            p.classList.add('noTaskMessage');
            
            if(senderContainerTasks.length === 0) {
                senderContainerParent.insertBefore(p, senderContainer);
            }

            const receiverContainer = ui.item.parent()[0];
            const receiverContainerTasks = receiverContainer.children;
            const receiverContainerParent = receiverContainer.parentElement;
            const noTaskMessageRef = receiverContainerParent.getElementsByClassName('noTaskMessage')[0];

            if(receiverContainerTasks.length === 1) {
                noTaskMessageRef.remove();
            }

            const draggedElement = ui.item;
            const taskId = draggedElement.attr('data-task-id'); // Assuming a data attribute for task ID (optional)

            // Get the receiver container's data-id attribute
            const status = ui.item.parent().attr('data-status');

            console.log(taskId, status);

            // Send data (draggedElementId, receiverContainerId) to server using AJAX
            $.ajax({
                url: '/api/updateStatus',
                type: 'POST',
                data: JSON.stringify({ taskId: taskId, status: status }),
                contentType: 'application/json',
                success: function (response) {
                    // window.location.reload();
                    // console.log('Task status updated successfully:', response);
                },
                error: function (error) {
                    console.log('Error updating task status:', error);
                }
            });
        }
    }).disableSelection();
});

document.addEventListener('DOMContentLoaded', function () {

    let deleteTaskId;

    // View Task
    document.querySelectorAll('.view-task-btn').forEach(button => {
        button.addEventListener('click', function () {
            const taskTitle = this.getAttribute('data-task');
            const taskDescription = this.getAttribute('data-description');
            const taskCreatedAt = this.getAttribute('data-created-at');

            document.getElementById('viewTaskTitle').textContent = `Title: ${taskTitle}`;
            document.getElementById('viewTaskDescription').textContent = `Description: ${taskDescription}`;
            document.getElementById('viewTaskCreatedAt').textContent = `Created At: ${taskCreatedAt}`;

            $('#viewTaskModal').modal('show');
        });
    });

    // Edit Task
    document.querySelectorAll('.edit-task-btn').forEach(button => {
        button.addEventListener('click', function () {
            const taskId = this.getAttribute('data-task-id');
            const taskTitle = this.getAttribute('data-task');
            const taskDescription = this.getAttribute('data-description');

            document.getElementById('editTaskId').value = taskId;
            document.getElementById('editTaskTitle').value = taskTitle;
            document.getElementById('editTaskDescription').value = taskDescription;

            $('#editTaskModal').modal('show');
        });
    });

    // Save Edited Task
    document.getElementById('saveEditTaskBtn').addEventListener('click', function () {
        const taskId = document.getElementById('editTaskId').value;
        const taskTitle = document.getElementById('editTaskTitle').value;
        const taskDescription = document.getElementById('editTaskDescription').value;

        axios.put(`/api/editTask/${taskId}`, {
            task: taskTitle,
            description: taskDescription
        })
            .then(response => {
                window.location.href = '/'; // Redirect to home page
            })
            .catch(error => {
                console.error('There was an error updating the task:', error);
                console.log('axios catch');
            });
        console.log('c');
    });

    // Show Delete Task Modal with SweetAlert2
    document.querySelectorAll('.delete-task-btn').forEach(button => {
        button.addEventListener('click', function () {
            deleteTaskId = this.getAttribute('data-task-id');
            const taskTitle = this.getAttribute('data-task');

            Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to delete the task "${taskTitle}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Delete'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`/api/deleteTask/${deleteTaskId}`)
                        .then(response => {
                            Swal.fire(
                                'Deleted!',
                                'Your task has been deleted.',
                                'success'
                            ).then(() => {
                                window.location.href = '/'; // Redirect to home page
                            });
                        })
                        .catch(error => {
                            console.error('There was an error deleting the task:', error);
                            Swal.fire(
                                'Error!',
                                'There was an error deleting the task.',
                                'error'
                            );
                        });
                }
            });
        });
    });

    // Search functionality
    document.getElementById('searchQuery').addEventListener('input', function () {
        const query = this.value;
        console.log(query);
        axios.get(`/api/search?query=${query}`)
            .then(response => {
                updateTaskLists(response.data);
            })
            .catch(error => {
                console.error('There was an error performing the search:', error);
            });
    });

    // Sort functionality
    document.getElementById('sortBy').addEventListener('change', function () {
        const sortBy = this.value;

        axios.get(`/api/sort?sortBy=${sortBy}`)
            .then(response => {
                updateTaskLists(response.data);
            })
            .catch(error => {
                console.error('There was an error performing the sort:', error);
            });
    });

    function updateTaskLists(tasks) {
        const statusContainers = {
            todo: document.querySelector('#sortable1'),
            inProgress: document.querySelector('#sortable2'),
            done: document.querySelector('#sortable3')
        };

        // Clear existing tasks
        Object.values(statusContainers).forEach(container => container.innerHTML = '');

        // Append new tasks
        tasks.forEach(task => {
            const taskElement = `
                <div class="task p-3 mb-2 rounded" data-task-id="${task._id}">
                    <h5>${task.task}</h5>
                    <p>${task.description}</p>
                    <small>Created at: ${new Date(task.createdAt).toLocaleString()}</small>
                    <div class="mt-2">
                        <button class="btn btn-danger btn-sm delete-task-btn" data-task-id="${task._id}">Delete</button>
                        <button class="btn btn-info btn-sm edit-task-btn" data-task-id="${task._id}" data-task="${task.task}" data-description="${task.description}">Edit</button>
                        <button class="btn btn-secondary btn-sm view-task-btn" data-task-id="${task._id}" data-task="${task.task}" data-description="${task.description}" data-created-at="${new Date(task.createdAt).toLocaleString()}">View Details</button>
                    </div>
                </div>
            `;
            statusContainers[task.status].insertAdjacentHTML('beforeend', taskElement);
        });

        // Reinitialize event listeners for the newly added elements
        initializeEventListeners();
    }

    function initializeEventListeners() {
        document.querySelectorAll('.view-task-btn').forEach(button => {
            button.addEventListener('click', function () {
                const taskTitle = this.getAttribute('data-task');
                const taskDescription = this.getAttribute('data-description');
                const taskCreatedAt = this.getAttribute('data-created-at');

                document.getElementById('viewTaskTitle').textContent = `Title: ${taskTitle}`;
                document.getElementById('viewTaskDescription').textContent = `Description: ${taskDescription}`;
                document.getElementById('viewTaskCreatedAt').textContent = `Created At: ${taskCreatedAt}`;

                $('#viewTaskModal').modal('show');
            });
        });

        document.querySelectorAll('.edit-task-btn').forEach(button => {
            button.addEventListener('click', function () {
                const taskId = this.getAttribute('data-task-id');
                const taskTitle = this.getAttribute('data-task');
                const taskDescription = this.getAttribute('data-description');

                document.getElementById('editTaskId').value = taskId;
                document.getElementById('editTaskTitle').value = taskTitle;
                document.getElementById('editTaskDescription').value = taskDescription;

                $('#editTaskModal').modal('show');
            });
        });

        document.querySelectorAll('.delete-task-btn').forEach(button => {
            button.addEventListener('click', function () {
                deleteTaskId = this.getAttribute('data-task-id');
                const taskTitle = this.getAttribute('data-task');

                Swal.fire({
                    title: 'Are you sure?',
                    text: `Do you want to delete the task "${taskTitle}"?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Delete'
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.delete(`/api/deleteTask/${deleteTaskId}`)
                            .then(response => {
                                Swal.fire(
                                    'Deleted!',
                                    'Your task has been deleted.',
                                    'success'
                                ).then(() => {
                                    window.location.href = '/'; // Redirect to home page
                                });
                            })
                            .catch(error => {
                                console.error('There was an error deleting the task:', error);
                                Swal.fire(
                                    'Error!',
                                    'There was an error deleting the task.',
                                    'error'
                                );
                            });
                    }
                });
            });
        });
    }
});
