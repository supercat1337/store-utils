// @ts-check
import { globalOptions } from '../../globalOptions.js';

/**
 * Two-way binding between a checkbox and a boolean Atom.
 * @param {HTMLInputElement} checkbox - The checkbox element.
 * @param {import("@supercat1337/store").Atom<boolean>} reactiveItem - The reactive boolean atom.
 * @param {import("../../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToCheckbox(checkbox, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    const { debounceTime, autoDisconnect, event: eventName } = _options;

    /** @param {boolean} value  */
    function setter(value) {
        checkbox.checked = value;
    }

    const changeHandler = () => {
        reactiveItem.value = checkbox.checked;
    };

    setter(reactiveItem.value);
    checkbox.addEventListener(eventName, changeHandler);

    const storeUnsubscribe = reactiveItem.subscribe(details => {
        if (autoDisconnect && !checkbox.isConnected) {
            cleanup();
            return;
        }
        setter(details.value);
    }, debounceTime);

    function cleanup() {
        checkbox.removeEventListener(eventName, changeHandler);
        storeUnsubscribe();
    }

    return cleanup;
}
