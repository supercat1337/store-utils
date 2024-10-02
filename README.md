# @supercat1337/store-utils

A collection of utility functions for working with stores (created by [@supercat1337/store](https://github.com/supercat1337/store)) in JavaScript applications.

## Installation

To install `@supercat1337/store-utils`, run the following command in your terminal:
```
npm install @supercat1337/store-utils
```
## Usage

This package provides several utility functions for working with stores. Here are a few examples:

This code creates a counter with the following features:
        - The counter is displayed if the "Show counter" checkbox is checked
        - The counter is disabled if the "Disable counter" checkbox is checked
        - The counter will have a red color if the "Show danger text" checkbox is checked
        - When the checkboxes in the "Selected options" list change, the list will be updated

```javascript
import { Store } from "@supercat1337/store";
import { html, Fragment, bindToCheckbox, bindToCheckboxValues } from "@supercat1337/store-utils";

const store = new Store;
const counter_atom = store.createAtom(10);
const show_counter_atom = store.createAtom(true);
const disable_counter_atom = store.createAtom(false);

const show_danger_text_atom = store.createAtom(false);
const show_danger_text_computed = store.createComputed(() => {
    return show_danger_text_atom.value ? "text-danger display-6 px-5" : "px-5";
});

const options_collection = store.createCollection( /** @type {string[]} */([]));
const options_computed = store.createComputed(() => {
    return options_collection.value.join(", ");
});
const show_options_computed = store.createComputed(() => {
    return options_collection.value.length > 0;
});


/** @typedef {{minus: HTMLButtonElement, plus: HTMLButtonElement, show_counter: HTMLInputElement, disable_counter: HTMLInputElement, show_danger_text: HTMLInputElement}} Refs */

let fragment = /** @type {Fragment<Refs>} */ (html`

<div class="container mt-5">

    <div v-show="${show_counter_atom}" >
        <button class="btn btn-outline-secondary" ref="minus" v-disabled="${disable_counter_atom}">-</button>
        <span class="${show_danger_text_computed}">${counter_atom}</span>
        <button class="btn btn-outline-secondary" ref="plus" v-disabled="${disable_counter_atom}">+</button>
    </div>
    
    <label class="mt-3 d-block">
        <input type="checkbox" ref="show_counter" class="form-check-input" value="show_counter" />
        <span class="ps-1">Show counter</span>
    </label>

    <label class="mt-1 d-block">
        <input type="checkbox" ref="disable_counter" class="form-check-input" value="disable_counter" />
        <span class="ps-1">Disable counter<span>
    </label>

    <label class="mt-1 d-block">
        <input type="checkbox" ref="show_danger_text" class="form-check-input" value="show_danger_text" />
        <span class="ps-1">Show danger text</span>
    </label>

    <div v-show="${show_options_computed}" class="mt-3">Selected options: ${options_computed}</div>

</div>

`);

document.body.append(fragment.root);

let { minus, plus, show_counter, disable_counter, show_danger_text } = fragment.refs;

minus.addEventListener("click", () => {
    counter_atom.value--;
});

plus.addEventListener("click", () => {
    counter_atom.value++;
});


bindToCheckbox(show_counter_atom, show_counter);
bindToCheckbox(disable_counter_atom, disable_counter);
bindToCheckbox(show_danger_text_atom, show_danger_text);
bindToCheckboxValues(options_collection, Array.from(fragment.root.querySelectorAll("input[type=checkbox]")));
```

## API

**bindToAttr**: Binds a store atom to an attribute of a DOM element. When the atom changes, the attribute is updated with the new value of the atom.

**bindToCheckbox**: Binds a store atom to the checked state of a checkbox. When the atom changes, the checkbox is updated with the new value of the atom.

**bindToClassName**: Binds a store atom to the class name of a DOM element. When the atom changes, the class name is updated with the new value of the atom.

**bindToHtml**: Binds a store atom to the innerHTML of a DOM element. When the atom changes, the innerHTML is updated with the new value of the atom.

**bindToInputValue**: Binds a store atom to the value of an input element. When the atom changes, the input value is updated with the new value of the atom.

**bindToProperty**: Binds a store atom to a property of a DOM element. When the atom changes, the property is updated with the new value of the atom.

**bindToShow**: Binds a store atom to the display state of a DOM element. When the atom changes, the display state is updated with the new value of the atom.

**bindToText**: Binds a store atom to the text content of a DOM element. When the atom changes, the text content is updated with the new value of the atom.

**bindToList**: Binds a store collection to a &lt;ul&gt; or &lt;ol&gt; element. When the collection changes, the list is updated with the new values of the collection.

**ListItemHelper**: A helper class used by bindToList to generate the list items.

**ListItemSetterDetails**: An object containing the details of the setter function for the list item. Used by bindToList to generate the list items.

**getDiffs**: A function that returns an array of the differences between two arrays.

**bindToDisabled**: Binds a store atom to the disabled state of a DOM element. When the atom changes, the disabled state is updated with the new value of the atom.

**bindToCssClass**: Binds a store atom to the class name of a DOM element. When the atom changes, the class name is updated with the new value of the atom.

**bindToCheckboxValues**: Binds a store collection to a group of checkboxes. When the collection changes, the checkboxes are updated with the new values of the collection.

**bindToRadios**: Binds a store atom to a group of radio buttons. When the atom changes, the radio buttons are updated with the new value of the atom.

**bindToMultipleSelect**: Binds a store collection to a &lt;select&gt; element with the multiple attribute. When the collection changes, the &lt;select&gt; element is updated with the new values of the collection.

**bindToSelectElement**: Binds a store atom to a &lt;select&gt; element. When the atom changes, the &lt;select&gt; element is updated with the new value of the atom.

**globalOptions**: An object containing the global options for the library. Can be used to set the global options for the library.


## License

This repository is licensed under the MIT License. 