// @ts-check
import test from 'ava';
import { Window, InputEvent } from 'happy-dom';
import { bindToInput } from '../../../src/element-binders/two-way-bindings/input-value.js';
import { Store } from '@supercat1337/store';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test('bindToInput updates input.value from atom (text)', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    input.type = 'text';
    body.append(input);

    const store = new Store();
    const atom = store.createAtom('hello');

    bindToInput(input, atom, { debounceTime: 0, lazy: false });

    t.is(input.value, 'hello');

    atom.value = 'world';
    t.is(input.value, 'world');

    window.close();
});

test('bindToInput updates atom from input events (input event)', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    input.type = 'text';
    body.append(input);

    const store = new Store();
    const atom = store.createAtom('initial');

    bindToInput(input, atom, { debounceTime: 0, lazy: false });

    input.value = 'new value';
    input.dispatchEvent(new InputEvent('input'));
    await sleep(10);

    t.is(atom.value, 'new value');

    window.close();
});

test('bindToInput with lazy: true uses change event', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    input.type = 'text';
    body.append(input);

    const store = new Store();
    const atom = store.createAtom('initial');

    bindToInput(input, atom, { debounceTime: 0, lazy: true });

    input.value = 'updated';
    input.dispatchEvent(new InputEvent('input'));
    await sleep(10);

    t.is(atom.value, 'initial'); // not updated on input

    input.dispatchEvent(new InputEvent('change'));
    await sleep(10);
    t.is(atom.value, 'updated');

    window.close();
});

test('bindToInput with type="number" converts values correctly', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    input.type = 'number';
    body.append(input);

    const store = new Store();
    const atom = store.createAtom(42);

    bindToInput(input, atom, { debounceTime: 0, lazy: true });

    t.is(input.value, '42');

    atom.value = 100;
    t.is(input.value, '100');

    input.value = '55';
    input.dispatchEvent(new InputEvent('change'));
    await sleep(10);
    t.is(atom.value, 55);

    // Invalid number should become 0
    input.value = 'not a number';
    input.dispatchEvent(new InputEvent('change'));
    await sleep(10);
    t.is(atom.value, 0);
    t.is(input.value, '0');

    window.close();
});

test('bindToInput with custom event name', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    input.type = 'text';
    body.append(input);

    const store = new Store();
    const atom = store.createAtom('test');

    bindToInput(input, atom, { event: 'blur' });

    input.value = 'blur event';
    input.dispatchEvent(new InputEvent('blur'));
    await sleep(10);
    t.is(atom.value, 'blur event');

    window.close();
});

test('bindToInput auto-disconnects when element is removed', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    input.type = 'text';
    body.append(input);

    const store = new Store();
    const atom = store.createAtom('before');

    bindToInput(input, atom, { debounceTime: 0 });

    t.is(input.value, 'before');

    const valueBeforeRemove = input.value;
    input.remove();

    atom.value = 'after';
    t.is(input.value, valueBeforeRemove);

    window.close();
});

test('bindToInput with type="number" handles empty string', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    input.type = 'number';
    body.append(input);

    const store = new Store();
    const atom = store.createAtom(123);

    bindToInput(input, atom, { debounceTime: 0, lazy: true });

    input.value = '';
    input.dispatchEvent(new InputEvent('change'));
    await sleep(10);
    t.is(atom.value, 0);
    t.is(input.value, '0');

    window.close();
});

test('bindToInput with type="number" handles non-numeric input', async t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    input.type = 'number';
    body.append(input);

    const store = new Store();
    const atom = store.createAtom(5);

    bindToInput(input, atom, { debounceTime: 0, lazy: true });

    input.value = 'abc';
    input.dispatchEvent(new InputEvent('change'));
    await sleep(10);
    t.is(atom.value, 0);
    t.is(input.value, '0');

    window.close();
});

test('bindToInput with type="number" handles NaN value from atom', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = '123';
    body.append(input);

    const store = new Store();
    const atom = store.createAtom(123);

    bindToInput(input, atom, { debounceTime: 0, lazy: true });

    // Set atom to NaN
    atom.value = NaN;

    t.is(input.value, '');
    t.true(isNaN(atom.value));

    window.close();
});
