// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToAttribute } from '../../../src/element-binders/attribute.js';
import { Store } from '@supercat1337/store';

test('bindToAttr', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom('test-value');

    bindToAttribute(div, atom, 'test', { debounceTime: 0 });

    t.is(div.getAttribute('test'), 'test-value');

    atom.value = '123';
    t.is(div.getAttribute('test'), '123');

    const valueBeforeRemove = div.getAttribute('test');

    div.remove();

    atom.value = '321';
    t.is(div.getAttribute('test'), valueBeforeRemove);

    window.close();
});

test('bindToAttr with null value', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = /** @type {import("@supercat1337/store").Atom<string | null>} */ (
        store.createAtom('test-value')
    );

    bindToAttribute(div, atom, 'test', { debounceTime: 0 });

    t.is(div.getAttribute('test'), 'test-value');

    atom.value = '123';
    t.is(div.getAttribute('test'), '123');

    atom.value = null;
    t.false(div.hasAttribute('test'));

    window.close();
});
