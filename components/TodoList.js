import { createCloneFromTemplate } from "../functions/dom.js"


/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */
export class TodoList {

    /** @type {Todo[]} */
    #todos = []

    /** @type {HTMLUListElement} */
    #listElement = []

    /**
     * 
     * @param {Todo[]} todos 
     */
    constructor (todos) {
        this.#todos = todos
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    appendTo (element) {
        element.append(
            createCloneFromTemplate('todolist-layout')
        )
        this.#listElement = element.querySelector('.list-items')
        for (let todo of this.#todos) {
            const t = new TodoListItem(todo)
            this.#listElement.append(t.element)
        }

        element.querySelector('form').addEventListener('submit', (e) => this.#onSubmit(e))
        element.querySelectorAll('.btn-group button').forEach(button => {
            button.addEventListener('click', (e) => this.#toggleFilter(e))
        })

        this.#listElement.addEventListener('delete', ({detail: todo}) => {
            this.#todos = this.#todos.filter(t => t !== todo)
            console.log(this.#todos)
        })

        this.#listElement.addEventListener('toggle', ({detail: todo}) => {
            todo.completed = !todo.completed
            console.log(this.#todos)
        })
    }

    /**
     * @param {SubmitEvent} e 
     */
    #onSubmit(e) {
        e.preventDefault()
        const form = e.currentTarget
        const title = new FormData(form).get('title').toString().trim()
        if (title === '') {
            return
        }
        const todo = {
            id: Date.now(),
            title,
            completed: false
        }
        const item = new TodoListItem(todo)
        this.#listElement.prepend(item.element)
        form.reset()
    }

    /**
     * 
     * @param {PointerEvent} e 
     */
    #toggleFilter (e) {
        e.preventDefault()
        const filter = e.currentTarget.getAttribute('data-filter')
        e.currentTarget.parentElement.querySelector('.btn-primary').classList.remove('btn-primary')
        e.currentTarget.classList.add('btn-primary')
        if (filter == 'todo') {
            this.#listElement.classList.add('hide-completed')
            this.#listElement.classList.remove('hide-todo')
        } else if (filter == 'done') {
            this.#listElement.classList.add('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        } else {
            this.#listElement.classList.remove('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        }
    }
}


class TodoListItem {

    #element
    #todo

    /** @type {Todo} */
    constructor(todo) {
        this.#todo = todo
        const id = todo.id
        const itemDiv = createCloneFromTemplate('todolist-item').firstElementChild
        this.#element = itemDiv
        
        const checkbox = itemDiv.querySelector('input')
        checkbox.setAttribute('id', id)
        if (todo.completed) {
            checkbox.setAttribute('checked', '')
        }

        const label = itemDiv.querySelector('span')
        label.setAttribute('for', id)
        label.innerText = todo.title

        const button = itemDiv.querySelector('button')
        button.innerHTML = '<i class="bi bi-trash-fill"></i>'
        
        this.toggle(checkbox)

        button.addEventListener('click', (e) => this.remove(e))
        checkbox.addEventListener('change', (e) => this.toggle(e.currentTarget))
    }

    // /**
    //  * @param {HTMLElement} element 
    //  */
    // appendTo (element) {
    //     element.append(this.#element)
    // }

    /***
     * @returns {HTMLElement}
     */
    get element () {
        return this.#element
    }

    /**
     * @param {PointerEvent} e 
     */
    remove (e) {
        e.preventDefault()
        const event = new CustomEvent('delete', {
            detail: this.#todo,
            bubbles: true,
            cancelable: true
        })
        this.#element.dispatchEvent(event)
        if (event.defaultPrevented) {
            return
        }
        // Supprime que le côté visuelle et non les données dans le serveur !
        this.#element.remove()
    }

    /**
     * Change l'état (à faire / fait) de la tâche
     * @param {HTMLInputElement} checkbox 
     */
    toggle (checkbox) {
        if (checkbox.checked) {
            this.#element.classList.add('is-completed')
            this.#element.classList.add('items-close')
        } else {
            this.#element.classList.remove('is-completed')
            this.#element.classList.remove('items-close')
        }
        const event = new CustomEvent('toggle', {
            detail: this.#todo,
            bubbles: true
        })
        this.#element.dispatchEvent(event)
    }
}