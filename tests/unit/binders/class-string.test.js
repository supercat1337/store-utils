// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToClassString } from '../../../src/element-binders/className.js';
import { Store } from '@supercat1337/store';

test('bindToClassString updates element.className with reactive string', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom('class_0');

    bindToClassString(div, atom, { debounceTime: 0 });

    t.is(div.className, 'class_0');

    atom.value = 'class_1';
    t.is(div.className, 'class_1');

    window.close();
});

test('bindToClassString auto-disconnects when element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom('initial');

    bindToClassString(div, atom, { debounceTime: 0 });

    t.is(div.className, 'initial');

    const classNameBeforeRemove = div.className;
    div.remove();

    atom.value = 'after-remove';
    // autoDisconnect should prevent updates after removal
    t.is(div.className, classNameBeforeRemove);

    window.close();
});
