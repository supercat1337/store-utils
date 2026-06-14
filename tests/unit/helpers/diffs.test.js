// @ts-check
import test from 'ava';
import { getDiffs } from '../../../src/utils/helpers.js';

test('getDiffs returns true for added properties', t => {
    const newObj = { a: 1, b: 2 };
    const oldObj = { a: 1 };
    const diffs = getDiffs(newObj, oldObj);
    t.deepEqual(diffs, { a: false, b: true });
});

test('getDiffs returns true for changed properties', t => {
    const newObj = { a: 10, b: 20 };
    const oldObj = { a: 5, b: 20 };
    const diffs = getDiffs(newObj, oldObj);
    t.deepEqual(diffs, { a: true, b: false });
});

test('getDiffs returns true for all properties when oldObj is null/undefined', t => {
    const newObj = { a: 1, b: 2 };
    const diffs = getDiffs(newObj, null);
    t.deepEqual(diffs, { a: true, b: true });
});

test('getDiffs ignores properties not in newObj', t => {
    const newObj = { a: 1 };
    const oldObj = { a: 1, b: 2 };
    const diffs = getDiffs(newObj, oldObj);
    t.deepEqual(diffs, { a: false });
});

test('getDiffs uses custom compare function (returns true if equal)', t => {
    const newObj = { a: { x: 1 }, b: 2 };
    const oldObj = { a: { x: 1 }, b: 3 };
    // customCompare returns true if values are equal
    // @ts-ignore
    const customCompare = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const diffs = getDiffs(newObj, oldObj, customCompare);
    t.deepEqual(diffs, { a: false, b: true });
});

test('getDiffs works with nested objects without custom compare', t => {
    const newObj = { user: { name: 'John', age: 30 } };
    const oldObj = { user: { name: 'Jane', age: 30 } };
    // Without custom compare, objects are compared by reference
    const diffs = getDiffs(newObj, oldObj);
    t.true(diffs.user);
});

test('getDiffs skips non-string properties (symbols)', t => {
    const sym = Symbol();
    const newObj = { a: 1, [sym]: 2};
    const oldObj = { a: 1 };
    const diffs = getDiffs(newObj, oldObj);
    t.deepEqual(diffs, { a: false }); // symbol property ignored
});
