// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToHtml } from '../../../src/element-binders/html.js';
import { Store } from '@supercat1337/store';

test('bindToHtml updates element.innerHTML with reactive string', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom('<span class="test">Hello</span>');

    bindToHtml(div, atom, { debounceTime: 0 });

    t.not(div.querySelector('.test'), null);
    t.is(div.querySelector('.test')?.textContent, 'Hello');

    atom.value = '<strong>World</strong>';
    t.is(div.querySelector('strong')?.textContent, 'World');
    t.is(div.querySelector('.test'), null);

    window.close();
});

test('bindToHtml auto-disconnects when element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom('<p>Initial</p>');

    bindToHtml(div, atom, { debounceTime: 0 });

    t.is(div.innerHTML, '<p>Initial</p>');

    const htmlBeforeRemove = div.innerHTML;
    div.remove();

    atom.value = '<p>After remove</p>';
    // autoDisconnect prevents updates after removal
    t.is(div.innerHTML, htmlBeforeRemove);

    window.close();
});

test('bindToHtml with number value converts to string', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const div = document.createElement('div');
    body.append(div);

    const store = new Store();
    const atom = store.createAtom(123);

    bindToHtml(div, atom, { debounceTime: 0 });

    t.is(div.innerHTML, '123');

    window.close();
});
