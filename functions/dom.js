/**
 * 
 * @param {string} tagName 
 * @param {Object} attributes 
 * @returns {HTMLElement}
 */
export function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName)
    for (const [attribute, value] of Object.entries(attributes)) {
        if (value !== null) {
            element.setAttribute(attribute, value)
        }
    }
    return element
}

/**
 * Créer un clone d'un template HTML
 * @param {string} templateId 
 * @returns {DocumentFragment}
 */
export function createCloneFromTemplate(templateId) {
    return document.getElementById(templateId).content.cloneNode(true)
}