// @ts-check
import { globalOptions } from "./../../globalOptions.js";

/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLSelectElement} select_element the select element
 * @param { import("@supercat1337/store").Atom<string> } reactive the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time 
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToSelectElement(reactive, select_element, options = {}) {

    let _options = Object.assign({}, globalOptions, options)
    let { debounce_time } = _options;

    /**
     * Initializes the select element with the value of the reactive variable
     * @param {string} value the value of the reactive variable
     */
    function setter(value) {
        select_element.value = value;
    }

    setter(reactive.value);

    /**
     * 
     * @param {Event} e 
     */
    var callback = (e) => {
        reactive.value = select_element.value;
    };

    select_element.addEventListener("change", callback); 
    
    var unsubscribe = reactive.subscribe((details) => {

        if (_options.autodisconnect && !select_element.isConnected) {
            unsubscribe();
            return;
        }

        setter(details.value);
    }, debounce_time);

    return () => {
        select_element.removeEventListener("change", callback);
        unsubscribe();
    }
}
