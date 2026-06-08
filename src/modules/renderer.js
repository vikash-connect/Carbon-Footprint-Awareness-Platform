/**
 * Creates a DOM element safely
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes/properties
 * @param {Array<HTMLElement|string>} children - Child nodes or text
 * @returns {HTMLElement} The created element
 */
export function createElement(tag, attributes = {}, children = []) {
    const el = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'className') {
            el.className = value;
        } else if (key === 'dataset') {
            for (const [dataKey, dataVal] of Object.entries(value)) {
                el.dataset[dataKey] = dataVal;
            }
        } else if (key === 'textContent') {
            el.textContent = value;
        } else if (key.startsWith('on') && typeof value === 'function') {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            el.setAttribute(key, value);
        }
    }

    for (const child of children) {
        if (typeof child === 'string' || typeof child === 'number') {
            el.appendChild(document.createTextNode(String(child)));
        } else if (child instanceof Node) {
            el.appendChild(child);
        }
    }

    return el;
}

/**
 * Clears an element's children safely
 * @param {HTMLElement} element - Target element
 */
export function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
