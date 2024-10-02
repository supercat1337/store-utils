// @ts-check

import { debounce } from "@supercat1337/store";
import { globalOptions } from "./../../globalOptions.js";

/** @typedef {(value:any)=>string} TypeInputValueConverter */


/**
 * Synchronizes the value of a reactive variable to the input's "value" property and vice versa
 * @param {HTMLInputElement|HTMLTextAreaElement} element the input element
 * @param { import("@supercat1337/store").Atom<string|number> } reactive_item the reactive variable
 * @param {Object} options the options 
 * @param {number} [options.debounce_time=0] the debounce time
 * @param {boolean} [options.lazy=false] if true, the value will be set only when the input is changed 
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToInputValue(reactive_item, element, options = {}) {

    let _options = (Object.assign({}, globalOptions, { lazy: false }, options));

    let { debounce_time, lazy } = _options;

    if (element.type == "number") {
        lazy = true;
    }

    /**
     * Sets the value of the input element to the reactive variable's value
     * @param {string|number} value the value of the reactive variable
     * @private
     */
    function setter(value) {

        if (element.value != value) {
            if (element.type == "number") {
                element.value = parseFloat(value.toString()).toString();
            } else {
                element.value = String(value);
            }
        }
    }

    var callback = debounce((e) => {
        let v = element.value;

        if (element.type == "number") {
            reactive_item.value = parseFloat(v);
        } else {
            reactive_item.value = String(v);
        }

    }, debounce_time);

    element.addEventListener(lazy ? "change" : "input", callback);

    setter(reactive_item.value);

    var unsubscribe = reactive_item.subscribe((details) => {

        if (_options.autodisconnect && !element.isConnected) {
            unsubscribe();
            return;
        }

        setter(details.value);
    }, debounce_time);

    return () => {
        element.removeEventListener("input", callback);
        unsubscribe();
    }
}
