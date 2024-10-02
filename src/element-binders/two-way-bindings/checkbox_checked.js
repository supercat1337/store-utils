// @ts-check
import { globalOptions } from "./../../globalOptions.js";

/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLInputElement} checkbox the checkbox 
 * @param { import("@supercat1337/store").Atom<boolean> } reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time

 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToCheckbox(reactive_item, checkbox, options = {}) {

    let _options = (Object.assign({}, globalOptions, options));

    let { debounce_time } = _options;

    /**
     * Sets the value of the reactive variable to the checkbox's "checked" property
     * @param {boolean} value the value of the reactive variable
     * @private
     */
    function setter(value) {
        checkbox.checked = value;
    }

    var callback = (e) => {
        reactive_item.value = checkbox.checked;
    };

    setter(reactive_item.value);
    checkbox.addEventListener("change", callback);

    var unsubscribe = reactive_item.subscribe((details) => {

        if (_options.autodisconnect && !checkbox.isConnected) {
            unsubscribe_main();
            return;
        }

        setter(details.value);
    }, debounce_time);

    var unsubscribe_main = () => {
        checkbox.removeEventListener("change", callback);
        unsubscribe();
    }

    return unsubscribe_main;
}
