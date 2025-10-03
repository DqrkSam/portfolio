class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';
        this.sort = 'date';
        this.draggedItem = null;

        // Cache DOM elements
        this.todoList = document.querySelector('.todo-list');
        this.addInput = document.querySelector('.add-todo input');
        this.addBtn = document.querySelector('.add-btn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.querySelector('.clear-completed');
        this.sortBtns = document.querySelectorAll('.sort-btn');
        this.itemsLeft = document.querySelector('.items-left');
        this.taskTemplate = document.getElementById('task-template');

        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Add new todo
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.addInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter todos
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.render();
            });
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveTodos();
            this.render();
        });

        // Sort todos
        this.sortBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.sortBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.sort = btn.dataset.sort;
                this.render();
            });
        });
    }

    addTodo() {
        const text = this.addInput.value.trim();
        if (text) {
            const todo = {
                id: Date.now(),
                text,
                completed: false,
                priority: 'none',
                date: new Date().toISOString()
            };
            this.todos.unshift(todo);
            this.addInput.value = '';
            this.saveTodos();
            this.render();
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    editTodo(id) {
        const todoItem = this.todoList.querySelector(`[data-id="${id}"]`);
        const todoText = todoItem.querySelector('.todo-text');
        const currentText = todoText.value;
        
        todoText.readOnly = false;
        todoText.focus();
        
        const finishEdit = () => {
            todoText.readOnly = true;
            const newText = todoText.value.trim();
            if (newText && newText !== currentText) {
                const todo = this.todos.find(t => t.id === id);
                if (todo) {
                    todo.text = newText;
                    this.saveTodos();
                }
            } else {
                todoText.value = currentText;
            }
        };
        
        todoText.addEventListener('blur', finishEdit);
        todoText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                finishEdit();
                todoText.blur();
            }
        });
    }

    togglePriority(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const priorities = ['none', 'low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(todo.priority);
            todo.priority = priorities[(currentIndex + 1) % priorities.length];
            this.saveTodos();
            this.render();
        }
    }

    setupDragAndDrop(todoItem) {
        todoItem.addEventListener('dragstart', () => {
            this.draggedItem = todoItem;
            setTimeout(() => todoItem.classList.add('dragging'), 0);
        });

        todoItem.addEventListener('dragend', () => {
            todoItem.classList.remove('dragging');
            this.draggedItem = null;
        });

        todoItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.draggedItem === todoItem) return;
            
            const box = todoItem.getBoundingClientRect();
            const offset = e.clientY - box.top - box.height / 2;
            
            if (offset < 0) {
                todoItem.parentNode.insertBefore(this.draggedItem, todoItem);
            } else {
                todoItem.parentNode.insertBefore(this.draggedItem, todoItem.nextSibling);
            }
        });
    }

    createTodoElement(todo) {
        const template = this.taskTemplate.content.cloneNode(true);
        const todoItem = template.querySelector('.todo-item');
        
        todoItem.dataset.id = todo.id;
        todoItem.classList.toggle('completed', todo.completed);
        if (todo.priority !== 'none') {
            todoItem.classList.add(`priority-${todo.priority}`);
        }
        
        const checkbox = todoItem.querySelector('.todo-checkbox');
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
        
        const todoText = todoItem.querySelector('.todo-text');
        todoText.value = todo.text;
        
        const editBtn = todoItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => this.editTodo(todo.id));
        
        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
        
        const priorityBtn = todoItem.querySelector('.priority-btn');
        priorityBtn.addEventListener('click', () => this.togglePriority(todo.id));
        
        this.setupDragAndDrop(todoItem);
        
        return todoItem;
    }

    sortTodos(todos) {
        switch (this.sort) {
            case 'date':
                return todos.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'priority':
                const priority = { high: 3, medium: 2, low: 1, none: 0 };
                return todos.sort((a, b) => priority[b.priority] - priority[a.priority]);
            case 'alphabetical':
                return todos.sort((a, b) => a.text.localeCompare(b.text));
            default:
                return todos;
        }
    }

    filterTodos(todos) {
        switch (this.filter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }

    render() {
        // Clear list
        this.todoList.innerHTML = '';
        
        // Filter and sort todos
        const filteredTodos = this.filterTodos(this.todos);
        const sortedTodos = this.sortTodos(filteredTodos);
        
        // Create and append todo elements
        sortedTodos.forEach(todo => {
            this.todoList.appendChild(this.createTodoElement(todo));
        });
        
        // Update items left count
        const activeCount = this.todos.filter(todo => !todo.completed).length;
        this.itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

// Initialize app when window loads
window.addEventListener('load', () => {
    new TodoApp();
}); 