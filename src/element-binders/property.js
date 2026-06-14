// @ts-check

import { binder } from './binder.js';
import { globalOptions } from './../globalOptions.js';

/**
 * Setter that assigns reactive value to element's property.
 * @template T
 * @param {import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>} reactiveItem
 * @param {HTMLElement} element
 * @param {{propertyName: string}} ctx
 */
function setter(reactiveItem, element, ctx) {
    // @ts-ignore
    element[ctx.propertyName] = reactiveItem.value;
}

/**
 * Binds a reactive value to an element's DOM property.
 * @template T
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>} reactiveItem - The reactive item.
 * @param {string} propertyName - Name of the property (e.g., 'innerHTML', 'className').
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToProperty(element, reactiveItem, propertyName, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    return binder(element, reactiveItem, setter, { propertyName }, _options);
}
