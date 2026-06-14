import { debounce } from '@supercat1337/store';

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

// @ts-check


// binder is intended for one-way bindings that do not attach DOM event listeners.
// For two-way bindings, implement custom cleanup logic directly.

/**
 * Binds a reactive item to an element using a custom setter function.
 * @template T
 * @template {object} C
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>} reactiveItem - The reactive item.
 * @param {(reactiveItem: import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>, element: HTMLElement, ctx: C, options: import("../types.d.ts").BinderOptions) => void} setter - Function that updates the element.
 * @param {C} [ctx] - Optional context object passed to setter.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options (debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function binder(element, reactiveItem, setter, ctx = /** @type {C} */ ({}), options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    const { debounceTime } = _options;

    setter(reactiveItem, element, ctx, _options);

    const unsubscribe = reactiveItem.subscribe(_details => {
        if (_options.autoDisconnect && !element.isConnected) {
            unsubscribe();
            return;
        }
        setter(reactiveItem, element, ctx, _options);
    }, debounceTime);

    return unsubscribe;
}

// @ts-check


/**
 * Setter for attribute binding.
 * @param {import("@supercat1337/store").Atom<string|null> | import("@supercat1337/store").Computed<string|null>} reactiveItem
 * @param {HTMLElement} element
 * @param {{attributeName: string}} ctx
 */
function setter$5(reactiveItem, element, ctx) {
    if (typeof reactiveItem.value === 'string') {
        element.setAttribute(ctx.attributeName, reactiveItem.value);
    } else if (reactiveItem.value == null) {
        element.removeAttribute(ctx.attributeName);
    }
}

/**
 * Binds a reactive value to an element's attribute. If value is null, attribute is removed.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<string|null> | import("@supercat1337/store").Computed<string|null>} reactiveItem - The reactive item.
 * @param {string} attributeName - Name of the attribute.
 * @param {import("../types.d.ts").AttributeBindingOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToAttribute(element, reactiveItem, attributeName, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    return binder(element, reactiveItem, setter$5, { attributeName }, _options);
}

// @ts-check


/**
 * Setter that assigns reactive value to element's property.
 * @template T
 * @param {import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>} reactiveItem
 * @param {HTMLElement} element
 * @param {{propertyName: string}} ctx
 */
function setter$4(reactiveItem, element, ctx) {
    // @ts-ignore
    element[ctx.propertyName] = reactiveItem.value;
}

/**
 * Binds a reactive value to an element's DOM property.
 * @template T
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<T> | import("@supercat1337/store").Computed<T>} reactiveItem - The reactive item.
 * @param {string} propertyName - Name of the property (e.g., 'innerHTML', 'className').
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToProperty(element, reactiveItem, propertyName, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    return binder(element, reactiveItem, setter$4, { propertyName }, _options);
}

// @ts-check


/**
 * Binds a reactive string/number value to the element's innerHTML.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToHtml(element, reactiveItem, options = {}) {
    return bindToProperty(element, reactiveItem, 'innerHTML', options);
}

// @ts-check


/**
 * Binds a reactive string value to the element's className property.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<string> | import("@supercat1337/store").Computed<string>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToClassString(element, reactiveItem, options = {}) {
    return bindToProperty(element, reactiveItem, 'className', options);
}

// @ts-check


/**
 * Setter toggles a CSS class based on boolean reactive value with optional invert.
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactiveItem
 * @param {HTMLElement} element
 * @param {{cssClassName: string}} ctx
 * @param {import("../types.d.ts").CssClassBindingOptions} options
 */
function setter$3(reactiveItem, element, ctx, options) {
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
function bindToCssClass(element, reactiveItem, cssClassName, options = {}) {
    const _options = Object.assign({}, globalOptions, { invert: false }, options);
    const ctx = { cssClassName };
    return binder(element, reactiveItem, setter$3, ctx, _options);
}

// @ts-check


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
function bindToShow(element, reactiveItem, options = {}) {
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

// @ts-check

/**
 * Two-way binding between a checkbox and a boolean Atom.
 * @param {HTMLInputElement} checkbox - The checkbox element.
 * @param {import("@supercat1337/store").Atom<boolean>} reactiveItem - The reactive boolean atom.
 * @param {import("../../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToCheckbox(checkbox, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    const { debounceTime, autoDisconnect, event: eventName } = _options;

    /** @param {boolean} value  */
    function setter(value) {
        checkbox.checked = value;
    }

    const changeHandler = () => {
        reactiveItem.value = checkbox.checked;
    };

    setter(reactiveItem.value);
    checkbox.addEventListener(eventName, changeHandler);

    const storeUnsubscribe = reactiveItem.subscribe(details => {
        if (autoDisconnect && !checkbox.isConnected) {
            cleanup();
            return;
        }
        setter(details.value);
    }, debounceTime);

    function cleanup() {
        checkbox.removeEventListener(eventName, changeHandler);
        storeUnsubscribe();
    }

    return cleanup;
}

// @ts-check


/**
 * Two-way binding between an input/textarea and a string/number Atom.
 * @param {HTMLInputElement|HTMLTextAreaElement} element - The input or textarea element.
 * @param {import("@supercat1337/store").Atom<string|number>} reactiveItem - The reactive atom.
 * @param {import("../../types.d.ts").TwoWayBindingOptions & { event?: string }} [options={}] - Options (lazy, event, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToInput(element, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, { lazy: false }, options);
    const { debounceTime, lazy, autoDisconnect, event: eventName } = _options;

    /** @param {string|number} value  */
    function setter(value) {
        let strValue = String(value);
        if (element.type === 'number') {
            const num = parseFloat(strValue);
            if (isNaN(num)) {
                if (element.value !== '') {
                    element.value = '';
                }
                return;
            }
            strValue = num.toString();
        }
        if (element.value !== strValue) {
            element.value = strValue;
        }
    }

    // debounce from @supercat1337/store returns the same wrapped function reference each time,
    // so it's safe to use inputHandler directly for addEventListener and removeEventListener.
    const inputHandler = debounce(() => {
        const newValue = element.value;
        if (element.type === 'number') {
            const num = parseFloat(newValue);
            reactiveItem.value = isNaN(num) ? 0 : num;
        } else {
            reactiveItem.value = newValue;
        }
    }, debounceTime);

    const finalEventName = eventName || (lazy || element.type === 'number' ? 'change' : 'input');
    element.addEventListener(finalEventName, inputHandler);

    setter(reactiveItem.value);

    const storeUnsubscribe = reactiveItem.subscribe(details => {
        if (autoDisconnect && !element.isConnected) {
            cleanup();
            return;
        }
        setter(details.value);
    }, debounceTime);

    function cleanup() {
        element.removeEventListener(finalEventName, inputHandler);
        storeUnsubscribe();
    }

    return cleanup;
}

// @ts-check

/**
 * Compares two objects and returns information about their differences.
 * @template {{[key:string]:any}} T
 * @param {T} newObject
 * @param {any} oldObject
 * @param {(a:any, b:any)=>boolean} [customCompareFunction] - Returns true if values are equal.
 * @returns {{[key in keyof T]:boolean}} - true if the property has changed.
 */
function getDiffs(newObject, oldObject, customCompareFunction) {
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

// @ts-check


const itemIndexAttrName = 'item-index';

/** @typedef {(listItemHelper:ListItemHelper)=>HTMLElement} TypeItemCreator */

/**
 * @template T
 */
class ElementList {
    /** @type {HTMLElement} */
    #rootListElement;

    /** @type {import("@supercat1337/store").Collection<T>} */
    #collection;

    /** @type {(listItemHelper:ListItemHelper, details:ListItemSetterDetails<T>)=>void} */
    #itemValueSetter;

    /** @type {TypeItemCreator} */
    #elementItemCreator;

    /** @type {ListItemHelper} */
    #listItemHelper;

    /**
     * Initializes the ElementList instance.
     * @param {import("@supercat1337/store").Collection<T>} collection - The collection of items.
     * @param {HTMLElement} element - The HTML element that contains the list.
     * @param {{(listItemHelper:ListItemHelper, details:ListItemSetterDetails<T>):void}} itemValueSetter - Function to set value of a single list item.
     * @param {TypeItemCreator} [elementItemCreator] - Optional custom element creator.
     */
    constructor(collection, element, itemValueSetter, elementItemCreator) {
        this.#collection = collection;
        this.#rootListElement = element;

        this.#listItemHelper = new ListItemHelper(this.#loadTemplate());
        this.#rootListElement.innerHTML = '';

        if (elementItemCreator) {
            this.#elementItemCreator = () => {
                return elementItemCreator(this.#listItemHelper);
            };
        } else {
            if (this.#listItemHelper.hasTemplate()) {
                this.#elementItemCreator = () => {
                    const itemElement = this.#listItemHelper.getTemplate();
                    if (itemElement == null) {throw new Error(`template is not set`);}
                    return itemElement;
                };
            } else {
                throw new Error(`elementItemCreator or template is not set`);
            }
        }
        this.#itemValueSetter = itemValueSetter;
        this.setData(this.#collection.value);
    }

    /**
     * Loads the first child element as template.
     * @returns {HTMLElement|undefined}
     */
    #loadTemplate() {
        const listItem = this.#rootListElement.firstElementChild;
        if (listItem) {
            const listItemTemplate = /** @type {HTMLElement} */ (listItem.cloneNode(true));
            return listItemTemplate;
        }
        return;
    }

    /**
     * Removes the element at the specified index.
     * @param {number} index
     */
    removeElementListItem(index) {
        this.#rootListElement.children.item(index)?.remove();
    }

    /**
     * Removes the last child element.
     */
    removeLastElementListItem() {
        this.#rootListElement.lastElementChild?.remove();
    }

    /**
     * Sets the value of the element at the specified index.
     * @param {number} index
     * @param {T} value
     * @param {any} oldValue
     */
    setElementItemValue(index, value, oldValue) {
        const listItem = /** @type {HTMLElement} */ (this.#rootListElement.children.item(index));
        if (!listItem) {return;}

        listItem.setAttribute(itemIndexAttrName, String(index));

        const details = new ListItemSetterDetails(
            listItem,
            index,
            value,
            oldValue,
            this.#collection.value.length
        );
        this.#itemValueSetter(this.#listItemHelper, details);
    }

    /**
     * Sets the data for the entire list.
     * @param {T[]} arr
     */
    setData(arr) {
        this.setElementListSize(arr.length);
        for (let index = 0; index < arr.length; index++) {
            this.setElementItemValue(index, arr[index], undefined);
        }
    }

    /**
     * Sets the size of the list, adding or removing elements as necessary.
     * @param {number} size
     */
    setElementListSize(size) {
        const rootList = this.#rootListElement;
        const listItemsLength = rootList.children.length;

        if (listItemsLength === size) {return;}

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
     * Appends a new element to the list.
     * @param {T} value
     * @param {number} index
     */
    appendElementListItem(value, index) {
        const elementItem = this.#elementItemCreator(this.#listItemHelper);
        this.#rootListElement.append(elementItem);
        this.setElementItemValue(index, value, undefined);
    }
}

/**
 * Returns the list item element by attribute.
 * @param {HTMLElement} element
 * @param {string} [attrName]
 * @returns {HTMLElement|null}
 */
function getListItem(element, attrName) {
    const searchAttr = attrName || itemIndexAttrName;
    const value = element.getAttribute(searchAttr);
    if (value !== null) {return element;}
    return element.closest(`[${searchAttr}]`);
}

/**
 * Returns the index of the list item element.
 * @param {HTMLElement} element
 * @returns {number}
 */
function getListItemIndex(element) {
    const listItem = getListItem(element);
    if (!listItem) {return -1;}
    const index = listItem.getAttribute(itemIndexAttrName);
    if (index === null) {return -1;}
    return parseInt(index);
}

/**
 * @template T
 */
class ListItemSetterDetails {
    /** @type {HTMLElement} */
    itemElement;
    /** @type {number} */
    index;
    /** @type {T} */
    value;
    /** @type {any} */
    oldValue;
    /** @type {number} */
    length;

    /**
     * @param {HTMLElement} itemElement - The list item element.
     * @param {number} index - The index.
     * @param {T} value - The new value.
     * @param {any} oldValue - The old value.
     * @param {number} length - The list length.
     */
    constructor(itemElement, index, value, oldValue, length) {
        this.itemElement = itemElement;
        this.index = index;
        this.value = value;
        this.oldValue = oldValue;
        this.length = length;
    }
}

class ListItemHelper {
    /** @type {HTMLElement|null} */
    #templateElement = null;

    /**
     * @param {HTMLElement} [templateElement] - The template HTML element.
     */
    constructor(templateElement) {
        if (templateElement) {
            this.#templateElement = templateElement;
        }
    }

    /**
     * Returns true if a template element is set.
     * @returns {boolean}
     */
    hasTemplate() {
        return this.#templateElement != null;
    }

    /**
     * Returns a clone of the template element.
     * @returns {HTMLElement|null}
     */
    getTemplate() {
        if (this.#templateElement == null) {return null;}
        return /** @type {HTMLElement} */ (this.#templateElement.cloneNode(true));
    }

    /**
     * Returns the index of the list item element.
     * @param {HTMLElement} element
     * @returns {number}
     */
    getListItemIndex(element) {
        return getListItemIndex(element);
    }

    /**
     * Returns the list item element by child node.
     * @param {HTMLElement} element
     * @param {string} [attrName]
     * @returns {HTMLElement|null}
     */
    getListItem(element, attrName) {
        return getListItem(element, attrName);
    }

    /**
     * Compares two objects and returns info about their differences.
     * @template {{[key:string]:any}} T
     * @param {T} newObject
     * @param {any} oldObject
     * @param {(a:any, b:any)=>boolean} [customCompareFunction]
     * @returns {{[key in keyof T]:boolean}}
     */
    getDiffs(newObject, oldObject, customCompareFunction) {
        return getDiffs(newObject, oldObject, customCompareFunction);
    }
}

/**
 * Binds a reactive collection to a list element, synchronising DOM items.
 * @template T
 * @param {HTMLElement} listElement - The container element (e.g., ul, ol).
 * @param {import("@supercat1337/store").Collection<T>} reactiveItem - The reactive collection.
 * @param {(listItemHelper:ListItemHelper, details:ListItemSetterDetails<T>) => void} itemValueSetter - Function to update an item element.
 * @param {TypeItemCreator} [elementItemCreator] - Optional custom element creator.
 * @param {import("../types.d.ts").BindToListOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToList(
    listElement,
    reactiveItem,
    itemValueSetter,
    elementItemCreator,
    options = {}
) {
    const elementListWrapper = new ElementList(
        reactiveItem,
        listElement,
        itemValueSetter,
        elementItemCreator
    );
    const _options = Object.assign({}, globalOptions, options);
    const { autoDisconnect } = _options;

    const unsubscribe = reactiveItem.subscribe(details => {
        if (autoDisconnect && !listElement.isConnected) {
            unsubscribe();
            return;
        }

        if (details.property === null) {
            elementListWrapper.setData(details.value);
            return;
        }

        if (details.property === 'length') {
            elementListWrapper.setElementListSize(reactiveItem.value.length);
            return;
        }

        const index = parseInt(details.property);
        if (isNaN(index)) {return;}

        if (details.eventType === 'set') {
            elementListWrapper.setElementItemValue(index, details.value, details.oldValue);
        } else if (details.eventType === 'delete') {
            elementListWrapper.removeElementListItem(index);
        }
    }, 0);

    return unsubscribe;
}

// @ts-check


/**
 * Binds a boolean reactive value to the element's disabled property.
 * @param {HTMLButtonElement|HTMLInputElement|HTMLFieldSetElement|HTMLLinkElement|HTMLOptGroupElement|HTMLOptionElement|HTMLSelectElement|HTMLTextAreaElement|HTMLStyleElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<boolean> | import("@supercat1337/store").Computed<boolean>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToDisabled(element, reactiveItem, options = {}) {
    return bindToProperty(/** @type {HTMLElement} */ (element), reactiveItem, 'disabled', options);
}

// @ts-check

/**
 * Two-way binding between a collection of strings and a set of checkboxes with matching values.
 * @param {HTMLInputElement[]} checkboxes - Array of checkbox elements.
 * @param {import("@supercat1337/store").Collection<string>} collection - The reactive collection (array of selected values).
 * @param {import("../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToCheckboxGroup(checkboxes, collection, options = {}) {
    if (checkboxes.length === 0) {return () => {};}

    const _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    const { debounceTime, autoDisconnect, event: eventName } = _options;

    // Build value -> checkbox map
    const valueToCheckbox = {};
    for (let i = 0; i < checkboxes.length; i++) {
        // @ts-ignore
        valueToCheckbox[checkboxes[i].value] = checkboxes[i];
    }

    function updateCheckboxes() {
        const selectedValues = collection.value;
        for (let i = 0; i < checkboxes.length; i++) {
            const cb = checkboxes[i];
            cb.checked = selectedValues.indexOf(cb.value) !== -1;
        }
    }

    const changeHandler = () => {
        const selected = [];
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                selected.push(checkboxes[i].value);
            }
        }
        collection.value = selected;
    };

    updateCheckboxes();

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener(eventName, changeHandler);
    }

    const storeUnsubscribe = collection.subscribe(_details => {
        if (autoDisconnect && !checkboxes[0]?.isConnected) {
            cleanup();
            return;
        }
        updateCheckboxes();
    }, debounceTime);

    function cleanup() {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].removeEventListener(eventName, changeHandler);
        }
        storeUnsubscribe();
    }

    return cleanup;
}

// @ts-check

/**
 * Two-way binding for a group of radio buttons with a string Atom.
 * @param {HTMLInputElement[]} radios - Array of radio input elements (must share same name).
 * @param {import("@supercat1337/store").Atom<string>} reactive - The reactive atom.
 * @param {import("../../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToRadioGroup(radios, reactive, options = {}) {
    if (radios.length === 0) {return () => {};}

    const _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    const { debounceTime, autoDisconnect, event: eventName } = _options;

    const radioName = radios[0].name;
    if (!radioName) {return () => {};}

    /** @type {Record<string, HTMLInputElement>} */
    const valueToRadio = {};
    for (let i = 0; i < radios.length; i++) {
        const radio = radios[i];
        if (radio.name === radioName && radio.value !== '') {
            valueToRadio[radio.value] = radio;
        }
    }

    /**
     * @param {string} value
     */
    function setter(value) {
        const radio = valueToRadio[value];
        if (radio && !radio.checked) {
            radio.checked = true;
        }
    }

    /** @param {Event} e */
    const changeHandler = e => {
        const target = /** @type {HTMLInputElement} */ (e.target);
        if (target && target.name === radioName) {
            reactive.value = target.value;
        }
    };

    setter(reactive.value);

    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener(eventName, changeHandler);
    }

    const storeUnsubscribe = reactive.subscribe(details => {
        if (autoDisconnect && !radios[0]?.isConnected) {
            cleanup();
            return;
        }
        setter(details.value);
    }, debounceTime);

    function cleanup() {
        for (let i = 0; i < radios.length; i++) {
            radios[i].removeEventListener(eventName, changeHandler);
        }
        storeUnsubscribe();
    }

    return cleanup;
}

// @ts-check

/**
 * Two-way binding for a multiple-select element with a Collection of strings.
 * @param {HTMLSelectElement} selectElement - The multiple select element.
 * @param {import("@supercat1337/store").Collection<string>} reactive - The reactive collection (array of selected values).
 * @param {import("../../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToSelectMultiple(selectElement, reactive, options = {}) {
    const _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    const { debounceTime, autoDisconnect, event: eventName } = _options;

    function updateSelectedOptions() {
        const selectedValues = reactive.value;
        const options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            option.selected = selectedValues.indexOf(option.value) !== -1;
        }
    }

    updateSelectedOptions();

    const changeHandler = () => {
        const selected = Array.from(selectElement.selectedOptions).map(opt => opt.value);
        reactive.value = selected;
    };

    selectElement.addEventListener(eventName, changeHandler);

    const storeUnsubscribe = reactive.subscribe(_details => {
        if (autoDisconnect && !selectElement.isConnected) {
            cleanup();
            return;
        }
        updateSelectedOptions();
    }, debounceTime);

    function cleanup() {
        selectElement.removeEventListener(eventName, changeHandler);
        storeUnsubscribe();
    }

    return cleanup;
}

// @ts-check

/**
 * Two-way binding for a single-select element with a string Atom.
 * @param {HTMLSelectElement} selectElement - The select element.
 * @param {import("@supercat1337/store").Atom<string>} reactive - The reactive atom.
 * @param {import("../../types.d.ts").BinderOptions & { event?: string }} [options={}] - Options (event, debounceTime, autoDisconnect).
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToSelect(selectElement, reactive, options = {}) {
    const _options = Object.assign({}, globalOptions, { event: 'change' }, options);
    const { debounceTime, autoDisconnect, event: eventName } = _options;

    /** @param {string} value  */
    function setter(value) {
        selectElement.value = value;
    }

    setter(reactive.value);

    const callback = () => {
        reactive.value = selectElement.value;
    };

    selectElement.addEventListener(eventName, callback);

    const unsubscribe = reactive.subscribe(details => {
        if (autoDisconnect && !selectElement.isConnected) {
            unsubscribe();
            return;
        }
        setter(details.value);
    }, debounceTime);

    return () => {
        selectElement.removeEventListener(eventName, callback);
        unsubscribe();
    };
}

// @ts-check


/**
 * Setter for style binding. Supports string (cssText) or object.
 * @param {import("@supercat1337/store").Atom<string|Record<string,string>> | import("@supercat1337/store").Computed<string|Record<string,string>>} reactiveItem
 * @param {HTMLElement} element
 */
function setter$2(reactiveItem, element) {
    const value = reactiveItem.value;
    if (typeof value === 'string') {
        element.style.cssText = value;
    } else if (value && typeof value === 'object') {
        // Clear all existing inline styles
        element.style.cssText = '';
        // Apply new styles
        Object.assign(element.style, value);
    }
}

/**
 * Binds a reactive string or style object to the element's style.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<string|Record<string,string>> | import("@supercat1337/store").Computed<string|Record<string,string>>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToStyle(element, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    return binder(element, reactiveItem, setter$2, {}, _options);
}

// @ts-check


/**
 * Setter for dataset binding. Expects an object; each key becomes a data-* attribute.
 * @param {import("@supercat1337/store").Atom<Record<string,string>> | import("@supercat1337/store").Computed<Record<string,string>>} reactiveItem
 * @param {HTMLElement} element
 */
function setter$1(reactiveItem, element) {
    const data = reactiveItem.value;
    if (data && typeof data === 'object') {
        // Remove old data-* attributes not present in new object
        for (const attr of element.getAttributeNames()) {
            if (attr.startsWith('data-')) {
                const key = attr.slice(5);
                if (!(key in data)) {
                    element.removeAttribute(attr);
                }
            }
        }
        // Set new ones
        for (const [key, value] of Object.entries(data)) {
            element.dataset[key] = value;
        }
    } else if (data == null) {
        // Remove all data-* attributes
        for (const attr of element.getAttributeNames()) {
            if (attr.startsWith('data-')) {
                element.removeAttribute(attr);
            }
        }
    }
}

/**
 * Binds a reactive object to the element's dataset (data-* attributes).
 * The reactive item must provide an object where keys map to data-* attribute names.
 * @param {HTMLElement} element - The DOM element.
 * @param {import("@supercat1337/store").Atom<Record<string,string>> | import("@supercat1337/store").Computed<Record<string,string>>} reactiveItem - The reactive item (object).
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToDataset(element, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    return binder(element, reactiveItem, setter$1, {}, _options);
}

// @ts-check


/**
 * Setter for textContent binding.
 * @param {import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactiveItem
 * @param {HTMLElement|Text} element
 */
function setter(reactiveItem, element) {
    element.textContent = String(reactiveItem.value);
}

/**
 * Binds a reactive string/number value to the element's textContent.
 * @param {HTMLElement|Text} element - The DOM element or text node.
 * @param {import("@supercat1337/store").Atom<string|number> | import("@supercat1337/store").Computed<string|number>} reactiveItem - The reactive item.
 * @param {import("../types.d.ts").BinderOptions} [options={}] - Options.
 * @returns {import("@supercat1337/store").Unsubscriber}
 */
function bindToText(element, reactiveItem, options = {}) {
    const _options = Object.assign({}, globalOptions, options);
    const { debounceTime, autoDisconnect } = _options;

    setter(reactiveItem, element);

    const unsubscribe = reactiveItem.subscribe(_details => {
        if (autoDisconnect && !element.isConnected) {
            unsubscribe();
            return;
        }
        setter(reactiveItem, element);
    }, debounceTime);

    return unsubscribe;
}

export { ListItemHelper, ListItemSetterDetails, bindToAttribute, bindToCheckbox, bindToCheckboxGroup, bindToClassString, bindToCssClass, bindToDataset, bindToDisabled, bindToHtml, bindToInput, bindToList, bindToProperty, bindToRadioGroup, bindToSelect, bindToSelectMultiple, bindToShow, bindToStyle, bindToText, getDiffs, globalOptions };
