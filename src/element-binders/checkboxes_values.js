// @ts-check
import { globalOptions } from "../globalOptions.js";

/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLInputElement[]} checkboxes the array of checkboxes
 * @param { import("@supercat1337/store").Collection<string>} collection the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time

 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToCheckboxValues(collection, checkboxes, options = {}) {

    let _options = (Object.assign({}, globalOptions, options));

    let { debounce_time } = _options;

    // init 

    /** @type {{[key:string]:HTMLInputElement}} */
    var data = {};

    for (let i = 0; i < checkboxes.length; i++) {
        data[checkboxes[i].value] = checkboxes[i];
    }

    function setter() {
        let array_of_values = collection.value;

        for (let i = 0; i < checkboxes.length; i++) {
            let value = checkboxes[i].value;
            data[value].checked = array_of_values.indexOf(value) > -1;
        }
    }


    var callback = () => {
        let result = [];

        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked)
                result.push(checkboxes[i].value);
        }

        collection.value = result;
        //console.log(result);

    };

    //setter();
    //callback();
    
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", callback);
    }     

    var unsubscribe = collection.subscribe((details) => {

        if (_options.autodisconnect && !checkboxes[0].isConnected) {
            unsubscribe();
            return;
        }

        setter();
    }, debounce_time);

    return () => {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].removeEventListener("change", callback);
        }
        unsubscribe();
    }
}
