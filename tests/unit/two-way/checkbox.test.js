// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToCheckbox } from '../../../src/element-binders/two-way-bindings/checkbox-checked.js';
import { Store } from '@supercat1337/store';

test('bindToCheckbox two-way binding updates checkbox.checked from atom', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    body.append(checkbox);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToCheckbox(checkbox, atom, { debounceTime: 0 });

    t.true(checkbox.checked);

    atom.value = false;
    t.false(checkbox.checked);

    window.close();
});

test('bindToCheckbox two-way binding updates atom from checkbox click', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    body.append(checkbox);

    const store = new Store();
    const atom = store.createAtom(false);

    bindToCheckbox(checkbox, atom, { debounceTime: 0 });

    t.false(checkbox.checked);
    t.false(atom.value);

    checkbox.click();
    t.true(checkbox.checked);
    t.true(atom.value);

    checkbox.click();
    t.false(checkbox.checked);
    t.false(atom.value);

    window.close();
});

test('bindToCheckbox auto-disconnects when element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    body.append(checkbox);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToCheckbox(checkbox, atom, { debounceTime: 0 });

    t.true(checkbox.checked);

    checkbox.remove();
    atom.value = false;

    // After removal, autoDisconnect should prevent updates
    t.true(checkbox.checked);

    window.close();
});
