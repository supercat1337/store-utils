// @ts-check

/*
This code is an example of a simple to-do list application. 
It uses a library called Store from the @supercat1337/store package, which is used for creating and managing state in JavaScript applications.

The code sets up a TaskService object, which is responsible for managing the to-do items. 
It adds a set of initial to-do items to the service.

The code also creates a Store object, which is used to manage the state of the application. 
It sets up event listeners for various user interactions, such as adding a new to-do item and filtering the list of items.

Overall, this code sets up the basic structure of a to-do list application, including the data management and presentation layers.
*/

import { Store } from '@supercat1337/store';
import { tasks_service } from './task-service.js';

import { bindToList, bindToText, bindToDisabled, bindToInput } from './../../src/index.js';
import { ListItemHelper, ListItemSetterDetails } from '../../src/index.js';

// Model

// creates a new Store object to manage the state of the application
const store = new Store();

// creates a collection in the store to store the to-do items
const todos = store.createCollection(/** @type {import("./task-service.js").ItemData[]} */ ([]));

// creates a computed value that returns the length of the todos collection
const computed_length = store.createComputed(() => {
    return todos.content.length.toString();
});

// creates an atom to store the value of the filter input field
const filter_input_atom = store.createAtom('');

// creates a computed value that returns true if the filter_input_atom is not empty
const filter_input_not_empty = store.createComputed(() => {
    return filter_input_atom.value.length > 0;
});

// View
const root_list = /** @type {HTMLElement} */ (document.querySelector('[ref=root_list]'));
const add_todo_button = /** @type {HTMLButtonElement} */ (
    document.querySelector('[ref=add_todo_button]')
);
const add_todo_input = /** @type {HTMLInputElement} */ (
    document.querySelector('[ref=add_todo_input]')
);
const filter_todo_input = /** @type {HTMLInputElement} */ (
    document.querySelector('[ref=filter_todo_input]')
);
const list_length_span = /** @type {HTMLSpanElement} */ (
    document.querySelector('[ref=list_length_span]')
);

// Presenter

/**
 * @param {Event|KeyboardEvent} e
 */
async function addTaskCallback(e) {
    if (e instanceof KeyboardEvent) {
        if (e.key != 'Enter') return;
    }

    // Get the trimmed value of the add_todo_input element
    var todo_name = add_todo_input.value.trim();
    // Clear the add_todo_input element
    add_todo_input.value = '';

    if (todo_name != '') {
        let task = await tasks_service.add({ text: todo_name, done: false });
        todos.content.push(task);
    }
}

add_todo_button.addEventListener('click', addTaskCallback);
add_todo_input.addEventListener('keydown', addTaskCallback);

/**
 * This function is called when the user types in the filter_todo_input text box.
 * It requests the data from the tasks_service, and if the filter_text is not empty,
 * it filters the data by the filter_text, and sets the todos.value to the filtered array.
 * If the filter_text is empty, it sets the todos.value to the requestData.
 */
async function filterTodos() {
    let filter_text = filter_todo_input.value;
    let requestData = await tasks_service.requestData();

    if (filter_text == '') {
        todos.value = requestData;
    } else {
        let filtered_arr = requestData.filter(item => item.text.includes(filter_text));
        todos.value = filtered_arr;
    }
}

// when the user types in the filter_todo_input text box, it calls the filterTodos function
filter_todo_input.addEventListener('input', filterTodos);

/**
 * Sets the text and done state of a list item element, given a list item helper and a details object.
 * @param {ListItemHelper} listItemHelper
 * @param {ListItemSetterDetails<import("./task-service.js").ItemData>} details
 */
function setElementItemValue(listItemHelper, details) {
    const text = /** @type {HTMLSpanElement} */ (details.itemElement.querySelector('[ref=text]'));
    const checkbox = /** @type {HTMLInputElement} */ (
        details.itemElement.querySelector('[ref=checkbox]')
    );

    var diffs = listItemHelper.getDiffs(details.value, details.oldValue);

    if (diffs.text) {
        text.innerText = details.value.text;
    }

    if (diffs.done) {
        checkbox.checked = details.value.done;
        text.classList.toggle('text-decoration-line-through', details.value.done);
    }
}

/**
 * Creates a new list item element, given a list item helper, and adds event listeners to the delete button and the checkbox.
 * @param {ListItemHelper} listItemHelper
 * @returns {HTMLElement}
 */
function createElementItem(listItemHelper) {
    let itemElement = listItemHelper.getTemplate();
    if (!itemElement) throw new Error('No template found');

    const delete_button = /** @type {HTMLButtonElement} */ (
        itemElement.querySelector('[ref=delete_button]')
    );
    const checkbox = /** @type {HTMLInputElement} */ (itemElement.querySelector('[ref=checkbox]'));

    delete_button.addEventListener('click', () => {
        var index = listItemHelper.getListItemIndex(itemElement);
        if (index == -1) return;

        tasks_service.delete(todos.content[index].task_id);
        todos.content.splice(index, 1);
    });

    checkbox.addEventListener('change', async () => {
        var index = listItemHelper.getListItemIndex(itemElement);
        if (index == -1) return;

        todos.updateItemValue(index, { done: checkbox.checked });
        await tasks_service.update(todos.content[index]);
    });

    return itemElement;
}

// Init

// Binds the computed length of the todos collection to the text of the list length span element.
bindToText(list_length_span, computed_length);

// Bind the filter_input_atom to the value of the filter_todo_input element
bindToInput(filter_todo_input, filter_input_atom);

// Disable the add_todo_button and add_todo_input when the filter_input_not_empty atom is true
bindToDisabled(add_todo_button, filter_input_not_empty);
bindToDisabled(add_todo_input, filter_input_not_empty);

// Set the initial value of the todos collection to the data from the tasks_service
todos.value = await tasks_service.requestData();

// Bind the todos collection to the root_list element, using the setElementItemValue and createElementItem functions
bindToList(root_list, todos, setElementItemValue, createElementItem);

/*
$dom(add_todo_button)
    .disabled(filter_input_not_empty);

$dom(list_length_span)
    .text(computed_length);

*/
