// @ts-check
import { globalOptions } from "./../../globalOptions.js";

/**
 * Synchronizes the value of a reactive variable to the radio buttons
 * @param {HTMLInputElement[]} radios the radio buttons
 * @param { import("@supercat1337/store").Atom<string> } reactive the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToRadios(reactive, radios, options) {

    // init 
    let _options = Object.assign({}, globalOptions, options)
    let { debounce_time } = _options;

    if (radios.length === 0) return () => { };

    let radio_name = radios[0].name || "";
    if (radio_name == "") return () => { };

    /** @type {{[key:string]:HTMLInputElement}} */
    var data = {};
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].name == radio_name && radios[i].value != "") {
            data[radios[i].value] = radios[i];
        }
    }

    /**
     * Sets the value of the reactive variable to the radio buttons
     * @param {string} value the value of the reactive variable
     * @private
     */
    function setter(value) {

        if (data[value]) {
            //data[value].click();
            data[value].checked = true;
        }
    }

    setter(reactive.value);

    /**
     * 
     * @param {Event} e 
     */
    var callback = (e) => {
        let element = /** @type {HTMLInputElement} */ (e.target);
        if (!element) return;

        reactive.value = element.value;
    };

    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", callback);
    }

    var unsubscribe = reactive.subscribe((details) => {

        if (_options.autodisconnect && !radios[0].isConnected) {
            unsubscribe();
            return;
        }

        setter(details.value);
    }, debounce_time);

    return () => {
        for (let i = 0; i < radios.length; i++) {
            radios[i].removeEventListener("change", callback);
        }
        unsubscribe();
    }
}
