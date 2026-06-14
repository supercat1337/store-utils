// @ts-check
import test from 'ava';
import { Window, InputEvent } from 'happy-dom';
import { bindToSelect } from '../../../src/element-binders/two-way-bindings/select.js';
import { Store } from '@supercat1337/store';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test('bindToSelect updates select.value from atom', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    for (let i = 0; i < 3; i++) {
        const option = document.createElement('option');
        option.value = String(i);
        option.textContent = `Option ${i}`;
        select.appendChild(option);
    }
    body.append(select);

    const store = new Store();
    const atom = store.createAtom('1');

    bindToSelect(select, atom, { debounceTime: 0 });

    t.is(select.value, '1');

    atom.value = '2';
    t.is(select.value, '2');

    window.close();
});

test('bindToSelect updates atom when select changes', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    for (let i = 0; i < 3; i++) {
        const option = document.createElement('option');
        option.value = String(i);
        select.appendChild(option);
    }
    body.append(select);

    const store = new Store();
    const atom = store.createAtom('0');

    bindToSelect(select, atom, { debounceTime: 0 });

    select.value = '1';
    select.dispatchEvent(new InputEvent('change'));
    await sleep(10);
    t.is(atom.value, '1');

    window.close();
});

test('bindToSelect with custom event', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    const option = document.createElement('option');
    option.value = 'test';
    select.appendChild(option);
    body.append(select);

    const store = new Store();
    const atom = store.createAtom('');

    bindToSelect(select, atom, { event: 'click' });

    select.value = 'test';
    select.dispatchEvent(new InputEvent('click'));
    await sleep(10);
    t.is(atom.value, 'test');

    window.close();
});

test('bindToSelect auto-disconnects when element is removed', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    const option = document.createElement('option');
    option.value = 'val';
    select.appendChild(option);
    body.append(select);

    const store = new Store();
    const atom = store.createAtom('val');

    bindToSelect(select, atom, { debounceTime: 0 });

    t.is(select.value, 'val');

    const valueBeforeRemove = select.value;
    select.remove();

    atom.value = 'other';
    t.is(select.value, valueBeforeRemove);

    window.close();
});

test('bindToSelect updates select when atom changes after subscription', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    const option1 = document.createElement('option');
    option1.value = 'a';
    const option2 = document.createElement('option');
    option2.value = 'b';
    select.appendChild(option1);
    select.appendChild(option2);
    body.append(select);

    const store = new Store();
    const atom = store.createAtom('a');

    bindToSelect(select, atom, { debounceTime: 0 });

    t.is(select.value, 'a');

    atom.value = 'b';
    t.is(select.value, 'b');

    window.close();
});

test('bindToSelect returns unsubscribe function that cleans up event listeners', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const select = document.createElement('select');
    const option = document.createElement('option');
    option.value = 'test';
    select.appendChild(option);
    body.append(select);

    const store = new Store();
    const atom = store.createAtom('test');

    const unsubscribe = bindToSelect(select, atom, { debounceTime: 0 });

    // Call unsubscribe to clean up
    unsubscribe();

    // After cleanup, changing atom should not affect select
    atom.value = 'other';
    t.is(select.value, 'test'); // still old value because listener removed

    window.close();
});
