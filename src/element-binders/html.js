// @ts-check

import { bindToProperty } from './property.js';

/**
 * Binds a reactive string/number value to the element's innerHTML.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToHtml(element, reactiveItem, options = {}) {
    return bindToProperty(element, reactiveItem, 'innerHTML', options);
}
