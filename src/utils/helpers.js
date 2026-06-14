// @ts-check

/**
 * Compares two objects and returns information about their differences.
 * @template {{[key:string]:any}} T
 * @param {T} newObject
 * @param {any} oldObject
 * @param {(a:any, b:any)=>boolean} [customCompareFunction] - Returns true if values are equal.
 * @returns {{[key in keyof T]:boolean}} - true if the property has changed.
 */
export function getDiffs(newObject, oldObject, customCompareFunction) {
    /** @type {{[key:string]:boolean}} */
    const result = {};

    for (const prop in newObject) {
        if (typeof prop !== 'string') {
            continue;
        }

        if (oldObject && oldObject.hasOwnProperty(prop)) {
            result[prop] = customCompareFunction
                ? !customCompareFunction(newObject[prop], oldObject[prop])
                : newObject[prop] !== oldObject[prop];
        } else {
            result[prop] = true;
        }
    }

    return /** @type {{[key in keyof T]:boolean}} */ (result);
}
