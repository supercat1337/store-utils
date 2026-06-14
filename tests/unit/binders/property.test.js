// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToProperty } from '../../../src/element-binders/property.js';
import { Store } from '@supercat1337/store';

test('bindToProperty updates element property with reactive value', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const button = document.createElement('button');
    body.append(button);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToProperty(button, atom, 'disabled', { debounceTime: 0 });

    t.true(button.disabled);

    atom.value = false;
    t.false(button.disabled);

    window.close();
});

test('bindToProperty works with string properties', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom('original title');

    bindToProperty(div, atom, 'title', { debounceTime: 0 });

    t.is(div.title, 'original title');

    atom.value = 'new title';
    t.is(div.title, 'new title');

    window.close();
});

test('bindToProperty auto-disconnects when element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const button = document.createElement('button');
    body.append(button);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToProperty(button, atom, 'disabled', { debounceTime: 0 });

    t.true(button.disabled);

    const disabledBeforeRemove = button.disabled;
    button.remove();

    atom.value = false;
    // autoDisconnect prevents updates after removal
    t.is(button.disabled, disabledBeforeRemove);

    window.close();
});
