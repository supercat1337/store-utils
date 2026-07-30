// src/types.d.ts

// ========== Options ==========
export interface BinderOptions {
    /** Debounce time in milliseconds for the subscription (default 0) */
    debounceTime?: number;
    /** Automatically disconnect when element is removed from DOM (default false) */
    autoDisconnect?: boolean;
    /**
     * AbortSignal that will trigger automatic unbinding when aborted.
     * Useful for component lifecycle integration.
     */
    signal?: AbortSignal;
}

export interface AttributeBindingOptions extends BinderOptions {
    attributeName?: string;
}

export interface TwoWayBindingOptions extends BinderOptions {
    /** For input bindings: if true, updates on "change" instead of "input" (default false) */
    lazy?: boolean;
    /** Custom event name (e.g., 'change', 'input'). Overrides lazy inference. */
    event?: string;
}

export interface CssClassBindingOptions extends BinderOptions {
    /** If true, toggles class opposite to the reactive value (default false) */
    invert?: boolean;
}

export interface ShowBindingOptions extends BinderOptions {
    /** CSS class used to hide element (default "d-none") */
    hideClassName?: string;
    /** If true, inverts the logic: class added when value is true (default false) */
    invert?: boolean;
}

export interface BindToListOptions extends BinderOptions {
    autoDisconnect?: boolean;
}

// ========== List helpers ==========
export class ListItemHelper {
    constructor(template_element?: HTMLElement);
    hasTemplate(): boolean;
    getTemplate(): HTMLElement | null;
    getListItemIndex(element: HTMLElement): number;
    getListItem(element: HTMLElement, attr_name?: string): HTMLElement | null;
    getDiffs<T extends Record<string, any>>(
        new_object: T,
        old_object: any,
        custom_compare_function?: (a: any, b: any) => boolean
    ): { [K in keyof T]: boolean };
}

export type TypeItemCreator = (listItemHelper: ListItemHelper) => HTMLElement;

export class ListItemSetterDetails<T = any> {
    itemElement: HTMLElement;
    index: number;
    value: T;
    oldValue: any;
    length: number;
    constructor(itemElement: HTMLElement, index: number, value: T, oldValue: any, length: number);
}
