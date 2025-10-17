import { TodoList } from "./components/TodoList.js";
import { fetchAPI } from "./functions/api.js";
import { createElement } from "./functions/dom.js";

try {
    const todos = await fetchAPI('https://jsonplaceholder.typicode.com/todos?_limit=5')
    const list = new TodoList(todos)
    list.appendTo(document.querySelector('#todolist'))
} catch (e) {
    const alertElement = createElement('div', {
        class: 'alert alert-danger',
        role: 'alert'
    })
    alertElement.innerText = 'Impossible de charger les éléments'
    document.body.prepend(alertElement)
}