// @ts-check

/**
 * Global options for the binders.
 * 
 * @typedef {Object} GlobalOptions
 * @property {number} [debounce_time=0] the default debounce time for all the binders
 * @property {boolean} [autodisconnect=false] whether to automatically disconnect the subscriptions
 */
const globalOptions = {
    debounce_time: 0,
    autodisconnect: false,
};

export { globalOptions }