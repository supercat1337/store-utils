# AI Documentation: @supercat1337/store-utils

**DOM binding utilities for `@supercat1337/store`**  
~13 KB (core) + utilities, depends on `@supercat1337/store`, auto‑cleanup, custom events, full TypeScript support via JSDoc.

---

## Table of Contents

1. [Installation & Import](#installation--import)
2. [Core Concepts](#core-concepts)
3. [One‑Way Bindings](#one-way-bindings)
4. [Two‑Way Bindings](#two-way-bindings)
5. [List Binding](#list-binding)
6. [Utilities & Helpers](#utilities--helpers)
7. [Global Options](#global-options)
8. [TypeScript](#typescript)
9. [Examples](#examples)

---

## Installation & Import

```bash
npm install @supercat1337/store-utils
```

```javascript
import { bindToInput, bindToShow, ... } from '@supercat1337/store-utils';
```

---

## Core Concepts

- **`Atom`** – reactive primitive value.
- **`Computed`** – derived reactive value.
- **`Collection`** – reactive array.
- **Bindings** – functions that connect reactive items to DOM elements.
- **`autoDisconnect`** – when `true` (default), the binding automatically unsubscribes when the target element is removed from DOM.

All bindings accept an optional `options` object with:

- `debounceTime?: number` (default `0`)
- `autoDisconnect?: boolean` (default `true`)
- `signal?: AbortSignal` – if provided, the binding will automatically unsubscribe when the signal is aborted. Useful for integration with component lifecycles (e.g., React `useEffect`, Vue `onUnmounted`).
- plus binding‑specific options.

---

## One‑Way Bindings

These bindings update the DOM when the reactive value changes, but not vice versa.

### `bindToAttribute(element, reactive, attributeName, options?)`

- `element: HTMLElement`
- `reactive: Atom<string\|null> | Computed<string\|null>`
- If value is `null`, attribute is removed.

### `bindToClassString(element, reactive, options?)`

- `element: HTMLElement`
- `reactive: Atom<string> | Computed<string>`
- Sets `element.className`.

### `bindToClassToggle(element, reactive, className, options?)`

- `element: HTMLElement`
- `reactive: Atom<boolean> | Computed<boolean>`
- `className: string`
- Options: `invert?: boolean` (default `false`). When `invert: false`, class is added when `reactive.value === true`.

### `bindToDisabled(element, reactive, options?)`

- Works on `HTMLButtonElement | HTMLInputElement | HTMLSelectElement | ...`
- Sets `element.disabled`.

### `bindToHtml(element, reactive, options?)`

- Sets `element.innerHTML`.

### `bindToProperty(element, reactive, propertyName, options?)`

- Generic property binder.

### `bindToShow(element, reactive, options?)`

- Options: `hideClassName?: string` (default `'d-none'`), `invert?: boolean` (default `false`).
- When `invert: false`, the `hideClassName` is added when `reactive.value === false` (element hidden). Equivalent to `bindToClassToggle(element, reactive, hideClassName, { invert: true })`.

### `bindToStyle(element, reactive, options?)`

- Accepts string (cssText) or object (style properties). On object update, clears all existing inline styles before applying new ones.

### `bindToDataset(element, reactive, options?)`

- Accepts object `{ key: value }`. Replaces all `data-*` attributes; removes attributes not present in the new object. Passing `null` removes all.

### `bindToText(element, reactive, options?)`

- Works on `HTMLElement` or `Text` node. Sets `textContent`.

---

## Two‑Way Bindings

These sync DOM events back to the reactive item.

### `bindToCheckbox(checkbox, reactive, options?)`

- `checkbox: HTMLInputElement` (type checkbox)
- `reactive: Atom<boolean>`
- Options: `event?: string` (default `'change'`).

### `bindToCheckboxGroup(checkboxes, collection, options?)`

- `checkboxes: HTMLInputElement[]` (all type checkbox)
- `reactive: Collection<string>`
- Options: `event?: string` (default `'change'`).  
  Updates collection when any checkbox is toggled; updates checkboxes when collection changes.

### `bindToInput(input, reactive, options?)`

- `input: HTMLInputElement | HTMLTextAreaElement`
- `reactive: Atom<string | number>`
- Options: `lazy?: boolean` (default `false`), `event?: string` (overrides `lazy`).  
  For `type="number"`, invalid inputs reset to `0`.

### `bindToRadioGroup(radios, reactive, options?)`

- `radios: HTMLInputElement[]` (all type radio, same `name`)
- `reactive: Atom<string>`
- Options: `event?: string` (default `'change'`).

### `bindToSelect(select, reactive, options?)`

- `select: HTMLSelectElement` (single‑select)
- `reactive: Atom<string>`
- Options: `event?: string` (default `'change'`).

### `bindToSelectMultiple(select, reactive, options?)`

- `select: HTMLSelectElement` (with `multiple` attribute)
- `reactive: Collection<string>`
- Options: `event?: string` (default `'change'`).

All two‑way bindings return an `Unsubscriber` function that removes event listeners and store subscriptions. They also respect `autoDisconnect`.

---

## List Binding

### `bindToList(container, collection, itemSetter, itemCreator?, options?)`

- `container: HTMLElement` – the element that will contain the list items.
- `collection: Collection<T>` – reactive array.
- `itemSetter: (helper: ListItemHelper, details: ListItemSetterDetails<T>) => void` – called for each item to update its DOM content.
- `itemCreator?: (helper: ListItemHelper) => HTMLElement` – optional custom element factory. If not provided, the first child of `container` is cloned as template.
- `options: { debounceTime?, autoDisconnect? }`

**How it works:**

- When `collection.value` changes, the DOM is updated minimally.
- For `eventType === 'set'` on an index, `itemSetter` is called with the new value and the existing DOM element.
- For changes in length, elements are added or removed at the end.
- Full replacement (`property === null`) triggers a full rerender.

### `ListItemHelper` methods:

- `hasTemplate(): boolean`
- `getTemplate(): HTMLElement | null` – returns a clone of the template.
- `getListItemIndex(element: HTMLElement): number`
- `getListItem(element: HTMLElement, attrName?: string): HTMLElement | null`
- `getDiffs(newObj, oldObj, compareFn?)` – same as standalone `getDiffs`.

### `ListItemSetterDetails<T>` properties:

- `itemElement: HTMLElement`
- `index: number`
- `value: T`
- `oldValue: any`
- `length: number`

---

## Utilities & Helpers

### `getDiffs(newObject, oldObject, customCompareFunction?)`

- Returns an object with the same keys as `newObject`, value `true` if the property is new or changed.
- `customCompareFunction` receives `(a, b)` and should return `true` if they are **equal**.

### `globalOptions`

Global defaults object that you can mutate:

```javascript
import { globalOptions } from '@supercat1337/store-utils';
globalOptions.debounceTime = 100;
globalOptions.autoDisconnect = false;
```

---

## TypeScript

The package includes `types.d.ts` – no additional configuration needed. Use JSDoc in your own project or import types:

```typescript
import type {
    BinderOptions,
    ListItemHelper,
    ListItemSetterDetails,
} from '@supercat1337/store-utils';
```

---

## Examples

### Counter with controls

```javascript
import { Store } from '@supercat1337/store';
import {
    bindToInput,
    bindToCheckbox,
    bindToClassToggle,
    bindToShow,
} from '@supercat1337/store-utils';

const store = new Store();
const count = store.createAtom(0);
const enabled = store.createAtom(true);
const visible = store.createAtom(true);
const danger = store.createAtom(false);

const input = document.querySelector('input');
bindToInput(input, count);

const enableCheck = document.querySelector('#enable');
bindToCheckbox(enableCheck, enabled);

const visibleCheck = document.querySelector('#visible');
bindToShow(document.querySelector('.counter'), visibleCheck);

const dangerCheck = document.querySelector('#danger');
bindToClassToggle(document.querySelector('.value'), dangerCheck, 'text-danger');
```

### Todo list

```javascript
const todos = store.createCollection([]);
const container = document.querySelector('ul');

bindToList(
    container,
    todos,
    (helper, details) => {
        const li = details.itemElement;
        const span = li.querySelector('span');
        if (helper.getDiffs({ text: details.value }, { text: details.oldValue }).text) {
            span.textContent = details.value.text;
        }
    },
    null,
    { autoDisconnect: true }
);
```

### Using AbortSignal for automatic cleanup

All bindings support the `signal` option, which allows you to automatically unbind when an `AbortSignal` is aborted. This is especially useful in component frameworks.

```javascript
const controller = new AbortController();

const unsubscribe = bindToInput(inputElement, nameAtom, { signal: controller.signal });

// Later, when the component unmounts:
controller.abort(); // automatically cleans up the binding
```

---

## License

MIT
