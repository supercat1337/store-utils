// @ts-check
import { globalOptions } from '../../globalOptions.js';
import { attachAbortSignal } from '../../utils/abort-helper.js';

/**
 * Two-way binding for a multiple-select element with a Collection of strings.
 * @param {HTMLSelectElement} selectElement - The multiple select element.
 * @param {import("@supercat1337/store").Collection<string>} reactive - The reactive collection (array of selected values).
 * @param {import("../../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect, signal).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToSelectMultiple(selectElement, reactive, options = {}) {
    let _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    let { debounceTime, autoDisconnect, event: eventName, signal } = _options;

    function updateSelectedOptions() {
        let selectedValues = reactive.value;
        let options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            option.selected = selectedValues.indexOf(option.value) !== -1;
        }
    }

    updateSelectedOptions();

    let changeHandler = () => {
        let selected = [];
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].selected) {
                selected.push(selectElement.options[i].value);
            }
        }
        reactive.value = selected;
    };

    selectElement.addEventListener(eventName, changeHandler);

    let storeUnsubscribe = reactive.subscribe(details => {
        if (autoDisconnect && !selectElement.isConnected) {
            cleanup();
            return;
        }
        updateSelectedOptions();
    }, debounceTime);

    function cleanup() {
        selectElement.removeEventListener(eventName, changeHandler);
        storeUnsubscribe();
    }

    const removeAbortListener = attachAbortSignal(signal, cleanup);

    return () => {
        cleanup();
        removeAbortListener();
    };
}
