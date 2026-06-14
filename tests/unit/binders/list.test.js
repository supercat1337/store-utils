// @ts-check
import test from 'ava';
import { Window } from 'happy-dom';
import { bindToList, ListItemHelper, ListItemSetterDetails, getDiffs } from '../../../src/index.js';
import { Store } from '@supercat1337/store';

test('bindToList with custom elementItemCreator (no template)', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const container = document.createElement('div');
    body.append(container);

    const store = new Store();
    const collection = store.createCollection([]);

    bindToList(
        container,
        collection,
        (listItemHelper, details) => {
            const diffs = listItemHelper.getDiffs(
                { value: details.value },
                { value: details.oldValue }
            );
            if (diffs.value) {
                details.itemElement.textContent = details.value;
            }
        },
        () => document.createElement('span')
    );

    collection.value = ['1', '2', '3'];
    t.is(container.querySelectorAll('span').length, 3);

    collection.value.pop();
    t.is(container.querySelectorAll('span').length, 2);

    window.close();
});

test('bindToList with item template (first child as template)', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = '<span class="item"></span>';
    body.append(container);

    const store = new Store();
    const collection = store.createCollection([]);

    bindToList(container, collection, (listItemHelper, details) => {
        details.itemElement.textContent = details.value;
    });

    collection.value = ['a', 'b', 'c'];
    t.is(container.querySelectorAll('.item').length, 3);
    t.is(container.querySelectorAll('.item')[0].textContent, 'a');
    t.is(container.querySelectorAll('.item')[2].textContent, 'c');

    collection.value.splice(0, 1);
    t.is(container.querySelectorAll('.item').length, 2);
    t.is(container.querySelectorAll('.item')[0].textContent, 'b');

    collection.updateItemValue(0, 'updated');
    t.is(container.querySelectorAll('.item')[0].textContent, 'updated');

    collection.value = ['x', 'y', 'z', 'w', 'v'];
    t.is(container.querySelectorAll('.item').length, 5);
    t.is(container.querySelectorAll('.item')[4].textContent, 'v');

    window.close();
});

test('bindToList with template and custom element creator (init function)', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = '<button class="btn"></button>';
    body.append(container);

    const store = new Store();
    const collection = store.createCollection([]);

    let clicked = false;
    bindToList(
        container,
        collection,
        (listItemHelper, details) => {
            details.itemElement.textContent = details.value;
        },
        listItemHelper => {
            const element = listItemHelper.getTemplate();
            if (element) {
                element.onclick = () => {
                    clicked = true;
                };
            }
            return element;
        }
    );

    collection.value = ['click me'];
    const btn = container.querySelector('.btn');
    btn.click();
    t.true(clicked);

    window.close();
});

test('bindToList with object items and getDiffs', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = '<p><span class="a"></span> - <span class="b"></span></p>';
    body.append(container);

    const store = new Store();
    const collection = store.createCollection([]);

    bindToList(container, collection, (listItemHelper, details) => {
        const aSpan = details.itemElement.querySelector('.a');
        const bSpan = details.itemElement.querySelector('.b');
        const diffs = getDiffs(details.value, details.oldValue);
        if (diffs.a) aSpan.textContent = details.value.a;
        if (diffs.b) bSpan.textContent = details.value.b;
    });

    collection.value = [
        { a: '1', b: 'text-1' },
        { a: '2', b: 'text-2' },
        { a: '3', b: 'text-3' },
    ];
    t.is(container.querySelectorAll('p').length, 3);
    t.is(container.querySelectorAll('p')[0].textContent, '1 - text-1');

    collection.value.splice(0, 1);
    t.is(container.querySelectorAll('p').length, 2);
    t.is(container.querySelectorAll('p')[0].textContent, '2 - text-2');

    collection.updateItemValue(0, { a: '4', b: 'text-4' });
    t.is(container.querySelectorAll('p')[0].textContent, '4 - text-4');

    window.close();
});

test('bindToList throws error when no template and no elementItemCreator', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = ''; // no children
    body.append(container);

    const store = new Store();
    const collection = store.createCollection([]);

    t.throws(
        () => {
            bindToList(container, collection, () => {});
        },
        { message: /elementItemCreator or template is not set/ }
    );

    window.close();
});

test('bindToList handles setData after length change', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = '<span></span>';
    body.append(container);

    const store = new Store();
    const collection = store.createCollection([0, 1, 2, 3]);

    bindToList(container, collection, (helper, details) => {
        details.itemElement.textContent = String(details.value);
    });

    t.is(container.querySelectorAll('span').length, 4);
    t.is(container.querySelectorAll('span')[2].textContent, '2');

    collection.value = [3, 2, 1];
    t.is(container.querySelectorAll('span').length, 3);
    t.is(container.querySelectorAll('span')[2].textContent, '1');

    window.close();
});

test('bindToList ListItemHelper methods getListItemIndex and getListItem', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = '<p><span class="a"></span><span class="b"></span></p>';
    body.append(container);

    const store = new Store();
    const collection = store.createCollection([{ a: '0', b: 'text-0' }]);

    bindToList(container, collection, (listItemHelper, details) => {
        const aSpan = details.itemElement.querySelector('.a');
        const bSpan = details.itemElement.querySelector('.b');
        const diffs = getDiffs(details.value, details.value);
        if (diffs.a) aSpan.textContent = details.value.a;
        if (diffs.b) bSpan.textContent = details.value.b;

        t.is(listItemHelper.getListItem(aSpan), details.itemElement);
        t.is(listItemHelper.getListItemIndex(details.itemElement), details.index);
        t.is(listItemHelper.getListItemIndex(aSpan), details.index);
    });

    collection.value = [
        { a: '1', b: 'text-1' },
        { a: '2', b: 'text-2' },
        { a: '3', b: 'text-3' },
    ];

    window.close();
});

test('bindToList handles full array replacement (property === null)', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = '<span></span>';
    body.append(container);

    const store = new Store();
    const collection = store.createCollection([1, 2, 3]);

    bindToList(container, collection, (helper, details) => {
        details.itemElement.textContent = String(details.value);
    });

    t.is(container.querySelectorAll('span').length, 3);
    t.is(container.querySelectorAll('span')[0].textContent, '1');

    // Full replacement
    collection.value = [10, 20];
    t.is(container.querySelectorAll('span').length, 2);
    t.is(container.querySelectorAll('span')[0].textContent, '10');
    t.is(container.querySelectorAll('span')[1].textContent, '20');

    window.close();
});

test('bindToList auto-disconnects when container element is removed from DOM', t => {
    const window = new Window();
    const document = window.document;

    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = '<span></span>';
    body.append(container);

    const store = new Store();
    const collection = store.createCollection(['a', 'b']);

    bindToList(container, collection, (helper, details) => {
        details.itemElement.textContent = details.value;
    });

    t.is(container.querySelectorAll('span').length, 2);

    container.remove();
    collection.value = ['c', 'd'];

    // autoDisconnect should prevent DOM updates
    t.is(container.querySelectorAll('span').length, 2);
    t.is(container.querySelectorAll('span')[0].textContent, 'a');

    window.close();
});
