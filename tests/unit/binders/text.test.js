// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToText } from '../../../src/element-binders/text.js';
import { Store } from '@supercat1337/store';

test('bindToText updates element.textContent with reactive string/number', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom('Hello');

    bindToText(div, atom, { debounceTime: 0 });

    t.is(div.textContent, 'Hello');

    atom.value = 'World';
    t.is(div.textContent, 'World');

    atom.value = 123;
    t.is(div.textContent, '123');

    window.close();
});

test('bindToText auto-disconnects when element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom('Initial');

    bindToText(div, atom, { debounceTime: 0 });

    t.is(div.textContent, 'Initial');

    const textBeforeRemove = div.textContent;
    div.remove();

    atom.value = 'After remove';
    // autoDisconnect prevents updates after removal
    t.is(div.textContent, textBeforeRemove);

    window.close();
});

test('bindToText works with Text node directly', t => {
    const window = new Window();
    const document = window.document;

    const textNode = document.createTextNode('');
    document.body.append(textNode);

    const store = new Store();
    const atom = store.createAtom('Text node content');

    bindToText(textNode, atom, { debounceTime: 0 });

    t.is(textNode.textContent, 'Text node content');

    atom.value = 'Updated';
    t.is(textNode.textContent, 'Updated');

    window.close();
});
