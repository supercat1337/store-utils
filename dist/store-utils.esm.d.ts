export type TypeInputValueConverter = (value: any) => string;
export type CustomTaggedTemplateOptions = {
    /**
     * the default debounce time for all the binders
     */
    debounce_time?: number;
    /**
     * whether to automatically disconnect the subscriptions
     */
    autodisconnect?: boolean;
    /**
     * the document to use
     */
    document?: any;
};
/**
 * Global options for the binders.
 */
export type GlobalOptions = {
    /**
     * the default debounce time for all the binders
     */
    debounce_time?: number;
    /**
     * whether to automatically disconnect the subscriptions
     */
    autodisconnect?: boolean;
};
export type TypeItemCreator = (listItemHelper: ListItemHelper) => HTMLElement;
/**
 * @template {{[key:string]:HTMLElement}} Refs
 */
export class Fragment<Refs extends {
    [key: string]: HTMLElement;
}> {
    /**
     * @param {HTMLElement} root the root element of the created fragment
     * @param {() => void} unsubscribe the function that unsubscribes from the created bindings
     * @param {Refs} refs the map of references to the created elements
     */
    constructor(root: HTMLElement, unsubscribe: () => void, refs: Refs);
    /** @type {HTMLElement} */
    root: HTMLElement;
    /** @type {() => void} */
    unsubscribe: () => void;
    /** @type {Refs} */
    refs: Refs;
}
export class ListItemHelper {
    /**
     * @param {HTMLElement} [template_element] - The template HTML element which is used to create new list item elements.
     */
    constructor(template_element?: HTMLElement);
    /**
     * Returns true if a template element is set, otherwise false.
     * @returns {boolean}
     */
    hasTemplate(): boolean;
    /**
     * Returns a clone of the template element, which can be used to create a new list item element.
     * If no template element is set, returns null.
     * @returns {HTMLElement|null}
     */
    getTemplate(): HTMLElement | null;
    /**
     * Returns the index of the list item element
     * @param {HTMLElement} element
     * @returns {number}
     */
    getListItemIndex(element: HTMLElement): number;
    /**
     * Returns the list item element by child node
     * @param {HTMLElement} element
     * @param {string} [attr_name]
     * @returns {HTMLElement|null}
     */
    getListItem(element: HTMLElement, attr_name?: string): HTMLElement | null;
    /**
     * Compares two objects and returns information about their differences
     * @template {{[key:string]:any}} T
     * @param {T} new_object
     * @param {any} old_object
     * @param {(a:any, b:any)=>boolean} [custom_compare_function]
     * @returns {{[key in keyof T]:boolean}}
     */
    getDiffs<T extends {
        [key: string]: any;
    }>(new_object: T, old_object: any, custom_compare_function?: (a: any, b: any) => boolean): { [key in keyof T]: boolean; };
    #private;
}
/**
 * @template T
 */
export class ListItemSetterDetails<T> {
    /**
     * Initializes the ListItemSetterDetails instance with the list item element, index, value, old value, and length of the list.
     * @param {HTMLElement} item_element - The list item element.
     * @param {number} index - The index of the list item element.
     * @param {T} value - The value of the element.
     * @param {any} old_value - The old value of the element.
     * @param {number} length - The length of the list.
     */
    constructor(item_element: HTMLElement, index: number, value: T, old_value: any, length: number);
    /** @type {HTMLElement} */
    item_element: HTMLElement;
    /** @type {number} */
    index: number;
    /** @type {T} */
    value: T;
    /** @type {any} */
    old_value: any;
    /** @type {number} */
    length: number;
}
/**
 * Binds the value of a reactive variable to the element's attribute. If the value is null, the attribute will be removed.
 * @param {HTMLElement} element HTML element
 * @param { import("@supercat1337/store").Atom<string|null> | import("@supercat1337/store").Computed<string|null>} reactive_item reactive variable
 * @param {string} attribute_name a specific attribute
 * @param {Object} options options
 * @param {number} [options.debounce_time=0] debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToAttr(reactive_item: import("@supercat1337/store").Atom<string | null> | import("@supercat1337/store").Computed<string | null>, element: HTMLElement, attribute_name: string, options?: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLInputElement} checkbox the checkbox
 * @param { import("@supercat1337/store").Atom<boolean> } reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time

 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToCheckbox(reactive_item: import("@supercat1337/store").Atom<boolean>, checkbox: HTMLInputElement, options?: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLInputElement[]} checkboxes the array of checkboxes
 * @param { import("@supercat1337/store").Collection<string>} collection the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time

 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToCheckboxValues(collection: import("@supercat1337/store").Collection<string>, checkboxes: HTMLInputElement[], options?: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Binds the value of a reactive variable to the element's "className" property
 * @param {HTMLElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<string> | import("@supercat1337/store").Computed<string>} reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToClassName(reactive_item: import("@supercat1337/store").Atom<string> | import("@supercat1337/store").Computed<string>, element: HTMLElement, options?: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Binds the value of a reactive variable to the element's css-className" property
 * @param {HTMLElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactive_item the reactive variable
 * @param {string} cssClassName the css-className
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @param {boolean} [options.remove_class_flag=false] remove the css-className
 *
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToCssClass(reactive_item: import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>, element: HTMLElement, cssClassName: string, options?: {
    debounce_time?: number;
    remove_class_flag?: boolean;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Binds the value of a reactive variable to the element's "disabled" property
 * @param {HTMLButtonElement|HTMLInputElement|HTMLFieldSetElement
 * |HTMLLinkElement|HTMLOptGroupElement|HTMLOptionElement
 * |HTMLSelectElement|HTMLStyleElement|HTMLTextAreaElement
 * |SVGStyleElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToDisabled(reactive_item: import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>, element: HTMLButtonElement | HTMLInputElement | HTMLFieldSetElement | HTMLLinkElement | HTMLOptGroupElement | HTMLOptionElement | HTMLSelectElement | HTMLStyleElement | HTMLTextAreaElement | SVGStyleElement, options?: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Binds the value of a reactive variable to the element's "innerHTML" property
 * @param {HTMLElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToHtml(reactive_item: import("@supercat1337/store").Atom<string | number> | import("@supercat1337/store").Computed<string | number>, element: HTMLElement, options?: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/** @typedef {(value:any)=>string} TypeInputValueConverter */
/**
 * Synchronizes the value of a reactive variable to the input's "value" property and vice versa
 * @param {HTMLInputElement|HTMLTextAreaElement} element the input element
 * @param { import("@supercat1337/store").Atom<string|number> } reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @param {boolean} [options.lazy=false] if true, the value will be set only when the input is changed
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToInputValue(reactive_item: import("@supercat1337/store").Atom<string | number>, element: HTMLInputElement | HTMLTextAreaElement, options?: {
    debounce_time?: number;
    lazy?: boolean;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Binds the array-value of a reactive collection to the element
 * @template T
 * @param {HTMLElement} list_element the HTML element
 * @param { import("@supercat1337/store").Collection<T>} reactive_item the reactive collection
 * @param {TypeItemCreator} [element_item_creator] the element item creator
 * @param {{(listItemHelper:ListItemHelper, details:ListItemSetterDetails<T>):void}} item_value_setter the item value setter
 * @param {{autodisconnect?:boolean}} [options]
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToList<T>(reactive_item: Collection<T>, list_element: HTMLElement, item_value_setter: (listItemHelper: ListItemHelper, details: ListItemSetterDetails<T>) => void, element_item_creator?: TypeItemCreator, options?: {
    autodisconnect?: boolean;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLSelectElement} select_element the multiple select element
 * @param { import("@supercat1337/store").Collection<string>} reactive the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber} the unsubscribe function
 */
export function bindToMultipleSelect(reactive: import("@supercat1337/store").Collection<string>, select_element: HTMLSelectElement, options?: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Binds the value of a reactive variable to the element's property
 * @template T
 * @param {HTMLElement} element the HTML element
 * @param {import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>} reactive_item the reactive variable
 * @param {Object} options the options
 * @param {string} property_name the property name
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToProperty<T>(reactive_item: Atom<T> | Computed<T>, element: HTMLElement, property_name: string, options?: any): import("@supercat1337/store").Unsubscriber;
/**
 * Synchronizes the value of a reactive variable to the radio buttons
 * @param {HTMLInputElement[]} radios the radio buttons
 * @param { import("@supercat1337/store").Atom<string> } reactive the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToRadios(reactive: import("@supercat1337/store").Atom<string>, radios: HTMLInputElement[], options: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLSelectElement} select_element the select element
 * @param { import("@supercat1337/store").Atom<string> } reactive the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToSelectElement(reactive: import("@supercat1337/store").Atom<string>, select_element: HTMLSelectElement, options?: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Binds the value of a reactive variable to the element's visibility
 * @param {HTMLElement} element the HTML element
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @param {string} [options.hide_class_name="d-none"] the class name to remove
 * @param {boolean} [options.remove_class_flag=true] whether to remove the class
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToShow(reactive_item: import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>, element: HTMLElement, options?: {
    debounce_time?: number;
    hide_class_name?: string;
    remove_class_flag?: boolean;
}): import("@supercat1337/store").Unsubscriber;
/**
 * Binds the value of a reactive variable to the element's "textContent" property
 * @param {HTMLElement|Text} element the HTML element
 * @param { import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
export function bindToText(reactive_item: import("@supercat1337/store").Atom<string | number> | import("@supercat1337/store").Computed<string | number>, element: HTMLElement | Text, options?: {
    debounce_time?: number;
}): import("@supercat1337/store").Unsubscriber;
/**
 * @typedef {Object} CustomTaggedTemplateOptions
 * @property {number} [debounce_time=0] the default debounce time for all the binders
 * @property {boolean} [autodisconnect=false] whether to automatically disconnect the subscriptions
 * @property {any} [document] the document to use
 * */
/**
 * Creates a custom tagged template literal function, which can be used to bind reactive variables to HTML elements.
 * The function is a bound version of the html function, which means that the options object is pre-applied to the function.
 * This can be useful if you want to use the same set of options for multiple invocations of the html function.
 * @param {CustomTaggedTemplateOptions} [options={}] the options object to be pre-applied to the html function
 * @returns {(literals: TemplateStringsArray, ...expressions: (Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|string|number|boolean)[]) => Fragment<any>}
 */
export function createCustomTaggedTemplate(options?: CustomTaggedTemplateOptions): (literals: TemplateStringsArray, ...expressions: (Atom<string | null | boolean | number> | Computed<string | null | boolean | number> | string | number | boolean)[]) => Fragment<any>;
/**
 * Compares two objects and returns information about their differences
 * @template {{[key:string]:any}} T
 * @param {T} new_object
 * @param {any} old_object
 * @param {(a:any, b:any)=>boolean} [custom_compare_function]
 * @returns {{[key in keyof T]:boolean}}
 */
export function getDiffs<T extends {
    [key: string]: any;
}>(new_object: T, old_object: any, custom_compare_function?: (a: any, b: any) => boolean): { [key in keyof T]: boolean; };
export namespace globalOptions {
    let debounce_time: number;
    let autodisconnect: boolean;
}
/**
 * Tagged template literal function, which can be used to bind reactive variables to HTML elements.
 * @template {{[key:string]:HTMLElement}} Refs
 * @param {TemplateStringsArray} literals
 * @param {...(Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|string|number|boolean)} expressions
 * @returns {Fragment<Refs>}
 */
export function html<Refs extends {
    [key: string]: HTMLElement;
}>(literals: TemplateStringsArray, ...expressions: (Atom<string | null | boolean | number> | Computed<string | null | boolean | number> | string | number | boolean)[]): Fragment<Refs>;
import { Collection } from '@supercat1337/store';
import { Atom } from '@supercat1337/store';
import { Computed } from '@supercat1337/store';
//# sourceMappingURL=store-utils.esm.d.ts.map