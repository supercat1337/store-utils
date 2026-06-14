// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToDataset } from '../../../src/element-binders/dataset.js';
import { Store } from '@supercat1337/store';

test('bindToDataset updates data-* attributes from object', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom({ id: '123', role: 'admin' });

    bindToDataset(div, atom, { debounceTime: 0 });

    t.is(div.dataset.id, '123');
    t.is(div.dataset.role, 'admin');

    window.close();
});

test('bindToDataset replaces entire dataset on update', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom({ a: '1', b: '2' });

    bindToDataset(div, atom, { debounceTime: 0 });

    t.is(div.dataset.a, '1');
    t.is(div.dataset.b, '2');

    atom.value = { c: '3' };

    t.is(div.dataset.a, undefined);
    t.is(div.dataset.b, undefined);
    t.is(div.dataset.c, '3');

    window.close();
});

test('bindToDataset removes all data-* attributes when value is null', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom({ test: 'value' });

    bindToDataset(div, atom, { debounceTime: 0 });

    t.true(div.hasAttribute('data-test'));

    atom.value = null;

    t.false(div.hasAttribute('data-test'));
    t.is(Object.keys(div.dataset).length, 0);

    window.close();
});

test('bindToDataset auto-disconnects when element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom({ id: '123' });

    bindToDataset(div, atom, { debounceTime: 0 });

    t.is(div.dataset.id, '123');

    // Store dataset as plain object before removal
    const datasetBeforeRemove = Object.assign({}, div.dataset);
    div.remove();

    atom.value = { id: '456' };

    // autoDisconnect prevents updates after removal
    t.deepEqual(Object.assign({}, div.dataset), datasetBeforeRemove);

    window.close();
});
