// @ts-check

import { bindToCssClass } from "./css_class.js";
import { globalOptions } from "./../globalOptions.js";

/**
 * Binds the value of a reactive variable to the element's visibility
 * @param {HTMLElement} element the HTML element
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactive_item the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @param {string} [options.hide_class_name="d-none"] the class name to remove
 * @param {boolean} [options.remove_class_flag=true] whether to remove the class
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToShow(reactive_item, element, options = {}) {

    let _options = Object.assign({}, globalOptions, { remove_class_flag: true, hide_class_name: "d-none" }, options)
    let { hide_class_name } = _options;

    return bindToCssClass(reactive_item, element, hide_class_name, _options);
}
