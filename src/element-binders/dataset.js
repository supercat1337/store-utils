// @ts-check

import { binder } from './binder.js';
import { globalOptions } from '../globalOptions.js';

/**
 * Setter for dataset binding. Expects an object; each key becomes a data-* attribute.
 * @param {import("@supercat1337/store").Atom<Record<string,string>> | import("@supercat1337/store").Computed<Record<string,string>>} reactiveItem
 * @param {HTMLElement} element
 */
function setter(reactiveItem, element) {
    const data = reactiveItem.value;
    if (data && typeof data === 'object') {
        // Remove old data-* attributes not present in new object
        for (const attr of element.getAttributeNames()) {
            if (attr.startsWith('data-')) {
                const key = attr.slice(5);
                if (!(key in data)) {
                    element.removeAttribute(attr);
                }
            }
        }
        // Set new ones
        for (const [key, value] of Object.entries(data)) {
            element.dataset[key] = value;
        }
    } else if (data == null) {
        // Remove all data-* attributes
        for (const attr of element.getAttributeNames()) {
            if (attr.startsWith('data-')) {
                element.removeAttribute(attr);
            }
        }
    }
}

/**
 * Binds a reactive object to the element's dataset (data-* attributes).
 * The reactive item must provide an object where keys map to data-* attribute names.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<Record<string,string>> | import("@supercat1337/store").Computed<Record<string,string>>} reactiveItem - The reactive item (object).
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToDataset(element, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    return binder(element, reactiveItem, setter, {}, _options);
}
