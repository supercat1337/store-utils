// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToShow } from '../../../src/element-binders/show.js';
import { Store } from '@supercat1337/store';

test('bindToShow hides element when value is false (adds default "d-none" class)', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToShow(div, atom, { debounceTime: 0 });

    t.false(div.classList.contains('d-none'));

    atom.value = false;
    t.true(div.classList.contains('d-none'));

    atom.value = true;
    t.false(div.classList.contains('d-none'));

    window.close();
});

test('bindToShow uses custom hideClassName', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToShow(div, atom, { hideClassName: 'hidden', debounceTime: 0 });

    t.false(div.classList.contains('hidden'));

    atom.value = false;
    t.true(div.classList.contains('hidden'));

    window.close();
});

test('bindToShow with invert: true (class added when value is true)', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToShow(div, atom, { invert: true, hideClassName: 'invisible', debounceTime: 0 });

    t.true(div.classList.contains('invisible'));

    atom.value = false;
    t.false(div.classList.contains('invisible'));

    window.close();
});

test('bindToShow auto-disconnects when element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToShow(div, atom, { debounceTime: 0 });

    t.false(div.classList.contains('d-none'));

    const classNameBeforeRemove = div.className;
    div.remove();

    atom.value = false;
    // autoDisconnect prevents adding the hide class after removal
    t.is(div.className, classNameBeforeRemove);

    window.close();
});
