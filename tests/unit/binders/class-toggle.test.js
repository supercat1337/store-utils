// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToCssClass } from '../../../src/element-binders/css-class.js';
import { Store } from '@supercat1337/store';

test('bindToCssClass adds class when value is true (invert: false default)', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToCssClass(div, atom, 'test-class', { debounceTime: 0 });

    t.true(div.classList.contains('test-class'));

    atom.value = false;
    t.false(div.classList.contains('test-class'));

    atom.value = true;
    t.true(div.classList.contains('test-class'));

    window.close();
});

test('bindToCssClass with invert: true adds class when value is false', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToCssClass(div, atom, 'test-class', { debounceTime: 0, invert: true });

    t.false(div.classList.contains('test-class'));

    atom.value = false;
    t.true(div.classList.contains('test-class'));

    atom.value = true;
    t.false(div.classList.contains('test-class'));

    window.close();
});

test('bindToCssClass auto-disconnects when element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom(true);

    bindToCssClass(div, atom, 'test-class', { debounceTime: 0 });

    t.true(div.classList.contains('test-class'));

    div.remove();
    atom.value = false;

    // After removal, autoDisconnect prevents class removal
    t.true(div.classList.contains('test-class'));

    window.close();
});
