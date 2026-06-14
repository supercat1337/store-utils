// @ts-check

import { binder } from './binder.js';
import { globalOptions } from './../globalOptions.js';

/**
 * Setter for attribute binding.
 * @param {import("@supercat1337/store").Atom<string|null> | import("@supercat1337/store").Computed<string|null>} reactiveItem
 * @param {HTMLElement} element
 * @param {{attributeName: string}} ctx
 */
function setter(reactiveItem, element, ctx) {
    if (typeof reactiveItem.value === 'string') {
        element.setAttribute(ctx.attributeName, reactiveItem.value);
    } else if (reactiveItem.value == null) {
        element.removeAttribute(ctx.attributeName);
    }
}

/**
 * Binds a reactive value to an element's attribute. If value is null, attribute is removed.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<string|null> | import("@supercat1337/store").Computed<string|null>} reactiveItem - The reactive item.
 * @param {string} attributeName - Name of the attribute.
 * @param {import("../types.d.ts").AttributeBindingOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToAttribute(element, reactiveItem, attributeName, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    return binder(element, reactiveItem, setter, { attributeName }, _options);
}
