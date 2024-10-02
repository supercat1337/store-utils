// @ts-check

import test from "./../node_modules/ava/entrypoints/main.mjs";
import { InputEvent, Window } from 'happy-dom';
import * as binders from "../src/index.js";
import { Store } from "@supercat1337/store";

/**
 * Sleeps for n miliseconds
 * @param {number} ms 
 * @returns 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 
 * @param {*} element 
 * @returns 
 */
function asNativeElement(element) {
    return /** @type {HTMLElement} */ (/** @type {unknown} */ (element));
}

binders.globalOptions.autodisconnect = true;

test("bindToAttr", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const atom = store.createAtom("test-value");

    binders.bindToAttr(atom, asNativeElement(div), "test", { debounce_time: 0 });

    if (div.getAttribute("test") != "test-value") {
        t.fail();
    }

    atom.value = "123";

    if (div.getAttribute("test") != "123") {
        t.fail(div.getAttribute("test") || "");
    }

    div.remove();

    atom.value = "321";

    if (div.getAttribute("test") == "321") {
        t.fail(div.getAttribute("test") || "");
    }

    window.close();
    t.pass();
});

test("bindToAttr (test null value)", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const atom = /** @type {import("@supercat1337/store").Atom<string | null>} */ (store.createAtom("test-value"));

    binders.bindToAttr(atom, asNativeElement(div), "test", { debounce_time: 0 });

    if (div.getAttribute("test") != "test-value") {
        t.fail();
    }

    atom.value = "123";

    if (div.getAttribute("test") != "123") {
        t.fail(div.getAttribute("test") || "");
    }

    atom.value = null;

    if (div.hasAttribute("test")) {
        t.fail(`div.hasAttribute("test")`);
    }

    window.close();
    t.pass();
});

test("className", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const atom = store.createAtom("class_0");

    binders.bindToClassName(atom, asNativeElement(div), { debounce_time: 0 });

    if (div.className != "class_0") {
        t.fail();
    }

    atom.value = "class_1";

    if (!div.classList.contains("class_1")) {
        t.fail(div.className);
    }

    div.remove();

    atom.value = "class_2";

    if (div.className == "class_2") {
        t.fail(div.className);
    }

    window.close();
    t.pass();
});

test("css_class", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const atom = store.createAtom(true);

    binders.bindToCssClass(atom, asNativeElement(div), "test-class", { debounce_time: 0 });

    if (!div.classList.contains("test-class")) {
        t.fail();
    }

    atom.value = false;

    if (div.classList.contains("test-class")) {
        t.fail(div.className);
    }

    atom.value = true;

    if (!div.classList.contains("test-class")) {
        t.fail();
    }

    atom.value = false;

    div.remove();

    atom.value = true;

    if (div.classList.contains("test-class")) {
        t.fail(div.className);
    }

    window.close();
    t.pass();
});


test("css_class (remove_class_flag = true)", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const atom = store.createAtom(true);

    binders.bindToCssClass(atom, asNativeElement(div), "test-class", { debounce_time: 0, remove_class_flag: true });

    if (div.classList.contains("test-class")) {
        t.fail();
    }

    atom.value = false;

    if (!div.classList.contains("test-class")) {
        t.fail(div.className);
    }

    atom.value = true;

    if (div.classList.contains("test-class")) {
        t.fail();
    }

    atom.value = false;

    div.remove();

    atom.value = true;

    if (!div.classList.contains("test-class")) {
        t.fail(div.className);
    }

    window.close();
    t.pass();
});


test("disabled", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const button = (document.createElement("button"));

    body.append(button);

    const store = new Store;
    const atom = store.createAtom(true);

    binders.bindToDisabled(atom, /** @type {HTMLButtonElement} */(/** @type {unknown} */ (button)), { debounce_time: 0 });

    if (!button.disabled) {
        t.fail();
    }

    atom.value = false;

    if (button.disabled) {
        t.fail();
    }

    button.remove();

    atom.value = true;

    if (button.disabled) {
        t.fail();
    }

    window.close();
    t.pass();
});


test("bindToHtml", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const button = (document.createElement("button"));

    body.append(button);

    const store = new Store;
    const atom = store.createAtom(`<span class="test">123</span>`);

    binders.bindToHtml(atom, /** @type {HTMLButtonElement} */(/** @type {unknown} */ (button)), { debounce_time: 0 });

    if (!button.querySelector(".test")) {
        t.fail();
    }

    atom.value = "";

    if (button.querySelector(".test")) {
        t.fail();
    }

    button.remove();

    atom.value = `<span class="test">123</span>`;

    if (button.querySelector(".test")) {
        t.fail();
    }

    window.close();
    t.pass();
});

test("bindToText", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const button = (document.createElement("button"));

    body.append(button);

    const store = new Store;
    const str = `<span class="test">123</span>`;
    const atom = store.createAtom(str);

    binders.bindToText(atom, /** @type {HTMLButtonElement} */(/** @type {unknown} */ (button)), { debounce_time: 0 });

    if (button.innerText != atom.value) {
        t.fail();
    }

    atom.value = "";

    if (button.innerText != atom.value) {
        t.fail();
    }

    button.remove();

    atom.value = `<span class="test">123</span>`;

    if (button.innerText == atom.value) {
        t.fail();
    }

    window.close();
    t.pass();
});

test("bindToProperty", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const button = (document.createElement("button"));

    body.append(button);

    const store = new Store;
    const atom = store.createAtom(true);

    binders.bindToProperty(atom, /** @type {HTMLButtonElement} */(/** @type {unknown} */ (button)), "disabled", { debounce_time: 0 });

    if (!button.disabled) {
        t.fail();
    }

    atom.value = false;

    if (button.disabled) {
        t.fail();
    }

    button.remove();

    atom.value = true;

    if (button.disabled) {
        t.fail();
    }

    window.close();
    t.pass();
});

test("bindToShow", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const atom = store.createAtom(true);

    binders.bindToShow(atom, asNativeElement(div), { debounce_time: 0 });

    if (div.classList.contains("d-none")) {
        t.fail();
    }

    atom.value = false;

    if (!div.classList.contains("d-none")) {
        t.fail(div.className);
    }

    atom.value = true;

    if (div.classList.contains("d-none")) {
        t.fail();
    }

    atom.value = false;

    div.remove();

    atom.value = true;

    if (!div.classList.contains("d-none")) {
        t.fail(div.className);
    }

    window.close();
    t.pass();
});


test("list (no template, element_item_creator is set)", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const collection = store.createCollection(/** @type {string[]} */([]));

    binders.bindToList(
        collection,
        asNativeElement(div),
        (list_item_helper, details) => {

            let diffs = list_item_helper.getDiffs({value: details.value}, {value: details.old_value});
            
            if (diffs.value) {
                details.item_element.innerText = details.value;
            }

        },
        () => {
            return asNativeElement(document.createElement("span"));
        }
    );

    collection.value.push("1", "2", "3");

    if (div.querySelectorAll("span").length != 3) {
        t.fail(div.querySelectorAll("span").length.toString());
    }

    collection.value.pop();

    if (div.querySelectorAll("span").length != 2) {
        t.fail(div.innerHTML);
    }

    div.remove();
    collection.value.pop();

    if (div.querySelectorAll("span").length != 2) {
        t.fail(div.innerHTML);
    }

    window.close();
    t.pass();
});


test("list (with item template)", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const collection = store.createCollection(/** @type {string[]} */([]));

    div.innerHTML = `<span class="wow"></span>`;

    binders.bindToList(collection, asNativeElement(div), (list_item_helper, details) => {
        details.item_element.innerText = details.value;
    });

    collection.value = ["1", "2", "3"];

    if (div.querySelectorAll(".wow").length != 3) {
        t.fail(div.innerHTML);
    }

    collection.value.splice(0, 1);

    if (div.querySelectorAll(".wow").length != 2) {
        t.fail(div.innerHTML);
    }

    collection.updateItemValue(0, "test");

    if (asNativeElement(div.querySelectorAll(".wow")[0]).innerText != "test") {
        t.fail(div.innerHTML);
    }

    collection.value = ["1", "2", "3", "4", "5"];
    if (asNativeElement(div.querySelectorAll(".wow")[4]).innerText != "5") {
        t.fail(div.innerHTML);
    }


    //t.log(div.innerHTML);

    window.close();
    t.pass();
});

test("list (with item template and init function)", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const collection = store.createCollection(/** @type {string[]} */([]));

    div.innerHTML = `<span class="wow"></span>`;

    binders.bindToList(
        collection,
        asNativeElement(div),
        (list_item_helper, details) => {
            details.item_element.innerText = details.value;
        },
        (list_item_helper) => {
            let item_element = list_item_helper.getTemplate();
            if (item_element) {

                item_element.onclick = () => {
                    window.close();
                };

            }

            return /** @type {HTMLElement} */(item_element);
        });

    collection.value = ["1", "2", "3"];

    if (div.querySelectorAll(".wow").length != 3) {
        t.fail(div.innerHTML);
    }

    collection.value.splice(0, 1);

    if (div.querySelectorAll(".wow").length != 2) {
        t.fail(div.innerHTML);
    }

    collection.updateItemValue(0, "test");

    if (asNativeElement(div.querySelectorAll(".wow")[0]).innerText != "test") {
        t.fail(div.innerHTML);
    }

    collection.value = ["1", "2", "3", "4", "5"];
    if (asNativeElement(div.querySelectorAll(".wow")[4]).innerText != "5") {
        t.fail(div.innerHTML);
    }

    window.close();
    t.pass();
});

test("list (with object items)", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const collection = store.createCollection(/** @type {{a:String, b:String}[]} */([]));

    div.innerHTML = `<p class="wow"><span class="a"></span> - <span class="b"></span></p>`;

    binders.bindToList(collection, asNativeElement(div), (list_item_helper, details) => {
        let a = asNativeElement(details.item_element.querySelector(".a"));
        let b = asNativeElement(details.item_element.querySelector(".b"));

        let diffs = binders.getDiffs(details.value, details.old_value);

        if (diffs.a) {
            a.innerText = details.value.a;
        }

        if (diffs.b) {
            b.innerText = details.value.b;
        }
    });

    collection.value = [{ a: "1", b: "text-1" }, { a: "2", b: "text-2" }, { a: "3", b: "text-3" }];

    if (div.querySelectorAll(".wow").length != 3) {
        t.fail(div.innerHTML);
    }

    collection.value.splice(0, 1);

    if (div.querySelectorAll(".wow").length != 2) {
        t.fail(div.innerHTML);
    }

    collection.updateItemValue(0, { a: "4", b: "text-4" });

    if (asNativeElement(div.querySelectorAll(".wow")[0]).innerText != "4 - text-4") {
        t.fail(asNativeElement(div.querySelectorAll(".wow")[0]).innerText);
    }

    //t.log(div.innerHTML);

    window.close();
    t.pass();
});

test("list (no template error)", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const collection = store.createCollection([]);

    div.innerHTML = ``;

    try {
        binders.bindToList(collection, asNativeElement(div), (list_item_helper, details) => {
            details.item_element.innerText = details.value;
        });

        t.fail();
    }
    catch (e) {
        t.pass();
    }

    window.close();
});


test("list (removeLastElementListItem)", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const collection = store.createCollection([0, 1, 2, 3]);

    div.innerHTML = `<span class="wow"></span>`;

    binders.bindToList(collection, asNativeElement(div), (list_item_helper, details) => {
        details.item_element.innerText = String(details.value);
    });

    collection.value = [3, 2, 1];

    if (asNativeElement(div.querySelectorAll(".wow")[2]).innerText != "1") {
        t.fail(div.innerHTML);
    }

    window.close();
    t.pass();
});


test("list (getListItemIndex, getListItem)", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const div = (document.createElement("div"));

    body.append(div);

    const store = new Store;
    const collection = store.createCollection([{ a: "0", b: "text-0" }]);

    div.innerHTML = `<p class="wow"><span class="a"></span> - <span class="b"></span></p>`;

    binders.bindToList(collection, asNativeElement(div), (list_item_helper, details) => {
        let a = asNativeElement(details.item_element.querySelector(".a"));
        let b = asNativeElement(details.item_element.querySelector(".b"));

        let diffs = binders.getDiffs(details.value, details.value);

        if (diffs.a) {
            a.innerText = details.value.a;
        }

        if (diffs.b) {
            b.innerText = details.value.b;
        }

        if (list_item_helper.getListItem(a) != details.item_element) {
            t.fail();
        }

        if (list_item_helper.getListItemIndex(details.item_element) != details.index) {
            t.fail(`${list_item_helper.getListItemIndex(details.item_element)}, ${details.index}`);
        }

        if (list_item_helper.getListItemIndex(a) != details.index) {
            t.fail(`${list_item_helper.getListItemIndex(a)}, ${details.index}`);
        }

    });

    collection.value = [{ a: "1", b: "text-1" }, { a: "2", b: "text-2" }, { a: "3", b: "text-3" }];

    window.close();
    t.pass();
});

test("bindToCheckbox", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const checkbox = (document.createElement("input"));
    checkbox.type = "checkbox";
    checkbox.checked = false;

    body.append(checkbox);

    const store = new Store;
    const atom = store.createAtom(true);

    binders.bindToCheckbox(atom, /** @type {HTMLInputElement} */(/** @type {unknown} */ (checkbox)), { debounce_time: 0 });

    if (!checkbox.checked) {
        t.fail(checkbox.checked.toString());
    }

    atom.value = false;

    if (checkbox.checked) {
        t.fail();
    }

    checkbox.click();

    if (atom.value == false) {

        t.fail(checkbox.checked.toString() + " " + atom.value.toString());
    }

    checkbox.click();
    //set checkbox.checked = false;

    // @ts-ignore
    if (atom.value == true) {
        t.fail(String(atom.value));
    }

    checkbox.remove();

    atom.value = true;

    if (checkbox.checked) {
        t.fail();
    }

    window.close();
    t.pass();
});


test("bindToCheckboxValues", t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const checkboxes = [];

    for (let i = 0; i < 10; i++) {
        let checkbox = (document.createElement("input"));
        checkbox.type = "checkbox";
        checkbox.checked = false;
        checkbox.value = i.toString();

        body.append(checkbox);
        checkboxes.push(checkbox);
    }



    const store = new Store;
    const collection = store.createCollection(/** @type {string[]} */([]));

    // @ts-ignore
    let unsubscriber = binders.bindToCheckboxValues(collection, checkboxes, { debounce_time: 0 });

    checkboxes[0].click();
    checkboxes[2].click();
    checkboxes[4].click();

    let arr = collection.value;

    if (arr[0] == checkboxes[0].value && arr[2] == checkboxes[2].value && arr[4] == checkboxes[4].value) {
        t.fail();
    }

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].remove();
    }

    collection.value = ["2", "4"];

    if ((!checkboxes[0].checked) && (checkboxes[2].checked) && (checkboxes[4].checked)) {
        t.fail();
    }

    unsubscriber();

    window.close();
    t.pass();
});


test("bindToInputValue", async t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const input = (document.createElement("input"));
    input.type = "text";

    body.append(input);

    const store = new Store;
    const atom = store.createAtom("wow");

    let unsubscriber = binders.bindToInputValue(atom, /** @type {HTMLInputElement} */(/** @type {unknown} */ (input)), { debounce_time: 0, lazy: false });

    if (input.value != "wow") {
        t.fail(input.value);
    }

    atom.value = "321";

    if (input.value != "321") {
        t.fail(input.value);
    }

    input.value = "hello";
    input.dispatchEvent(new InputEvent('input'));
    await sleep(100);

    if (input.value != "hello") {
        t.fail(input.value);
    }

    input.remove();

    atom.value = "yo";

    if (input.value == "yo") {
        t.fail(input.value);
    }

    unsubscriber();

    window.close();
    t.pass();
});


test("bindToInputValue (number)", async t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const input = (document.createElement("input"));
    input.type = "number";

    body.append(input);

    const store = new Store;
    const atom = store.createAtom(1024);

    let unsubscriber = binders.bindToInputValue(atom, /** @type {HTMLInputElement} */(/** @type {unknown} */ (input)), { debounce_time: 0, lazy: true });

    if (input.value != "1024") {
        t.fail("fail: " + JSON.stringify(input.value));
    }

    atom.value = 321;

    if (Number(input.value) != 321) {
        t.fail(input.value);
    }

    input.value = "1000";
    input.dispatchEvent(new InputEvent('change'));
    await sleep(100);

    if (atom.value != 1000) {
        t.fail(atom.value.toString());
    }

    input.value = "hello";
    input.dispatchEvent(new InputEvent('change'));
    await sleep(100);

    t.log(atom.value);
    t.log(input.value);

    if (!Number.isNaN(atom.value)) {
        t.fail(atom.value.toString());
    }

    unsubscriber();

    window.close();
    t.pass();
});

test("bindToSelectElement", async t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const select_element = (document.createElement("select"));

    for (let i = 0; i < 10; i++) {
        let option = (document.createElement("option"));
        option.value = i.toString();
        select_element.options.add(option);
    }

    body.append(select_element);

    const store = new Store;
    const atom = store.createAtom("2");

    let unsubscriber = binders.bindToSelectElement(atom, /** @type {HTMLSelectElement} */(/** @type {unknown} */ (select_element)), { debounce_time: 0 });

    if (select_element.value != "2") {
        t.fail(select_element.value);
    }

    atom.value = "0";

    if (select_element.value != "0") {
        t.fail(select_element.value);
    }

    select_element.value = "1";
    select_element.dispatchEvent(new InputEvent('change'));
    await sleep(100);

    if (select_element.value != "1") {
        t.fail(select_element.value);
    }

    select_element.remove();

    atom.value = "yo";

    if (select_element.value == "yo") {
        t.fail(select_element.value);
    }

    unsubscriber();

    window.close();
    t.pass();
});


test("bindToRadios", async t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const radios = [];

    for (let i = 0; i < 10; i++) {
        let radio = (document.createElement("input"));
        radio.type = "radio";
        radio.name = "yo";
        radio.value = i.toString();

        body.append(radio);
        radios.push(radio);
    }

    const store = new Store;
    const currentValue = store.createAtom("8");

    // @ts-ignore
    let unsubscriber = binders.bindToRadios(currentValue, radios, { debounce_time: 0 });
    await sleep(100);

    if (radios[8].checked != true) {
        t.fail(radios.map(r => r.checked).toString());
    }

    radios[0].click();
    radios[2].click();
    radios[4].click();

    currentValue.value = "1";

    await sleep(100);

    if (radios[1].checked != true) {
        t.fail(radios.map(r => r.checked).toString());
    }

    for (let i = 0; i < radios.length; i++) {
        radios[i].remove();
    }

    // do nothing with radios
    currentValue.value = "2";

    if (radios[1].checked != true) {
        t.fail(radios.map(r => r.checked).toString());
    }

    unsubscriber();

    window.close();
    t.pass();


});


/**
 * Gets an array of values of all selected options in the given select_element
 * @param {HTMLSelectElement} select_element
 * @returns {string[]}
 */
function getSelectedValues(select_element) {
    return Array.from(select_element.selectedOptions).map(option => option.value);
}

test("bindToMultipleSelect", async t => {

    const window = new Window();
    const document = window.document;

    const body = (document.body);
    const select_element = (/** @type {HTMLSelectElement} */(asNativeElement(document.createElement("select"))));
    select_element.multiple = true;

    for (let i = 0; i < 10; i++) {
        let option = (/** @type {HTMLOptionElement} */(asNativeElement((document.createElement("option")))));
        option.value = i.toString();
        option.selected = false;
        select_element.options.add(option);
    }

    // @ts-ignore
    body.append(select_element);

    const store = new Store;
    const collection = store.createCollection(["2"]);

    let unsubscriber = binders.bindToMultipleSelect(collection, /** @type {HTMLSelectElement} */(/** @type {unknown} */ (select_element)), { debounce_time: 0 });

    if (getSelectedValues(select_element).join(",") != "2") {
        t.fail(getSelectedValues(select_element).join(","));
    }

    collection.value = ["0", "1", "5"];

    if (getSelectedValues(select_element).join(",") != "0,1,5") {
        t.fail(getSelectedValues(select_element).join(","));
    }

    collection.value.splice(1, 1);
    if (getSelectedValues(select_element).join(",") != "0,5") {
        t.fail(getSelectedValues(select_element).join(","));
    }

    collection.value.pop();
    if (getSelectedValues(select_element).join(",") != "0") {
        t.fail(getSelectedValues(select_element).join(","));
    }

    collection.value.pop();
    if (getSelectedValues(select_element).join(",") != "") {
        t.fail(getSelectedValues(select_element).join(","));
    }

    select_element.options[4].selected = true;
    // @ts-ignore
    select_element.dispatchEvent(new InputEvent('change'));
    await sleep(100);

    if (getSelectedValues(select_element).join(",") != "4") {
        t.fail(getSelectedValues(select_element).join(","));
    }

    select_element.remove();

    collection.value = ["5", "6"];

    if (getSelectedValues(select_element).join(",") == "5,6") {
        t.fail(getSelectedValues(select_element).join(","));
    }

    unsubscriber();

    window.close();
    t.pass();



});


//     const html2 = createCustomTaggedTemplate({ debounce_time: 100 });


test("html", async t => {

    /**
     * @typedef {{tmp: HTMLElement}} Refs
     */

    const window = new Window();
    const document = window.document;

    const store = new Store;
    const cl = store.createAtom("test_class");
    const cl2 = store.createAtom("test_class");

    let html = binders.createCustomTaggedTemplate({ debounce_time: 0, document: document });

    let fragment = /** @type {binders.Fragment<Refs>} */ (html`

<strong class="text-danger" fail="{{1231231}}" >
    <span ref="tmp" class="${cl}">
    ${cl2}${1 + 1} sasa
    </span>
</strong>`);

    // @ts-ignore
    document.body.append(fragment.root);

    console.log(fragment.root.outerHTML);

    cl.value = "lalalalla";
    cl2.value = "12345";

    if (fragment.refs.tmp.className != "lalalalla") {
        t.fail(fragment.refs.tmp.className);
    }

    t.pass();

})