// @ts-check

import { bindToCssClass } from './css-class.js';
import { globalOptions } from '../globalOptions.js';

/**
 * Binds a boolean reactive value to element visibility using a CSS class.
 * The class (by default "d-none") is added when reactive value is false,
 * and removed when true.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").ShowBindingOptions} [options={}] - Options (hideClassName, invert, debounceTime, autoDisconnect).
 *   - invert: if true, the class is added when reactive value is true (rarely needed).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToShow(element, reactiveItem, options = {}) {
    const _options = Object.assign(
        {},
        globalOptions,
        { hideClassName: 'd-none', invert: false }, // user's invert applies to show logic
        options
    );
    const { hideClassName, debounceTime, autoDisconnect, invert } = _options;

    // For show: class should be present when value is false (hidden)
    // So we need invert = true in the underlying css-class binding,
    // unless the user explicitly passed invert: true (then we use false).
    const effectiveInvert = !invert;

    return bindToCssClass(element, reactiveItem, hideClassName, {
        invert: effectiveInvert,
        debounceTime,
        autoDisconnect,
    });
}
