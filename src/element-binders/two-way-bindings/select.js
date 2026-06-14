// @ts-check
import { globalOptions } from './../../globalOptions.js';

/**
 * Two-way binding for a single-select element with a string Atom.
 * @param {HTMLSelectElement} selectElement - The select element.
 * @param {import("@supercat1337/store").Atom<string>} reactive - The reactive atom.
 * @param {import("../../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToSelect(selectElement, reactive, options = {}) {
    const _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    const { debounceTime, autoDisconnect, event: eventName } = _options;

    /** @param {string} value  */
    function setter(value) {
        selectElement.value = value;
    }

    setter(reactive.value);

    const callback = () => {
        reactive.value = selectElement.value;
    };

    selectElement.addEventListener(eventName, callback);

    const unsubscribe = reactive.subscribe(details => {
        if (autoDisconnect && !selectElement.isConnected) {
            unsubscribe();
            return;
        }
        setter(details.value);
    }, debounceTime);

    return () => {
        selectElement.removeEventListener(eventName, callback);
        unsubscribe();
    };
}
