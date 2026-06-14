// @ts-check

import { bindToProperty } from './property.js';

/**
 * Binds a boolean reactive value to the element's disabled property.
 * @param {HTMLButtonElement|HTMLInputElement|HTMLFieldSetElement|HTMLLinkElement|HTMLOptGroupElement|HTMLOptionElement|HTMLSelectElement|HTMLTextAreaElement|HTMLStyleElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToDisabled(element, reactiveItem, options = {}) {
    return bindToProperty(/** @type {HTMLElement} */ (element), reactiveItem, 'disabled', options);
}
