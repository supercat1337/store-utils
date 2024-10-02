// @ts-check

import { Store } from "@supercat1337/store";
import { html, Fragment, bindToCheckbox, bindToCheckboxValues } from "./../../src/index.js";

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



