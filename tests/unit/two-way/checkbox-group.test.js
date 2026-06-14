// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToCheckboxGroup } from '../../../src/element-binders/checkboxes-values.js';
import { Store } from '@supercat1337/store';

test('bindToCheckboxGroup updates checkbox group from collection', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const checkboxes = [];
    for (let i = 0; i < 5; i++) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = String(i);
        body.append(cb);
        checkboxes.push(cb);
    }

    const store = new Store();
    const collection = store.createCollection(['1', '3']);

    bindToCheckboxGroup(checkboxes, collection, { debounceTime: 0 });

    t.false(checkboxes[0].checked);
    t.true(checkboxes[1].checked);
    t.false(checkboxes[2].checked);
    t.true(checkboxes[3].checked);
    t.false(checkboxes[4].checked);

    collection.value = ['0', '2', '4'];
    t.true(checkboxes[0].checked);
    t.false(checkboxes[1].checked);
    t.true(checkboxes[2].checked);
    t.false(checkboxes[3].checked);
    t.true(checkboxes[4].checked);

    window.close();
});

test('bindToCheckboxGroup updates collection when checkboxes are clicked', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const checkboxes = [];
    for (let i = 0; i < 3; i++) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = String(i);
        body.append(cb);
        checkboxes.push(cb);
    }

    const store = new Store();
    const collection = store.createCollection([]);

    bindToCheckboxGroup(checkboxes, collection, { debounceTime: 0 });

    checkboxes[0].click();
    checkboxes[2].click();

    t.deepEqual(collection.value, ['0', '2']);

    checkboxes[2].click();
    t.deepEqual(collection.value, ['0']);

    window.close();
});

test('bindToCheckboxGroup with custom event', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const checkboxes = [];
    for (let i = 0; i < 2; i++) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = String(i);
        body.append(cb);
        checkboxes.push(cb);
    }

    const store = new Store();
    const collection = store.createCollection([]);

    bindToCheckboxGroup(checkboxes, collection, { event: 'click' });

    checkboxes[0].click();
    t.deepEqual(collection.value, ['0']);

    window.close();
});

test('bindToCheckboxGroup auto-disconnects when elements are removed', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const checkboxes = [];
    for (let i = 0; i < 2; i++) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = String(i);
        body.append(cb);
        checkboxes.push(cb);
    }

    const store = new Store();
    const collection = store.createCollection(['0']);

    bindToCheckboxGroup(checkboxes, collection, { debounceTime: 0 });

    t.true(checkboxes[0].checked);
    t.false(checkboxes[1].checked);

    // Remove all checkboxes
    checkboxes.forEach(cb => cb.remove());
    collection.value = ['1'];

    // autoDisconnect should prevent updates
    t.true(checkboxes[0].checked);
    t.false(checkboxes[1].checked);

    window.close();
});

test('bindToCheckboxGroup with empty array returns no-op unsubscribe', t => {
    const store = new Store();
    const collection = store.createCollection([]);
    const unsub = bindToCheckboxGroup([], collection);
    t.is(typeof unsub, 'function');
    unsub(); // should not throw
    t.pass();
});
