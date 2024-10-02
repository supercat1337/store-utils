// @ts-check

/**
 * Compares two objects and returns information about their differences
 * @template {{[key:string]:any}} T
 * @param {T} new_object 
 * @param {any} old_object 
 * @param {(a:any, b:any)=>boolean} [custom_compare_function] 
 * @returns {{[key in keyof T]:boolean}}
 */
export function getDiffs(new_object, old_object, custom_compare_function) {
    /** @type {{[key:string]:boolean}} */
    var result = {};

    for (let prop in new_object) {
        if (typeof prop != "string") continue;
        
        if (old_object && old_object.hasOwnProperty(prop)) {
            result[ prop] = custom_compare_function? custom_compare_function(new_object[prop], old_object[prop]) : new_object[prop] !== old_object[prop];
        }
        else {
            result[prop] = true;
        }
    }

    return /** @type {{[key in keyof T]:boolean}} */(result);
}