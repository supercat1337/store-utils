// @ts-check

import { binder } from "./binder.js";
import { globalOptions } from "./../globalOptions.js";

/**
 * Sets the element's property from the reactive variable's value
 * @template T
 * @param {import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>} reactive_item
 * @param {HTMLElement} element
 * @param {{property_name:string}} ctx
 */
function setter(reactive_item, element, ctx) {
    element[ctx.property_name] = reactive_item.value;
}

/**
 * Binds the value of a reactive variable to the element's property
 * @template T
 * @param {HTMLElement} element the HTML element
 * @param {import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>} reactive_item the reactive variable 
 * @param {Object} options the options
 * @param {string} property_name the property name
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToProperty(reactive_item, element, property_name, options = {}){
    let _options = Object.assign({}, globalOptions, options);

    // @ts-ignore
    return binder(reactive_item, element, setter, {property_name}, _options);
}
