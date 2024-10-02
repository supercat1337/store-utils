// @ts-check

import { globalOptions } from "./../globalOptions.js";

/**
 * Sets the element's property from the reactive variable's value
 * @param {import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactive_item the reactive variable
 * @param {HTMLElement|Text} element the HTML element
 * @param {{property_name:string}} ctx the context object
 */
function setter(reactive_item, element, ctx) {
    element[ctx.property_name] = String(reactive_item.value);
}

/**
 * Binds the value of a reactive variable to the element's "textContent" property
 * @param {HTMLElement|Text} element the HTML element
 * @param { import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactive_item the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToText(reactive_item, element, options = {}) {

    let _options = Object.assign({}, globalOptions, options);
    let { debounce_time } = _options;
    let ctx = {property_name: "textContent"};

    setter(reactive_item, element, ctx);

    var unsubscribe = reactive_item.subscribe((details)=>{
        if (_options.autodisconnect && !element.isConnected) {
            unsubscribe();
            return;
        }

        setter(reactive_item, element, ctx); 
    }, debounce_time);

    return unsubscribe;
}
