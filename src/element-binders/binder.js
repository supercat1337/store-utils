// @ts-check
import { globalOptions } from "./../globalOptions.js";

/**
 * Binds the value of a reactive variable to the element's property
 * @template T
 * @param { import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T> | import("@supercat1337/store").Collection<T>} reactive_item the reactive variable
 * @param {HTMLElement} element the HTML element 
 * @param {(reactive_item:import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T> | import("@supercat1337/store").Collection<T>, element:HTMLElement, ctx:Object, options:{[key:string]:any})=>void} setter a function that updates the element's property with the reactive variable's value
 * @param {Object} [ctx={}] optional context object
 * @param {Object} options options
 * @param {number} [options.debounce_time=0] debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function binder(reactive_item, element, setter, ctx = {}, options = {}){

    let _options = Object.assign({}, globalOptions, options)
    let { debounce_time } = _options;
    
    //console.log(reactive_item, element.outerHTML, ctx, _options);
    setter(reactive_item, element, ctx, _options);

    var unsubscribe = reactive_item.subscribe((details)=>{
        if (_options.autodisconnect && !element.isConnected) {
            unsubscribe();
            return;
        }

        setter(reactive_item, element, ctx, _options); 
    }, debounce_time);

    return unsubscribe;
}