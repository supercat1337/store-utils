// @ts-check

import { globalOptions } from './../globalOptions.js';
import { getDiffs } from '../utils/helpers.js';
import { attachAbortSignal } from '../utils/abort-helper.js';

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
                    if (itemElement == null) {
                        throw new Error(`template is not set`);
                    }
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
        if (!listItem) {
            return;
        }

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

        if (listItemsLength === size) {
            return;
        }

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
    if (value !== null) {
        return element;
    }
    return element.closest(`[${searchAttr}]`);
}

/**
 * Returns the index of the list item element.
 * @param {HTMLElement} element
 * @returns {number}
 */
function getListItemIndex(element) {
    const listItem = getListItem(element);
    if (!listItem) {
        return -1;
    }
    const index = listItem.getAttribute(itemIndexAttrName);
    if (index === null) {
        return -1;
    }
    return parseInt(index);
}

/**
 * @template T
 */
export class ListItemSetterDetails {
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

export class ListItemHelper {
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
        if (this.#templateElement == null) {
            return null;
        }
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
export function bindToList(
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
    const { autoDisconnect, signal } = _options;

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
        if (isNaN(index)) {
            return;
        }

        if (details.eventType === 'set') {
            elementListWrapper.setElementItemValue(index, details.value, details.oldValue);
        } else if (details.eventType === 'delete') {
            elementListWrapper.removeElementListItem(index);
        }
    }, 0);

    const removeAbortListener = attachAbortSignal(signal, unsubscribe);

    return () => {
        unsubscribe();
        removeAbortListener();
    };
}
