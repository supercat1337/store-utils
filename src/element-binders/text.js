// @ts-check

import { globalOptions } from './../globalOptions.js';

/**
 * Setter for textContent binding.
 * @param {import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactiveItem
 * @param {HTMLElement|Text} element
 */
function setter(reactiveItem, element) {
    element.textContent = String(reactiveItem.value);
}

/**
 * Binds a reactive string/number value to the element's textContent.
 * @param {HTMLElement|Text} element - The DOM element or text node.
 * @param {import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToText(element, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    const { debounceTime, autoDisconnect } = _options;

    setter(reactiveItem, element);

    const unsubscribe = reactiveItem.subscribe(_details => {
        if (autoDisconnect && !element.isConnected) {
            unsubscribe();
            return;
        }
        setter(reactiveItem, element);
    }, debounceTime);

    return unsubscribe;
}
