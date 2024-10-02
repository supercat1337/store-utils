// @ts-check

import { bindToProperty } from "./property.js";

/**
 * Binds the value of a reactive variable to the element's "disabled" property
 * @param {HTMLButtonElement|HTMLInputElement|HTMLFieldSetElement
 * |HTMLLinkElement|HTMLOptGroupElement|HTMLOptionElement
 * |HTMLSelectElement|HTMLStyleElement|HTMLTextAreaElement
 * |SVGStyleElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactive_item the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToDisabled(reactive_item, element, options = {}){
    return bindToProperty(reactive_item, /** @type {HTMLElement} */ (element), "disabled", options);
}
