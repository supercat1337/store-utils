// @ts-check

/**
 * Global options for the binders.
 *
 * @typedef {object} GlobalOptions
 * @property {number} [debounceTime=0] the default debounce time for all the binders
 * @property {boolean} [autoDisconnect=true] whether to automatically disconnect the subscriptions
 *                                   when the element is removed from the DOM
 */
const globalOptions = {
    debounceTime: 0,
    autoDisconnect: true,
};

export { globalOptions };
