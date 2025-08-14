const todoInput = document.getElementById('todoInput');
            const addBtn = document.getElementById('addBtn');
            const todoList = document.getElementById('todoList');

            let tasks = [];

            loadTasks();

            addBtn.addEventListener('click', addTask);

            todoInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    addTask();
                }
            });

            function loadTasks() {
                const savedTasks = localStorage.getItem('todoTasks');
                if (savedTasks) {
                    tasks = JSON.parse(savedTasks);
                    displayAllTasks();
                }
            }

            function saveTasks() {
                localStorage.setItem('todoTasks', JSON.stringify(tasks));
            }

            function displayAllTasks() {
                todoList.innerHTML = '';

                tasks.forEach(function(task, index) {
                    createTaskElement(task, index);
                })
            }

            function addTask() {
                const taskText = todoInput.value;

                if (taskText.trim() === '') {
                    alert('Please enter a task!');
                    return;
                }

                const newTask = {
                    text: taskText,
                    completed: false
                };
                
                // add to tasks array
                tasks.push(newTask);

                // save to local storage
                saveTasks();

                // update the display
                displayAllTasks();
            
                // clear input box
                todoInput.value = '';
            }

            function createTaskElement(task, index) {
                // division for task
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';

                // create left wrapper for checkbox and task text
                const taskLeft = document.createElement('div');
                taskLeft.className = 'task-left';

                // checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'task-checkbox';
                checkbox.checked = task.completed;

                // task text
                const taskTextElement = document.createElement('span');
                taskTextElement.textContent = task.text;
                if (task.completed)
                    taskTextElement.classList.add('completed');

                // delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-btn';

                checkbox.addEventListener('change', function(){
                    task.completed = checkbox.checked;
                    if(checkbox.checked)
                        taskTextElement.classList.add('completed');
                    else    
                        taskTextElement.classList.remove('completed');
                    saveTasks();
                })

                deleteBtn.addEventListener('click', function() {
                    tasks.splice(index, 1);
                    saveTasks();
                    displayAllTasks();
                });

                // add checkbox and task text to left wrapper
                taskLeft.appendChild(checkbox);
                taskLeft.appendChild(taskTextElement);

                // add left wrapper and delete button to task item
                taskItem.appendChild(taskLeft);
                taskItem.appendChild(deleteBtn);

                // add task to list
                todoList.appendChild(taskItem);
            }