// @ts-check
import test from 'ava';
import { Window, InputEvent } from 'happy-dom';
import { bindToSelectMultiple } from '../../../src/element-binders/two-way-bindings/multiple-select.js';
import { Store } from '@supercat1337/store';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Use direct option.selected check instead of selectedOptions (happy-dom workaround)
function getSelectedValues(selectElement) {
    const selected = [];
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].selected) {
            selected.push(selectElement.options[i].value);
        }
    }
    return selected;
}

test('bindToSelectMultiple updates select options from collection', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    select.multiple = true;
    for (let i = 0; i < 5; i++) {
        const option = document.createElement('option');
        option.value = String(i);
        select.appendChild(option);
    }
    body.append(select);

    const store = new Store();
    const collection = store.createCollection(['1', '3']);

    bindToSelectMultiple(select, collection, { debounceTime: 0 });

    t.deepEqual(getSelectedValues(select), ['1', '3']);

    collection.value = ['0', '2', '4'];
    await sleep(50);

    t.deepEqual(getSelectedValues(select), ['0', '2', '4']);

    window.close();
});

test('bindToSelectMultiple updates collection when select changes', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    select.multiple = true;
    for (let i = 0; i < 3; i++) {
        const option = document.createElement('option');
        option.value = String(i);
        select.appendChild(option);
    }
    body.append(select);

    const store = new Store();
    const collection = store.createCollection(['0']);

    bindToSelectMultiple(select, collection, { debounceTime: 0 });

    // Select options 0 and 2
    select.options[0].selected = true;
    select.options[2].selected = true;
    select.dispatchEvent(new InputEvent('change'));
    await sleep(50);

    t.deepEqual(collection.value, ['0', '2']);

    // Deselect all
    select.options[0].selected = false;
    select.options[2].selected = false;
    select.dispatchEvent(new InputEvent('change'));
    await sleep(50);

    t.deepEqual(collection.value, []);

    window.close();
});

test('bindToSelectMultiple with custom event', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    select.multiple = true;
    const option = document.createElement('option');
    option.value = 'test';
    select.appendChild(option);
    body.append(select);

    const store = new Store();
    const collection = store.createCollection([]);

    bindToSelectMultiple(select, collection, { event: 'click' });

    select.options[0].selected = true;
    select.dispatchEvent(new InputEvent('click'));
    await sleep(50);

    t.deepEqual(collection.value, ['test']);

    window.close();
});

test('bindToSelectMultiple auto-disconnects when element is removed', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    select.multiple = true;
    const option = document.createElement('option');
    option.value = 'val';
    select.appendChild(option);
    body.append(select);

    const store = new Store();
    const collection = store.createCollection(['val']);

    bindToSelectMultiple(select, collection, { debounceTime: 0 });

    t.deepEqual(getSelectedValues(select), ['val']);

    const selectedBeforeRemove = getSelectedValues(select);
    select.remove();

    collection.value = ['other'];
    await sleep(50);

    t.deepEqual(getSelectedValues(select), selectedBeforeRemove);

    window.close();
});
