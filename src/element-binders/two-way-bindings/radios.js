// @ts-check
import { globalOptions } from '../../globalOptions.js';
import { attachAbortSignal } from '../../utils/abort-helper.js';

/**
 * Two-way binding for a group of radio buttons with a string Atom.
 * @param {HTMLInputElement[]} radios - Array of radio input elements (must share same name).
 * @param {import("@supercat1337/store").Atom<string>} reactive - The reactive atom.
 * @param {import("../../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect, signal).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToRadioGroup(radios, reactive, options = {}) {
    if (radios.length === 0) {
        return () => {};
    }

    const _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    const { debounceTime, autoDisconnect, event: eventName, signal } = _options;

    const radioName = radios[0].name;
    if (!radioName) {
        return () => {};
    }

    /** @type {Record<string, HTMLInputElement>} */
    const valueToRadio = {};
    for (let i = 0; i < radios.length; i++) {
        const radio = radios[i];
        if (radio.name === radioName && radio.value !== '') {
            valueToRadio[radio.value] = radio;
        }
    }

    /**
     * @param {string} value
     */
    function setter(value) {
        const radio = valueToRadio[value];
        if (radio && !radio.checked) {
            radio.checked = true;
        }
    }

    /** @param {Event} e */
    const changeHandler = e => {
        const target = /** @type {HTMLInputElement} */ (e.target);
        if (target && target.name === radioName) {
            reactive.value = target.value;
        }
    };

    setter(reactive.value);

    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener(eventName, changeHandler);
    }

    const storeUnsubscribe = reactive.subscribe(details => {
        if (autoDisconnect && !radios[0]?.isConnected) {
            cleanup();
            return;
        }
        setter(details.value);
    }, debounceTime);

    function cleanup() {
        for (let i = 0; i < radios.length; i++) {
            radios[i].removeEventListener(eventName, changeHandler);
        }
        storeUnsubscribe();
    }

    const removeAbortListener = attachAbortSignal(signal, cleanup);

    return () => {
        cleanup();
        removeAbortListener();
    };
}
