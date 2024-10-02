// @ts-check

import { binder } from "./binder.js";
import { globalOptions } from "./../globalOptions.js";

/**
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactive_item 
 * @param {HTMLElement} element 
 * @param {{cssClassName:string}} ctx 
 * @param {Object} options 
 * @param {number} options.debounce_time
 * @param {boolean} options.remove_class_flag 
 */
function setter(reactive_item, element, ctx, options) {
    let { remove_class_flag } = options;

    var show_class_value = Boolean(reactive_item.value);
    console.warn(element.className, "show", show_class_value, "remove_class_flag", remove_class_flag, ctx.cssClassName);

    if (remove_class_flag == false) {
        element.classList.toggle(ctx.cssClassName, show_class_value);
    } else {
        //console.log(ctx.cssClassName, !show_class_value)
        element.classList.toggle(ctx.cssClassName, !show_class_value);
    }
}

/**
 * Binds the value of a reactive variable to the element's css-className" property
 * @param {HTMLElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactive_item the reactive variable
 * @param {string} cssClassName the css-className
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @param {boolean} [options.remove_class_flag=false] remove the css-className
 * 
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToCssClass(reactive_item, element, cssClassName, options = {}) {

    let _options = Object.assign({}, globalOptions, { remove_class_flag: false }, options)

    let ctx = { cssClassName };

    // @ts-ignore
    return binder(reactive_item, element, setter, ctx, _options);
}