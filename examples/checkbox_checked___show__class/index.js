// @ts-check 

import { Store } from "@supercat1337/store";
import { bindToCheckbox, bindToClassName, bindToShow } from "../../src/index.js";



var show_checkbox = /** @type {HTMLInputElement} */ (document.querySelector("#show_checkbox"));
var make_danger_checkbox = /** @type {HTMLInputElement} */ (document.querySelector("#make_danger_checkbox"));

var block_element = /** @type {HTMLElement} */ (document.querySelector("#sample_div"));
var text_element = /** @type {HTMLElement} */ (document.querySelector("#sample_text"));

let store = new Store();

let show_atom = store.createAtom(false);
let show_atom_computed = store.createComputed(()=>{
    return show_atom.value;
});

let danger_atom = store.createAtom(false);

let danger_classname_computed = store.createComputed(()=>{
    return danger_atom.value? 'text-danger display-6' : '';
});

bindToCheckbox(show_atom, show_checkbox);
bindToShow(show_atom_computed, block_element);

bindToCheckbox(danger_atom, make_danger_checkbox);

bindToClassName(danger_classname_computed, text_element);
