// @ts-check

import { bindToProperty } from "./property.js";


/**
 * Binds the value of a reactive variable to the element's "innerHTML" property
 * @param {HTMLElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToHtml(reactive_item, element, options = {}) {
    return bindToProperty(reactive_item, element, "innerHTML", options);
}

