// @ts-check

import { globalOptions } from "./../globalOptions.js";
import { getDiffs } from "./../other/helpers.js";

const item_index_attr_name = "item-index";

/** 
 * @typedef {(listItemHelper:ListItemHelper)=>HTMLElement} TypeItemCreator
 * */


/**
 * @template T
 */
class ElementList {

    /** @type {HTMLElement} */
    #root_list_element

    /** @type {import("@supercat1337/store").Collection<T>} */
    #collection

    /** @type {(listItemHelper:ListItemHelper, details:ListItemSetterDetails<T>)=>void} */
    #item_value_setter

    /** @type {TypeItemCreator} */
    #element_item_creator

    /** @type {ListItemHelper} */
    #listItemHelper

    /**
     * Initializes the ElementList instance with a collection, an HTML element, an item value setter function, and an optional element item creator function.
     * @param {import("@supercat1337/store").Collection<T>} collection - The collection of items to be listed.
     * @param {HTMLElement} element - The HTML element that contains the list. This is typically a <ul> or <ol> element.
     * @param {{(listItemHelper:ListItemHelper, details:ListItemSetterDetails<T>):void}} item_value_setter - A function that sets the value of a single list item element, given the item element, its index, the value, the old value, and the length of the list.
     * @param {TypeItemCreator} [element_item_creator] - An optional function that creates a new list item element, given the index of the element. If not provided, the first child element of the list is used as a template.
     */
    constructor(collection, element, item_value_setter, element_item_creator) {
        // Save the collection and the element to the instance.
        this.#collection = collection;
        this.#root_list_element = element;

        this.#listItemHelper = new ListItemHelper(this.#loadTemplate());

        // Clear the element's HTML content. This is done so that the list item elements are not duplicated, and the list is repopulated with the correct items.
        this.#root_list_element.innerHTML = "";

        // If the element_item_creator is provided, use it to create new list items.
        if (element_item_creator) {

            this.#element_item_creator = () => {
                return element_item_creator(this.#listItemHelper);
            };

        } else {

            if (this.#listItemHelper.hasTemplate()) {
                this.#element_item_creator = () => {
                    let item_element = this.#listItemHelper.getTemplate();
                    if (item_element == null) throw new Error(`template is not set`);
                    return item_element;
                };
            }
            else {
                throw new Error(`element_item_creator or template is not set`);
            }
        }

        // Set the item value setter function.
        this.setElementItemValueSetter(item_value_setter);
        // Set the data of the list to the value of the collection.
        this.setData(this.#collection.value);
    }

    /**
     * Loads the first child element of the list.
     * @returns {HTMLElement|undefined}
     */
    #loadTemplate() {
        let list_item = this.#root_list_element.firstElementChild;

        if (list_item) {
            let list_item_template = /** @type {HTMLElement} */ (list_item.cloneNode(true));

            return list_item_template;
        }

        list_item = null;
        return;
    }

    /**
     * Removes the element at the specified index.
     * @param {number} index 
     */
    removeElementListItem(index) {
        this.#root_list_element.children.item(index)?.remove();
    }

    /**
     * Removes the last child element of the list.
     * This is equivalent to calling `removeElementListItem(length - 1)`.
     * @returns {void}
     */
    removeLastElementListItem() {
        this.#root_list_element.lastElementChild?.remove();
    }

    /**
     * Sets the value of the element at the specified index, using the provided value and old value.
     * @param {number} index 
     * @param {T} value 
     * @param {any} old_value 
     * @returns 
     */
    setElementItemValue(index, value, old_value) {
        var list_item = /** @type {HTMLElement} */ (this.#root_list_element.children.item(index));
        if (!list_item) return;

        list_item.setAttribute(item_index_attr_name, String(index));

        let details = new ListItemSetterDetails(list_item, index, value, old_value, this.#collection.value.length);

        this.#item_value_setter(this.#listItemHelper, details);
    }

    /**
     * Sets the data for the entire list, updating the values of all elements.
     * @param {T[]} arr 
     */
    setData(arr) {
        this.setElementListSize(arr.length);

        for (let index = 0; index < arr.length; index++) {
            this.setElementItemValue(index, arr[index], undefined);
        }
    }

    /**
     * Sets the item value setter function for the list.
     * @param {{(listItemHelper:ListItemHelper, details:ListItemSetterDetails<T>):void}} setter 
     */
    setElementItemValueSetter(setter) {
        this.#item_value_setter = setter;
    }

    /**
     * Sets the size of the list, adding or removing elements as necessary.
     * @param {number} size 
     */
    setElementListSize(size) {
        const root_list = this.#root_list_element;
        const listItemsLength = root_list.children.length;

        if (listItemsLength === size) return;

        if (listItemsLength < size) {
            for (let i = listItemsLength; i < size; i++) {
                this.appendElementListItem(this.#collection.value[i], i);
            }
        } else {
            for (let i = size; i < listItemsLength; i++) {
                this.removeLastElementListItem();
            }
        }
    }

    /**
     * Appends a new element to the list, with the specified value and index.
     * @param {T} value 
     * @param {number} index 
     */
    appendElementListItem(value, index) {
        var element_item = this.#element_item_creator(this.#listItemHelper);
        this.#root_list_element.append(element_item);

        this.setElementItemValue(index, value, undefined);
    }

}

/**
 * Returns the list item element by attribute
 * @param {HTMLElement} element 
 * @param {string} [attr_name]
 * @returns {HTMLElement|null} 
 */
function getListItem(element, attr_name) {
    var search_attr = attr_name || item_index_attr_name;
    var value = element.getAttribute(search_attr);
    if (value !== null) return element;

    return element.closest(`[${search_attr}]`);
}

/**
 * Returns the index of the list item element
 * @param {HTMLElement} element 
 * @returns {number}
 */
function getListItemIndex(element) {
    var list_item = getListItem(element);
    if (!list_item) return -1;

    var index = list_item.getAttribute(item_index_attr_name);
    if (index === null) return -1;

    return parseInt(index);
}

/**
 * @template T
 */
export class ListItemSetterDetails {

    /** @type {HTMLElement} */
    item_element;
    /** @type {number} */
    index;
    /** @type {T} */
    value;
    /** @type {any} */
    old_value;
    /** @type {number} */
    length;

    /**
     * Initializes the ListItemSetterDetails instance with the list item element, index, value, old value, and length of the list.
     * @param {HTMLElement} item_element - The list item element.
     * @param {number} index - The index of the list item element.
     * @param {T} value - The value of the element.
     * @param {any} old_value - The old value of the element.
     * @param {number} length - The length of the list.
     */
    constructor(item_element, index, value, old_value, length) {
        this.item_element = item_element;
        this.index = index;
        this.value = value;
        this.old_value = old_value;
        this.length = length;
    }
}

/*
Class Definition: The ListItemHelper class is a utility class that helps manage list item elements. It can be initialized with a template HTML element, which can be used to create new list item elements.

Methods:

hasTemplate(): Returns a boolean indicating whether a template element is set.
getTemplate(): Returns a clone of the template element, or null if no template element is set.
getListItemIndex(element): Returns the index of the list item element ( delegates to an external getListItemIndex function).
getListItem(element, attr_name): Returns the list item element by child node (delegates to an external getListItem function).
getDiffs(new_object, old_object, custom_compare_function): Compares two objects and returns information about their differences (delegates to an external getDiffs function).
*/

export class ListItemHelper {

    /** @type {HTMLElement|null} */
    #template_element = null;

    /**
     * @param {HTMLElement} [template_element] - The template HTML element which is used to create new list item elements.
     */
    constructor(template_element) {
        if (template_element) {
            this.#template_element = template_element;
        }
    }

    /**
     * Returns true if a template element is set, otherwise false.
     * @returns {boolean}
     */
    hasTemplate() {
        return this.#template_element != null;
    }

    /**
     * Returns a clone of the template element, which can be used to create a new list item element.
     * If no template element is set, returns null.
     * @returns {HTMLElement|null}
     */
    getTemplate() {
        if (this.#template_element == null) return null;
        return /** @type {HTMLElement} */ (this.#template_element.cloneNode(true));
    }

    /**
     * Returns the index of the list item element
     * @param {HTMLElement} element
     * @returns {number}
     */
    getListItemIndex(element) {
        return getListItemIndex(element);
    }

    /**
     * Returns the list item element by child node
     * @param {HTMLElement} element
     * @param {string} [attr_name]
     * @returns {HTMLElement|null}
     */
    getListItem(element, attr_name) {
        return getListItem(element, attr_name);
    }

    /**
     * Compares two objects and returns information about their differences
     * @template {{[key:string]:any}} T
     * @param {T} new_object 
     * @param {any} old_object 
     * @param {(a:any, b:any)=>boolean} [custom_compare_function] 
     * @returns {{[key in keyof T]:boolean}}
     */
    getDiffs(new_object, old_object, custom_compare_function) {
        return getDiffs(new_object, old_object, custom_compare_function);
    }
}

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
export function bindToList(reactive_item, list_element, item_value_setter, element_item_creator, options = {}) {

    var element_list_wrapper = new ElementList(reactive_item, list_element, item_value_setter, element_item_creator);
    var _options = Object.assign({}, globalOptions, options);

    var unsubscribe = reactive_item.subscribe((details) => {

        if (_options.autodisconnect && !list_element.isConnected) {
            unsubscribe();
            return;
        }

        if (details.property === null) {
            element_list_wrapper.setData(details.value);
            return;
        }

        if (details.property == "length") {
            element_list_wrapper.setElementListSize(reactive_item.value.length);
            return;
        }

        var index = parseInt(details.property);

        if (isNaN(index)) return;

        if (details.eventType == "set") {
            element_list_wrapper.setElementItemValue(index, details.value, details.old_value);
        }

        if (details.eventType == "delete") {
            element_list_wrapper.removeElementListItem(index);
        }

    }, 0);

    return unsubscribe;
}

