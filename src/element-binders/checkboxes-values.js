// @ts-check
import { globalOptions } from '../globalOptions.js';
import { attachAbortSignal } from '../utils/abort-helper.js';

/**
 * Two-way binding between a collection of strings and a set of checkboxes with matching values.
 * @param {HTMLInputElement[]} checkboxes - Array of checkbox elements.
 * @param {import("@supercat1337/store").Collection<string>} collection - The reactive collection (array of selected values).
 * @param {import("../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect, signal).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToCheckboxGroup(checkboxes, collection, options = {}) {
    if (checkboxes.length === 0) {
        return () => {};
    }

    const _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    const { debounceTime, autoDisconnect, event: eventName, signal } = _options;

    // Build value -> checkbox map
    const valueToCheckbox = {};
    for (let i = 0; i < checkboxes.length; i++) {
        // @ts-ignore
        valueToCheckbox[checkboxes[i].value] = checkboxes[i];
    }

    function updateCheckboxes() {
        const selectedValues = collection.value;
        for (let i = 0; i < checkboxes.length; i++) {
            const cb = checkboxes[i];
            cb.checked = selectedValues.indexOf(cb.value) !== -1;
        }
    }

    const changeHandler = () => {
        const selected = [];
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                selected.push(checkboxes[i].value);
            }
        }
        collection.value = selected;
    };

    updateCheckboxes();

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener(eventName, changeHandler);
    }

    const storeUnsubscribe = collection.subscribe(_details => {
        if (autoDisconnect && !checkboxes[0]?.isConnected) {
            cleanup();
            return;
        }
        updateCheckboxes();
    }, debounceTime);

    function cleanup() {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].removeEventListener(eventName, changeHandler);
        }
        storeUnsubscribe();
    }

    const removeAbortListener = attachAbortSignal(signal, cleanup);

    return () => {
        cleanup();
        removeAbortListener();
    };
}
