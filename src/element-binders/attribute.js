// @ts-check

import { binder } from "./binder.js";
import { globalOptions } from "./../globalOptions.js";

/**
 * Sets the attribute of the element
 * @param { import("@supercat1337/store").Atom<string|null> | import("@supercat1337/store").Computed<string|null>} reactive_item
 * @param {HTMLElement} element
 * @param {{attribute_name:string}} ctx
 */
function setter(reactive_item, element, ctx) {
    if (typeof reactive_item.value == "string") {
        element.setAttribute(ctx.attribute_name, reactive_item.value);
    } else if (reactive_item.value == null){
        element.removeAttribute(ctx.attribute_name);
    }
}


/**
 * Binds the value of a reactive variable to the element's attribute. If the value is null, the attribute will be removed.
 * @param {HTMLElement} element HTML element
 * @param { import("@supercat1337/store").Atom<string|null> | import("@supercat1337/store").Computed<string|null>} reactive_item reactive variable
 * @param {string} attribute_name a specific attribute
 * @param {Object} options options
 * @param {number} [options.debounce_time=0] debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToAttr(reactive_item, element, attribute_name, options = {}) {

    let _options = Object.assign({}, globalOptions, options)

    // @ts-ignore
    return binder(reactive_item, element, setter, {attribute_name}, _options);
}
