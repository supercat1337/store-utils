// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToDisabled } from '../../../src/element-binders/disabled.js';
import { Store } from '@supercat1337/store';

test('bindToDisabled updates element.disabled property with boolean value', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const button = document.createElement('button');
    body.append(button);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToDisabled(button, atom, { debounceTime: 0 });

    t.true(button.disabled);

    atom.value = false;
    t.false(button.disabled);

    window.close();
});

test('bindToDisabled works with input elements', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    body.append(input);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToDisabled(input, atom, { debounceTime: 0 });

    t.true(input.disabled);

    atom.value = false;
    t.false(input.disabled);

    window.close();
});

test('bindToDisabled auto-disconnects when element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const button = document.createElement('button');
    body.append(button);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToDisabled(button, atom, { debounceTime: 0 });

    t.true(button.disabled);

    const disabledBeforeRemove = button.disabled;
    button.remove();

    atom.value = false;
    // autoDisconnect prevents updates after removal
    t.is(button.disabled, disabledBeforeRemove);

    window.close();
});
