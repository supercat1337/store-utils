// @ts-check

import { binder } from './binder.js';
import { globalOptions } from '../globalOptions.js';

/**
 * Setter toggles a CSS class based on boolean reactive value with optional invert.
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactiveItem
 * @param {HTMLElement} element
 * @param {{cssClassName: string}} ctx
 * @param {import("../types.d.ts").CssClassBindingOptions} options
 */
function setter(reactiveItem, element, ctx, options) {
    const shouldHaveClass = options.invert ? !reactiveItem.value : reactiveItem.value;
    element.classList.toggle(ctx.cssClassName, shouldHaveClass);
}

/**
 * Binds a boolean reactive value to a CSS class presence (toggles the class).
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactiveItem - The reactive item.
 * @param {string} cssClassName - The CSS class name to toggle.
 * @param {import("../types.d.ts").CssClassBindingOptions} [options={}] - Options (invert, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToCssClass(element, reactiveItem, cssClassName, options = {}) {
    const _options = Object.assign({}, globalOptions, { invert: false }, options);
    const ctx = { cssClassName };
    return binder(element, reactiveItem, setter, ctx, _options);
}
