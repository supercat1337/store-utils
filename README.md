# @supercat1337/store-utils

A collection of DOM binding utilities for reactive stores created by [@supercat1337/store](https://github.com/supercat1337/store).

## Installation

```bash
npm install @supercat1337/store-utils
```

## Features

- One‑way and two‑way bindings between reactive atoms/collections and DOM elements
- Automatic cleanup when elements are removed from DOM (`autoDisconnect: true` by default)
- Support for custom event names in two‑way bindings
- TypeScript support via JSDoc (includes `.d.ts`)

## Quick Example

```javascript
import { Store } from '@supercat1337/store';
import {
    bindToInput,
    bindToCheckbox,
    bindToClassToggle,
    bindToShow,
} from '@supercat1337/store-utils';

const store = new Store();
const count = store.createAtom(10);
const enabled = store.createAtom(true);
const visible = store.createAtom(true);
const danger = store.createAtom(false);

// Two-way binding with input
const input = document.querySelector('input');
bindToInput(input, count);

// Two-way binding with checkbox
const checkbox = document.querySelector('#enable');
bindToCheckbox(checkbox, enabled);

// Toggle CSS class when danger is true
const span = document.querySelector('.counter');
bindToClassToggle(span, danger, 'text-danger');

// Show/hide element
const container = document.querySelector('.container');
bindToShow(container, visible);
```

## API Reference

### One‑way bindings

| Function                                                    | Description                                                                                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `bindToAttribute(element, reactive, attrName, options?)`    | Sets/removes an attribute based on reactive string or null.                                                                  |
| `bindToClassString(element, reactive, options?)`            | Sets `element.className` from a reactive string.                                                                             |
| `bindToClassToggle(element, reactive, className, options?)` | Toggles a CSS class based on boolean value. Option `invert` flips the logic.                                                 |
| `bindToDisabled(element, reactive, options?)`               | Sets `element.disabled` from a reactive boolean.                                                                             |
| `bindToHtml(element, reactive, options?)`                   | Sets `element.innerHTML` from a reactive string/number.                                                                      |
| `bindToProperty(element, reactive, propName, options?)`     | Sets any DOM property from a reactive value.                                                                                 |
| `bindToShow(element, reactive, options?)`                   | Toggles visibility via a CSS class (default `d-none`). Class is applied when value is `false`. Option `invert` changes that. |
| `bindToStyle(element, reactive, options?)`                  | Sets `element.style.cssText` from a reactive string, or applies an object of styles (replaces all).                          |
| `bindToDataset(element, reactive, options?)`                | Sets `data-*` attributes from a reactive object (keys become `data-key`). Replaces entire dataset.                           |
| `bindToText(element, reactive, options?)`                   | Sets `element.textContent` from a reactive string/number.                                                                    |

### Two‑way bindings

| Function                                                | Description                                                                                                                  |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `bindToCheckbox(checkbox, reactive, options?)`          | Syncs checkbox `checked` property with a boolean atom. Listens to `change` event by default.                                 |
| `bindToCheckboxGroup(checkboxes, collection, options?)` | Syncs a group of checkboxes with a collection of strings (selected values). Listens to `change` event.                       |
| `bindToInput(input, reactive, options?)`                | Syncs input/textarea value with a string/number atom. By default listens to `input` event (or `change` for `type="number"`). |
| `bindToRadioGroup(radios, reactive, options?)`          | Syncs a group of radio buttons (same `name`) with a string atom. Listens to `change` event.                                  |
| `bindToSelect(select, reactive, options?)`              | Syncs a single‑select with a string atom. Listens to `change` event.                                                         |
| `bindToSelectMultiple(select, collection, options?)`    | Syncs a multi‑select with a collection of strings (selected values). Listens to `change` event.                              |

### List binding

| Function                                                                | Description                                                                                                     |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `bindToList(container, collection, itemSetter, itemCreator?, options?)` | Renders a reactive collection into a DOM container. Supports templates and custom element creation.             |
| `ListItemHelper`                                                        | Helper class provided to `itemSetter` and `itemCreator` – gives access to template, item index, and `getDiffs`. |
| `ListItemSetterDetails`                                                 | Contains `itemElement`, `index`, `value`, `oldValue`, `length` for each list item.                              |

### Utilities

| Function                               | Description                                                   |
| -------------------------------------- | ------------------------------------------------------------- |
| `getDiffs(newObj, oldObj, compareFn?)` | Returns an object with `true` for changed/added properties.   |
| `globalOptions`                        | Global defaults: `{ debounceTime: 0, autoDisconnect: true }`. |

## Options

All binding functions accept an optional `options` object:

| Option                   | Type    | Default    | Description                                                           |
| ------------------------ | ------- | ---------- | --------------------------------------------------------------------- |
| `debounceTime`           | number  | `0`        | Debounce time (ms) for store subscription.                            |
| `autoDisconnect`         | boolean | `true`     | Automatically unsubscribe when the bound element is removed from DOM. |
| `event` (two-way)        | string  | depends    | Custom event name for DOM updates (e.g. `'click'`, `'blur'`).         |
| `lazy` (input)           | boolean | `false`    | If `true`, listens to `change` instead of `input`.                    |
| `invert` (class toggles) | boolean | `false`    | If `true`, class is applied when value is `false`.                    |
| `hideClassName` (show)   | string  | `'d-none'` | CSS class used to hide the element.                                   |

## Global Options

You can change defaults for all bindings:

```javascript
import { globalOptions } from '@supercat1337/store-utils';

globalOptions.debounceTime = 100;
globalOptions.autoDisconnect = false;
```

## License

MIT [Albert Bazaleev]
