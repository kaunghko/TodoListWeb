const todoInput = document.getElementById('todoInput');
            const addBtn = document.getElementById('addBtn');
            const todoList = document.getElementById('todoList');
            const categorySelect = document.getElementById('categorySelect');

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

                if (tasks.length === 0) {
                    todoList.innerHTML = '<div class="empty-message">No tasks yet!</div>';
                    return;
                }

                // Group tasks by category
                const academicTasks = tasks.filter(task => task.category === 'Academic');
                const personalTasks = tasks.filter(task => task.category === 'Personal');

                // Display Academic tasks
                if (academicTasks.length > 0) {
                    const academicSection = createCategorySection('Academic', academicTasks);
                    todoList.appendChild(academicSection);
                }

                // Display Personal tasks
                if (personalTasks.length > 0) {
                    const personalSection = createCategorySection('Personal', personalTasks);
                    todoList.appendChild(personalSection);
                }
            }

            function createCategorySection(categoryName, categoryTasks) {
                const section = document.createElement('div');
                section.className = 'category-section';

                const header = document.createElement('h3');
                header.className = 'category-header';
                header.textContent = categoryName;
                section.appendChild(header);

                categoryTasks.forEach(function(task, index) {
                    const globalIndex = tasks.indexOf(task);
                    createTaskElement(task, globalIndex, section);
                });

                return section;
            }

            function addTask() {
                const taskText = todoInput.value;
                const category = categorySelect.value;

                if (taskText.trim() === '') {
                    alert('Please enter a task!');
                    return;
                }

                const newTask = {
                    text: taskText,
                    completed: false,
                    category: category
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

            function createTaskElement(task, index, parentElement) {
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

                // add task to parent element (either todoList or category section)
                if (parentElement) {
                    parentElement.appendChild(taskItem);
                } else {
                    todoList.appendChild(taskItem);
                }
            }