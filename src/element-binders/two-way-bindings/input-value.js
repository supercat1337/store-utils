// @ts-check

import { debounce } from '@supercat1337/store';
import { globalOptions } from '../../globalOptions.js';

/**
 * Two-way binding between an input/textarea and a string/number Atom.
 * @param {HTMLInputElement|HTMLTextAreaElement} element - The input or textarea element.
 * @param {import("@supercat1337/store").Atom<string|number>} reactiveItem - The reactive atom.
 * @param {import("../../types.d.ts").TwoWayBindingOptions & { event?: string }} [options={}] - Options (lazy, event, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToInput(element, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, { lazy: false }, options);
    const { debounceTime, lazy, autoDisconnect, event: eventName } = _options;

    /** @param {string|number} value  */
    function setter(value) {
        let strValue = String(value);
        if (element.type === 'number') {
            const num = parseFloat(strValue);
            if (isNaN(num)) {
                if (element.value !== '') {
                    element.value = '';
                }
                return;
            }
            strValue = num.toString();
        }
        if (element.value !== strValue) {
            element.value = strValue;
        }
    }

    // debounce from @supercat1337/store returns the same wrapped function reference each time,
    // so it's safe to use inputHandler directly for addEventListener and removeEventListener.
    const inputHandler = debounce(() => {
        const newValue = element.value;
        if (element.type === 'number') {
            const num = parseFloat(newValue);
            reactiveItem.value = isNaN(num) ? 0 : num;
        } else {
            reactiveItem.value = newValue;
        }
    }, debounceTime);

    const finalEventName = eventName || (lazy || element.type === 'number' ? 'change' : 'input');
    element.addEventListener(finalEventName, inputHandler);

    setter(reactiveItem.value);

    const storeUnsubscribe = reactiveItem.subscribe(details => {
        if (autoDisconnect && !element.isConnected) {
            cleanup();
            return;
        }
        setter(details.value);
    }, debounceTime);

    function cleanup() {
        element.removeEventListener(finalEventName, inputHandler);
        storeUnsubscribe();
    }

    return cleanup;
}
