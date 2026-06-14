// @ts-check

import { bindToProperty } from './property.js';

/**
 * Binds a reactive string value to the element's className property.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<string> | import("@supercat1337/store").Computed<string>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToClassString(element, reactiveItem, options = {}) {
    return bindToProperty(element, reactiveItem, 'className', options);
}
