// @ts-check
import { globalOptions } from "./../../globalOptions.js";

/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLSelectElement} select_element the multiple select element
 * @param { import("@supercat1337/store").Collection<string>} reactive the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber} the unsubscribe function
 */
export function bindToMultipleSelect(reactive, select_element, options = {}) {

    let _options = Object.assign({}, globalOptions, options)
    let { debounce_time } = _options;

    function setter() {
        /** @type {string[]} */
        var array = reactive.value;

        /** @type {{[key:string]:HTMLOptionElement}} */
        var data = {};

        var options = select_element.options;
        for (let i = 0; i < options.length; i++) {
            data[options[i].value] = options[i];
        }

        for (let i = 0; i < array.length; i++) {
            if (data[array[i]]) {
                if (!data[array[i]].selected) {
                    data[array[i]].selected = true;
                }
            }
        }
    }

    setter();

    /**
     * 
     * @param {Event} e 
     */
    var callback = (e) => {
        reactive.value = Array.from(select_element.selectedOptions).map((option) => option.value);
    };

    select_element.addEventListener("change", callback);

    var unsubscribe = reactive.subscribe((/** @type {import("@supercat1337/store").TypeUpdateEventDetails} */ details) => {

        if (_options.autodisconnect && !select_element.isConnected) {
            unsubscribe();
            return;
        }

        if (typeof details.property == "string" && /^\d+$/.test(details.property)) {
            if (details.eventType == "delete") {
                let option = select_element.options[details.property];
                if (option && option.selected) {
                    option.selected = false;
                }
            }

            if (details.eventType == "set") {
                let option = select_element.options[details.property];
                if (option && !option.selected) {
                    option.selected = true;
                }
            }
        } else {
            if (details.eventType == "set") {
                var options = select_element.options;
                for (let i = 0; i < options.length; i++) {
                    let option = select_element.options[i];
                    option.selected = reactive.value.indexOf(option.value) != -1;
                }
            }
        }

        setter();

    }, debounce_time);

    return () => {
        select_element.removeEventListener("change", callback);
        unsubscribe();
    }
}
