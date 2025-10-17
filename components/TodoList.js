import { createElement } from "../functions/dom.js"


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
        element.innerHTML = `<form action="" class="d-flex pb-4">
            <input type="hidden" id="todoId">
            <input type="text" placeholder="Acheter des patates..." class="form-control" name="title" required>
            <button class="btn btn-primary" id="btnAdd" type="submit"><i class="bi bi-plus-circle"></i> Ajouter</button>
            <button class="btn btn-warning" id="btnUpdate" type="submit"><i class="bi bi-arrow-repeat"></i> Mettre à jour</button>
        </form>
        <main>
            <div>                
                <div class="btn-group mb-4">
                    <button class="btn btn-primary" data-filter="all"><i class="bi bi-list-ul"></i> Toutes</button>
                    <button class="btn" data-filter="todo"><i class="bi bi-hourglass-split"></i> A faire</button>
                    <button class="btn" data-filter="done"><i class="bi bi-check2-circle"></i> Faites</button>
                </div>
                <button class="btn btn-danger mb-4" id="resetPage"><i class="bi bi-arrow-repeat"></i> Rafraichir la page</button>
            </div>
            <div class="list-items">
                
            </div>
        </main>`
        this.#listElement = element.querySelector('.list-items')
        for (let todo of this.#todos) {
            const t = new TodoListItem(todo)
            // t.appendTo(this.#listElement)
            this.#listElement.append(t.element)
        }

        element.querySelector('form').addEventListener('submit', (e) => this.#onSubmit(e))
        element.querySelectorAll('.btn-group button').forEach(button => {
            button.addEventListener('click', (e) => this.#toggleFilter(e))
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
        // item.appendTo(this.#listElement)
        this.#listElement.prepend(item.element)
        form.reset()
        console.log(todo)
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

    /** @type {Todo} */
    constructor(todo) {
        const id = todo.id
        const itemDiv = createElement('div', {class: 'items'})
        this.#element = itemDiv
        const itemLeft = createElement('div', {class: 'item-right'})
        const checkbox = createElement('input', {
            class: 'form-control', 
            type: 'checkbox', 
            id,
            checked: todo.completed ? '' : null
        })
        const label = createElement('span', {
            class: todo.completed ? 'items-close' : null
        })
        label.innerText = todo.title
        const button = createElement('button', {class: 'btn btn-danger action'})
        button.innerHTML = '<i class="bi bi-trash-fill"></i>'

        itemLeft.append(checkbox)
        itemLeft.append(label)
        itemDiv.append(itemLeft)
        itemDiv.append(button)
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
        } else {
            this.#element.classList.remove('is-completed')
        }
    }
}