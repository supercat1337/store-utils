// @ts-check

import { binder } from './binder.js';
import { globalOptions } from '../globalOptions.js';

/**
 * Setter for style binding. Supports string (cssText) or object.
 * @param {import("@supercat1337/store").Atom<string|Record<string,string>> | import("@supercat1337/store").Computed<string|Record<string,string>>} reactiveItem
 * @param {HTMLElement} element
 */
function setter(reactiveItem, element) {
    const value = reactiveItem.value;
    if (typeof value === 'string') {
        element.style.cssText = value;
    } else if (value && typeof value === 'object') {
        // Clear all existing inline styles
        element.style.cssText = '';
        // Apply new styles
        Object.assign(element.style, value);
    }
}

/**
 * Binds a reactive string or style object to the element's style.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<string|Record<string,string>> | import("@supercat1337/store").Computed<string|Record<string,string>>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToStyle(element, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    return binder(element, reactiveItem, setter, {}, _options);
}
