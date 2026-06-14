// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToRadioGroup } from '../../../src/element-binders/two-way-bindings/radios.js';
import { Store } from '@supercat1337/store';

test('bindToRadioGroup updates radio group from atom', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const radios = [];
    for (let i = 0; i < 5; i++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'group';
        radio.value = String(i);
        body.append(radio);
        radios.push(radio);
    }

    const store = new Store();
    const atom = store.createAtom('2');

    bindToRadioGroup(radios, atom, { debounceTime: 0 });

    t.false(radios[0].checked);
    t.false(radios[1].checked);
    t.true(radios[2].checked);
    t.false(radios[3].checked);
    t.false(radios[4].checked);

    atom.value = '4';
    t.false(radios[2].checked);
    t.true(radios[4].checked);

    window.close();
});

test('bindToRadioGroup updates atom when radio is clicked', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const radios = [];
    for (let i = 0; i < 3; i++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'group';
        radio.value = String(i);
        body.append(radio);
        radios.push(radio);
    }

    const store = new Store();
    const atom = store.createAtom('0');

    bindToRadioGroup(radios, atom, { debounceTime: 0 });

    t.true(radios[0].checked);
    t.false(radios[1].checked);
    t.false(radios[2].checked);

    radios[1].click();
    t.false(radios[0].checked);
    t.true(radios[1].checked);
    t.false(radios[2].checked);
    t.is(atom.value, '1');

    radios[2].click();
    t.false(radios[1].checked);
    t.true(radios[2].checked);
    t.is(atom.value, '2');

    window.close();
});

test('bindToRadioGroup with custom event', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const radios = [];
    for (let i = 0; i < 2; i++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'group';
        radio.value = String(i);
        body.append(radio);
        radios.push(radio);
    }

    const store = new Store();
    const atom = store.createAtom('0');

    bindToRadioGroup(radios, atom, { event: 'click' });

    radios[1].click();
    t.is(atom.value, '1');

    window.close();
});

test('bindToRadioGroup auto-disconnects when elements are removed', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const radios = [];
    for (let i = 0; i < 2; i++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'group';
        radio.value = String(i);
        body.append(radio);
        radios.push(radio);
    }

    const store = new Store();
    const atom = store.createAtom('0');

    bindToRadioGroup(radios, atom, { debounceTime: 0 });

    t.true(radios[0].checked);

    // Remove radios
    radios.forEach(r => r.remove());
    atom.value = '1';

    // autoDisconnect should prevent updates
    t.true(radios[0].checked);
    t.false(radios[1].checked);

    window.close();
});

test('bindToRadioGroup with empty array returns no-op unsubscribe', t => {
    const store = new Store();
    const atom = store.createAtom('test');
    const unsub = bindToRadioGroup([], atom);
    t.is(typeof unsub, 'function');
    unsub(); // should not throw
    t.pass();
});

test('bindToRadioGroup with radios having no name returns no-op unsubscribe', t => {
    const window = new Window();
    const document = window.document;
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = ''; // empty name
    document.body.append(radio);

    const store = new Store();
    const atom = store.createAtom('test');
    const unsub = bindToRadioGroup([radio], atom);
    t.is(typeof unsub, 'function');
    unsub();
    window.close();
    t.pass();
});
