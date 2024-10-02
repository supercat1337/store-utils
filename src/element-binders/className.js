// @ts-check

import { bindToProperty } from "./property.js";

/**
 * Binds the value of a reactive variable to the element's "className" property
 * @param {HTMLElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<string> | import("@supercat1337/store").Computed<string>} reactive_item the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToClassName(reactive_item, element, options = {}) {
    return bindToProperty(reactive_item, element, "className", options);
}
