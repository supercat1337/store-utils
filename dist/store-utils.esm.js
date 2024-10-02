import { debounce, Atom, Computed, Collection } from '@supercat1337/store';

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

// @ts-check


/**
 * Sets the element's property from the reactive variable's value
 * @param {import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactive_item the reactive variable
 * @param {HTMLElement|Text} element the HTML element
 * @param {{property_name:string}} ctx the context object
 */
function setter$3(reactive_item, element, ctx) {
    element[ctx.property_name] = String(reactive_item.value);
}

/**
 * Binds the value of a reactive variable to the element's "textContent" property
 * @param {HTMLElement|Text} element the HTML element
 * @param { import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactive_item the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToText(reactive_item, element, options = {}) {

    let _options = Object.assign({}, globalOptions, options);
    let { debounce_time } = _options;
    let ctx = {property_name: "textContent"};

    setter$3(reactive_item, element, ctx);

    var unsubscribe = reactive_item.subscribe((details)=>{
        if (_options.autodisconnect && !element.isConnected) {
            unsubscribe();
            return;
        }

        setter$3(reactive_item, element, ctx); 
    }, debounce_time);

    return unsubscribe;
}

// @ts-check

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
function binder(reactive_item, element, setter, ctx = {}, options = {}){

    let _options = Object.assign({}, globalOptions, options);
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

// @ts-check


/**
 * Sets the element's property from the reactive variable's value
 * @template T
 * @param {import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>} reactive_item
 * @param {HTMLElement} element
 * @param {{property_name:string}} ctx
 */
function setter$2(reactive_item, element, ctx) {
    element[ctx.property_name] = reactive_item.value;
}

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
function bindToProperty(reactive_item, element, property_name, options = {}){
    let _options = Object.assign({}, globalOptions, options);

    // @ts-ignore
    return binder(reactive_item, element, setter$2, {property_name}, _options);
}

// @ts-check



/**
 * Binds the value of a reactive variable to the element's "innerHTML" property
 * @param {HTMLElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToHtml(reactive_item, element, options = {}) {
    return bindToProperty(reactive_item, element, "innerHTML", options);
}

// @ts-check


/**
 * Binds the value of a reactive variable to the element's "className" property
 * @param {HTMLElement} element the HTML element
 * @param { import("@supercat1337/store").Atom<string> | import("@supercat1337/store").Computed<string>} reactive_item the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToClassName(reactive_item, element, options = {}) {
    return bindToProperty(reactive_item, element, "className", options);
}

// @ts-check


/**
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactive_item 
 * @param {HTMLElement} element 
 * @param {{cssClassName:string}} ctx 
 * @param {Object} options 
 * @param {number} options.debounce_time
 * @param {boolean} options.remove_class_flag 
 */
function setter$1(reactive_item, element, ctx, options) {
    let { remove_class_flag } = options;

    var show_class_value = Boolean(reactive_item.value);
    console.warn(element.className, "show", show_class_value, "remove_class_flag", remove_class_flag, ctx.cssClassName);

    if (remove_class_flag == false) {
        element.classList.toggle(ctx.cssClassName, show_class_value);
    } else {
        //console.log(ctx.cssClassName, !show_class_value)
        element.classList.toggle(ctx.cssClassName, !show_class_value);
    }
}

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
function bindToCssClass(reactive_item, element, cssClassName, options = {}) {

    let _options = Object.assign({}, globalOptions, { remove_class_flag: false }, options);

    let ctx = { cssClassName };

    // @ts-ignore
    return binder(reactive_item, element, setter$1, ctx, _options);
}

// @ts-check


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
function bindToShow(reactive_item, element, options = {}) {

    let _options = Object.assign({}, globalOptions, { remove_class_flag: true, hide_class_name: "d-none" }, options);
    let { hide_class_name } = _options;

    return bindToCssClass(reactive_item, element, hide_class_name, _options);
}

// @ts-check


/**
 * Sets the attribute of the element
 * @param { import("@supercat1337/store").Atom<string|null> | import("@supercat1337/store").Computed<string|null>} reactive_item
 * @param {HTMLElement} element
 * @param {{attribute_name:string}} ctx
 */
function setter(reactive_item, element, ctx) {
    if (typeof reactive_item.value == "string") {
        element.setAttribute(ctx.attribute_name, reactive_item.value);
    } else if (reactive_item.value == null){
        element.removeAttribute(ctx.attribute_name);
    }
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
function bindToAttr(reactive_item, element, attribute_name, options = {}) {

    let _options = Object.assign({}, globalOptions, options);

    // @ts-ignore
    return binder(reactive_item, element, setter, {attribute_name}, _options);
}

// @ts-check

/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLInputElement} checkbox the checkbox 
 * @param { import("@supercat1337/store").Atom<boolean> } reactive_item the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time

 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToCheckbox(reactive_item, checkbox, options = {}) {

    let _options = (Object.assign({}, globalOptions, options));

    let { debounce_time } = _options;

    /**
     * Sets the value of the reactive variable to the checkbox's "checked" property
     * @param {boolean} value the value of the reactive variable
     * @private
     */
    function setter(value) {
        checkbox.checked = value;
    }

    var callback = (e) => {
        reactive_item.value = checkbox.checked;
    };

    setter(reactive_item.value);
    checkbox.addEventListener("change", callback);

    var unsubscribe = reactive_item.subscribe((details) => {

        if (_options.autodisconnect && !checkbox.isConnected) {
            unsubscribe_main();
            return;
        }

        setter(details.value);
    }, debounce_time);

    var unsubscribe_main = () => {
        checkbox.removeEventListener("change", callback);
        unsubscribe();
    };

    return unsubscribe_main;
}

// @ts-check


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
function bindToInputValue(reactive_item, element, options = {}) {

    let _options = (Object.assign({}, globalOptions, { lazy: false }, options));

    let { debounce_time, lazy } = _options;

    if (element.type == "number") {
        lazy = true;
    }

    /**
     * Sets the value of the input element to the reactive variable's value
     * @param {string|number} value the value of the reactive variable
     * @private
     */
    function setter(value) {

        if (element.value != value) {
            if (element.type == "number") {
                element.value = parseFloat(value.toString()).toString();
            } else {
                element.value = String(value);
            }
        }
    }

    var callback = debounce((e) => {
        let v = element.value;

        if (element.type == "number") {
            reactive_item.value = parseFloat(v);
        } else {
            reactive_item.value = String(v);
        }

    }, debounce_time);

    element.addEventListener(lazy ? "change" : "input", callback);

    setter(reactive_item.value);

    var unsubscribe = reactive_item.subscribe((details) => {

        if (_options.autodisconnect && !element.isConnected) {
            unsubscribe();
            return;
        }

        setter(details.value);
    }, debounce_time);

    return () => {
        element.removeEventListener("input", callback);
        unsubscribe();
    }
}

// @ts-check

/**
 * Compares two objects and returns information about their differences
 * @template {{[key:string]:any}} T
 * @param {T} new_object 
 * @param {any} old_object 
 * @param {(a:any, b:any)=>boolean} [custom_compare_function] 
 * @returns {{[key in keyof T]:boolean}}
 */
function getDiffs(new_object, old_object, custom_compare_function) {
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

// @ts-check


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
class ListItemSetterDetails {

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

class ListItemHelper {

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
function bindToList(reactive_item, list_element, item_value_setter, element_item_creator, options = {}) {

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

// @ts-check


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
function bindToDisabled(reactive_item, element, options = {}){
    return bindToProperty(reactive_item, /** @type {HTMLElement} */ (element), "disabled", options);
}

// @ts-check

/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLInputElement[]} checkboxes the array of checkboxes
 * @param { import("@supercat1337/store").Collection<string>} collection the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time

 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToCheckboxValues(collection, checkboxes, options = {}) {

    let _options = (Object.assign({}, globalOptions, options));

    let { debounce_time } = _options;

    // init 

    /** @type {{[key:string]:HTMLInputElement}} */
    var data = {};

    for (let i = 0; i < checkboxes.length; i++) {
        data[checkboxes[i].value] = checkboxes[i];
    }

    function setter() {
        let array_of_values = collection.value;

        for (let i = 0; i < checkboxes.length; i++) {
            let value = checkboxes[i].value;
            data[value].checked = array_of_values.indexOf(value) > -1;
        }
    }


    var callback = () => {
        let result = [];

        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked)
                result.push(checkboxes[i].value);
        }

        collection.value = result;
        //console.log(result);

    };

    //setter();
    //callback();
    
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", callback);
    }     

    var unsubscribe = collection.subscribe((details) => {

        if (_options.autodisconnect && !checkboxes[0].isConnected) {
            unsubscribe();
            return;
        }

        setter();
    }, debounce_time);

    return () => {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].removeEventListener("change", callback);
        }
        unsubscribe();
    }
}

// @ts-check

/**
 * Synchronizes the value of a reactive variable to the radio buttons
 * @param {HTMLInputElement[]} radios the radio buttons
 * @param { import("@supercat1337/store").Atom<string> } reactive the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToRadios(reactive, radios, options) {

    // init 
    let _options = Object.assign({}, globalOptions, options);
    let { debounce_time } = _options;

    if (radios.length === 0) return () => { };

    let radio_name = radios[0].name || "";
    if (radio_name == "") return () => { };

    /** @type {{[key:string]:HTMLInputElement}} */
    var data = {};
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].name == radio_name && radios[i].value != "") {
            data[radios[i].value] = radios[i];
        }
    }

    /**
     * Sets the value of the reactive variable to the radio buttons
     * @param {string} value the value of the reactive variable
     * @private
     */
    function setter(value) {

        if (data[value]) {
            //data[value].click();
            data[value].checked = true;
        }
    }

    setter(reactive.value);

    /**
     * 
     * @param {Event} e 
     */
    var callback = (e) => {
        let element = /** @type {HTMLInputElement} */ (e.target);
        if (!element) return;

        reactive.value = element.value;
    };

    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", callback);
    }

    var unsubscribe = reactive.subscribe((details) => {

        if (_options.autodisconnect && !radios[0].isConnected) {
            unsubscribe();
            return;
        }

        setter(details.value);
    }, debounce_time);

    return () => {
        for (let i = 0; i < radios.length; i++) {
            radios[i].removeEventListener("change", callback);
        }
        unsubscribe();
    }
}

// @ts-check

/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLSelectElement} select_element the multiple select element
 * @param { import("@supercat1337/store").Collection<string>} reactive the reactive variable 
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time
 * @returns {import("@supercat1337/store").Unsubscriber} the unsubscribe function
 */
function bindToMultipleSelect(reactive, select_element, options = {}) {

    let _options = Object.assign({}, globalOptions, options);
    let { debounce_time } = _options;

    function setter() {
        /** @type {string[]} */
        var array = reactive.value;

        /** @type {{[key:string]:HTMLOptionElement}} */
        var data = {};

        var options = select_element.options;
        for (let i = 0; i < options.length; i++) {
            data[options[i].value] = options[i];
        }

        for (let i = 0; i < array.length; i++) {
            if (data[array[i]]) {
                if (!data[array[i]].selected) {
                    data[array[i]].selected = true;
                }
            }
        }
    }

    setter();

    /**
     * 
     * @param {Event} e 
     */
    var callback = (e) => {
        reactive.value = Array.from(select_element.selectedOptions).map((option) => option.value);
    };

    select_element.addEventListener("change", callback);

    var unsubscribe = reactive.subscribe((/** @type {import("@supercat1337/store").TypeUpdateEventDetails} */ details) => {

        if (_options.autodisconnect && !select_element.isConnected) {
            unsubscribe();
            return;
        }

        if (typeof details.property == "string" && /^\d+$/.test(details.property)) {
            if (details.eventType == "delete") {
                let option = select_element.options[details.property];
                if (option && option.selected) {
                    option.selected = false;
                }
            }

            if (details.eventType == "set") {
                let option = select_element.options[details.property];
                if (option && !option.selected) {
                    option.selected = true;
                }
            }
        } else {
            if (details.eventType == "set") {
                var options = select_element.options;
                for (let i = 0; i < options.length; i++) {
                    let option = select_element.options[i];
                    option.selected = reactive.value.indexOf(option.value) != -1;
                }
            }
        }

        setter();

    }, debounce_time);

    return () => {
        select_element.removeEventListener("change", callback);
        unsubscribe();
    }
}

// @ts-check

/**
 * Synchronizes the value of a reactive variable to the checkbox's "checked" property and vice versa
 * @param {HTMLSelectElement} select_element the select element
 * @param { import("@supercat1337/store").Atom<string> } reactive the reactive variable
 * @param {Object} options the options
 * @param {number} [options.debounce_time=0] the debounce time 
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToSelectElement(reactive, select_element, options = {}) {

    let _options = Object.assign({}, globalOptions, options);
    let { debounce_time } = _options;

    /**
     * Initializes the select element with the value of the reactive variable
     * @param {string} value the value of the reactive variable
     */
    function setter(value) {
        select_element.value = value;
    }

    setter(reactive.value);

    /**
     * 
     * @param {Event} e 
     */
    var callback = (e) => {
        reactive.value = select_element.value;
    };

    select_element.addEventListener("change", callback); 
    
    var unsubscribe = reactive.subscribe((details) => {

        if (_options.autodisconnect && !select_element.isConnected) {
            unsubscribe();
            return;
        }

        setter(details.value);
    }, debounce_time);

    return () => {
        select_element.removeEventListener("change", callback);
        unsubscribe();
    }
}

// @ts-check



/**
 * @template {{[key:string]:HTMLElement}} Refs
 */
class Fragment {
    // element: HTMLElement, unsubscribe: () => void, refs: {[key:string]:HTMLElement

    /** @type {HTMLElement} */
    root;
    /** @type {() => void} */
    unsubscribe;
    /** @type {Refs} */
    refs;

    /**
     * @param {HTMLElement} root the root element of the created fragment
     * @param {() => void} unsubscribe the function that unsubscribes from the created bindings
     * @param {Refs} refs the map of references to the created elements
     */
    constructor(root, unsubscribe, refs) {
        this.root = root;
        this.unsubscribe = unsubscribe;
        this.refs = refs;
    }
}

/**
 * @param {string} textContent
 * @param {Map<number, Atom<string|null|boolean|number>|Computed<string|null|boolean|number>>} storage 
 * @return {{reactive: Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|null, content: string}[]}}
 */
function textToTextNodes(textContent, storage) {

    /** @type {{reactive: Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|null, content: string}[]} */
    let textNodes = [];
    let re = /\{{(\d+)}}/;
    let text = textContent;

    while (re.test(text)) {

        let match = re.exec(text);
        
        if (!match) {
            break;
        }

        let index = match[1];

        textNodes.push({
            content: text.slice(0, match.index),
            reactive: null
        });

        text = text.slice(match.index + match[0].length);

        let reactive = storage.get(parseInt(index));

        if (reactive) {
            textNodes.push({
                content: String(reactive.value),
                reactive
            });
        } else {
            textNodes.push({
                content: "{{" + index + "}}",
                reactive: null
            });

        }


    }

    textNodes.push({
        content: text,
        reactive: null
    });

    return textNodes;
}

/**
 * Returns true if the given value is an object and not an array.
 * @param {any} object
 * @returns {boolean}
 */
function isObject(object) {
    return object !== null && !isArray(object) && typeof object === "object"; // && (object).constructor.name == "Object"
}

/**
 * Returns true if the given value is an array.
 * @param {any} object
 * @returns {boolean}
 */
function isArray(object) {
    return Array.isArray(object);
}

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
function createCustomTaggedTemplate(options = {}) {
    let taggedTemplate = html.bind(options);
    return taggedTemplate
}

/**
 * Tagged template literal function, which can be used to bind reactive variables to HTML elements.
 * @template {{[key:string]:HTMLElement}} Refs
 * @param {TemplateStringsArray} literals
 * @param {...(Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|string|number|boolean)} expressions
 * @returns {Fragment<Refs>}
 */
function html(literals, ...expressions) {

    let options = isObject(this) ? this : {};

    /** @type {Map<number, Atom<string|null|boolean|number>|Computed<string|null|boolean|number>>} */
    let storage = new Map;
    /** @type {string[]} */
    let html_code = [];
    let strings = Array.from(literals);
    let unsubscribers = [];
    /** @type {{[key:string]:HTMLElement}} */
    let refs = {};

    strings[0] = literals[0].trimStart();
    strings[strings.length - 1] = literals[strings.length - 1].trimEnd();

    for (let i = 0; i < strings.length; i++) {
        html_code.push(strings[i]);

        if (expressions[i] == undefined) continue;

        if (expressions[i] instanceof Atom || expressions[i] instanceof Computed || expressions[i] instanceof Collection) {
            let reactive = expressions[i];
            // @ts-ignore
            storage.set(i, reactive);

            html_code.push(`{{${i}}}`);
        } else {
            html_code.push(String(expressions[i]));
        }

    }

    let doc = /** @type {Document} */ (options.document || globalThis.document);
    
    let code = html_code.join("").trim();
    let template = doc.createElement("template");
    template.innerHTML = code;

    if (template.content.childNodes.length > 1) throw new Error("Template literal contains multiple nodes");
    if (template.content.childNodes.length == 0) throw new Error("Template literal contains no nodes");

    let root = doc.importNode(template.content.childNodes[0], true);

    const tw = doc.createTreeWalker(root, 1 /* NodeFilter.SHOW_ELEMENT */ | 4 /* NodeFilter.SHOW_TEXT */);

    let currentNode;

    /** @type {{node: Node, textNodes: {reactive: Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|null, content: string}[]}[]} */
    let patchText = [];

    /** @type {{node: Node, attribute:Attr, reactive: Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|null}[]}[]} */
    let patchElement = [];

    while (currentNode = (tw.nextNode())) {

        if (currentNode.nodeType == 3 /* Node.TEXT_NODE */) {
            if (currentNode.textContent!== null) {
                let textNodes = textToTextNodes(currentNode.textContent, storage);
                patchText.push({ node: currentNode, textNodes: textNodes });    
            }
        }
        else if (currentNode.nodeType == 1 /* Node.ELEMENT_NODE*/) {

            // @ts-ignore
            let element = /** @type {HTMLElement} */ (currentNode);

            for (let i = 0; i < element.attributes.length; i++) {

                let attribute = element.attributes[i];

                if (attribute.name == "ref") {
                    refs[attribute.value] = element;
                    continue;
                }

                if (attribute.value.match(/^\{\{(\d+)\}\}$/)) {

                    attribute.value = attribute.value.replace(/\{\{(\d+)\}\}/, (m, /** @type {string} */ expression_id) => {

                        let reactive = storage.get(parseInt(expression_id));
                        if (reactive) {
                            patchElement.push({ node: element, attribute, reactive });
                        }

                        return "{{" + expression_id + "}}";
                    });
                }

            }

        }

    }

    for (let i = 0; i < patchText.length; i++) {

        let { node, textNodes } = patchText[i];

        for (let j = 0; j < textNodes.length; j++) {
            let childNode = doc.createTextNode(textNodes[j].content);
            let reactive = textNodes[j].reactive;
            if (reactive == null) continue;

            if (textNodes[j].reactive != null) {
                if (!(typeof reactive.value == "string" || typeof reactive.value == "number")) {
                    throw new Error("reactive variable must be a string for text binding");
                }

                // @ts-ignore
                let unsubscribe = bindToText(reactive, childNode, options);
                unsubscribers.push(unsubscribe);
            }

            node.parentNode?.insertBefore(childNode, node);
        }

        node.parentNode?.removeChild(node);
    }

    for (let i = 0; i < patchElement.length; i++) {

        let { node, attribute, reactive } = patchElement[i];

        //console.log(node, attribute.name, attribute.value, reactive.value);

        let element = /** @type {HTMLElement} */ (node);

        if (reactive == null) continue;

        switch (attribute.name) {
            case "v-text": {
                if (!(typeof reactive.value == "string" || typeof reactive.value == "number")) {
                    throw new Error("v-text can only be used with strings");
                }

                // @ts-ignore
                let unsubscribe = bindToText(reactive, element, options);
                unsubscribers.push(unsubscribe);
                element.removeAttribute("v-text");
                break;
            }
            case "v-html": {
                if (typeof reactive.value != "string") {
                    throw new Error("v-html can only be used with strings");
                }

                // @ts-ignore
                let unsubscribe = bindToHtml(reactive, element, options);
                unsubscribers.push(unsubscribe);
                element.removeAttribute("v-html");
                break;
            }

            case "v-show": {
                if (typeof reactive.value != "boolean") {
                    throw new Error("v-show can only be used with booleans");
                }

                // @ts-ignore
                let unsubscribe = bindToShow(reactive, element, options);
                unsubscribers.push(unsubscribe);
                element.removeAttribute("v-show");
                break;
            }
            case "v-disabled": {
                if (typeof reactive.value != "boolean") {
                    throw new Error("v-disabled can only be used with booleans");
                }

                // @ts-ignore
                let unsubscribe = bindToDisabled(reactive, element, options);
                unsubscribers.push(unsubscribe);
                element.removeAttribute("v-disabled");
                break;
            }

            default: {
                if (!(reactive.value == null || typeof reactive.value == "string")) {
                    throw new Error("reactive variable must be a string for attribute binding");
                }

                // @ts-ignore 
                let unsubscribe = bindToAttr(reactive, element, attribute.name, options);
                unsubscribers.push(unsubscribe);
            }
        }

    }

    let root_element = /** @type {HTMLElement} */( /** @type {any} */ root);
    let unsubscriber = () => {
        for (let i = 0; i < unsubscribers.length; i++) {
            unsubscribers[i]();
        }
    };
    
    let fragment = /** @type {Fragment<Refs>} */ (new Fragment(root_element, unsubscriber, refs));

    return fragment;
}

export { Fragment, ListItemHelper, ListItemSetterDetails, bindToAttr, bindToCheckbox, bindToCheckboxValues, bindToClassName, bindToCssClass, bindToDisabled, bindToHtml, bindToInputValue, bindToList, bindToMultipleSelect, bindToProperty, bindToRadios, bindToSelectElement, bindToShow, bindToText, createCustomTaggedTemplate, getDiffs, globalOptions, html };
