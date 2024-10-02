// @ts-check

import { Atom, Collection, Computed, debounce, Store } from "@supercat1337/store";
// import { Window, NodeFilter, Node } from 'happy-dom';
import { bindToText } from "../element-binders/text.js";
import { bindToAttr } from "../element-binders/attribute.js";
import { bindToHtml } from "../element-binders/html.js";
import { bindToShow } from "../element-binders/show.js";
import { bindToDisabled } from "../element-binders/disabled.js";


/**
 * @template {{[key:string]:HTMLElement}} Refs
 */
export class Fragment {
    // element: HTMLElement, unsubscribe: () => void, refs: {[key:string]:HTMLElement

    /** @type {HTMLElement} */
    root;
    /** @type {() => void} */
    unsubscribe;
    /** @type {Refs} */
    refs;

    /**
     * @param {HTMLElement} root the root element of the created fragment
     * @param {() => void} unsubscribe the function that unsubscribes from the created bindings
     * @param {Refs} refs the map of references to the created elements
     */
    constructor(root, unsubscribe, refs) {
        this.root = root;
        this.unsubscribe = unsubscribe;
        this.refs = refs;
    }
}

/**
 * @param {string} textContent
 * @param {Map<number, Atom<string|null|boolean|number>|Computed<string|null|boolean|number>>} storage 
 * @return {{reactive: Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|null, content: string}[]}}
 */
function textToTextNodes(textContent, storage) {

    /** @type {{reactive: Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|null, content: string}[]} */
    let textNodes = [];
    let re = /\{{(\d+)}}/;
    let text = textContent;

    while (re.test(text)) {

        let match = re.exec(text);
        
        if (!match) {
            break;
        }

        let index = match[1];

        textNodes.push({
            content: text.slice(0, match.index),
            reactive: null
        });

        text = text.slice(match.index + match[0].length);

        let reactive = storage.get(parseInt(index));

        if (reactive) {
            textNodes.push({
                content: String(reactive.value),
                reactive
            });
        } else {
            textNodes.push({
                content: "{{" + index + "}}",
                reactive: null
            });

        }


    }

    textNodes.push({
        content: text,
        reactive: null
    });

    return textNodes;
}

/**
 * Returns true if the given value is an object and not an array.
 * @param {any} object
 * @returns {boolean}
 */
function isObject(object) {
    return object !== null && !isArray(object) && typeof object === "object"; // && (object).constructor.name == "Object"
}

/**
 * Returns true if the given value is an array.
 * @param {any} object
 * @returns {boolean}
 */
function isArray(object) {
    return Array.isArray(object);
}

/** 
 * @typedef {Object} CustomTaggedTemplateOptions
 * @property {number} [debounce_time=0] the default debounce time for all the binders
 * @property {boolean} [autodisconnect=false] whether to automatically disconnect the subscriptions
 * @property {any} [document] the document to use
 * */


/**
 * Creates a custom tagged template literal function, which can be used to bind reactive variables to HTML elements.
 * The function is a bound version of the html function, which means that the options object is pre-applied to the function.
 * This can be useful if you want to use the same set of options for multiple invocations of the html function.
 * @param {CustomTaggedTemplateOptions} [options={}] the options object to be pre-applied to the html function
 * @returns {(literals: TemplateStringsArray, ...expressions: (Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|string|number|boolean)[]) => Fragment<any>}
 */
export function createCustomTaggedTemplate(options = {}) {
    let taggedTemplate = html.bind(options);
    return taggedTemplate
}

/**
 * Tagged template literal function, which can be used to bind reactive variables to HTML elements.
 * @template {{[key:string]:HTMLElement}} Refs
 * @param {TemplateStringsArray} literals
 * @param {...(Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|string|number|boolean)} expressions
 * @returns {Fragment<Refs>}
 */
export function html(literals, ...expressions) {

    let options = isObject(this) ? this : {};

    /** @type {Map<number, Atom<string|null|boolean|number>|Computed<string|null|boolean|number>>} */
    let storage = new Map;
    /** @type {string[]} */
    let html_code = [];
    let strings = Array.from(literals);
    let unsubscribers = [];
    /** @type {{[key:string]:HTMLElement}} */
    let refs = {};

    strings[0] = literals[0].trimStart();
    strings[strings.length - 1] = literals[strings.length - 1].trimEnd();

    for (let i = 0; i < strings.length; i++) {
        html_code.push(strings[i]);

        if (expressions[i] == undefined) continue;

        if (expressions[i] instanceof Atom || expressions[i] instanceof Computed || expressions[i] instanceof Collection) {
            let reactive = expressions[i];
            // @ts-ignore
            storage.set(i, reactive);

            html_code.push(`{{${i}}}`);
        } else {
            html_code.push(String(expressions[i]));
        }

    }

    let doc = /** @type {Document} */ (options.document || globalThis.document);
    
    let code = html_code.join("").trim();
    let template = doc.createElement("template");
    template.innerHTML = code;

    if (template.content.childNodes.length > 1) throw new Error("Template literal contains multiple nodes");
    if (template.content.childNodes.length == 0) throw new Error("Template literal contains no nodes");

    let root = doc.importNode(template.content.childNodes[0], true);

    const tw = doc.createTreeWalker(root, 1 /* NodeFilter.SHOW_ELEMENT */ | 4 /* NodeFilter.SHOW_TEXT */);

    let currentNode;

    /** @type {{node: Node, textNodes: {reactive: Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|null, content: string}[]}[]} */
    let patchText = [];

    /** @type {{node: Node, attribute:Attr, reactive: Atom<string|null|boolean|number>|Computed<string|null|boolean|number>|null}[]}[]} */
    let patchElement = [];

    while (currentNode = (tw.nextNode())) {

        if (currentNode.nodeType == 3 /* Node.TEXT_NODE */) {
            if (currentNode.textContent!== null) {
                let textNodes = textToTextNodes(currentNode.textContent, storage);
                patchText.push({ node: currentNode, textNodes: textNodes });    
            }
        }
        else if (currentNode.nodeType == 1 /* Node.ELEMENT_NODE*/) {

            // @ts-ignore
            let element = /** @type {HTMLElement} */ (currentNode);

            for (let i = 0; i < element.attributes.length; i++) {

                let attribute = element.attributes[i];

                if (attribute.name == "ref") {
                    refs[attribute.value] = element;
                    continue;
                }

                if (attribute.value.match(/^\{\{(\d+)\}\}$/)) {

                    attribute.value = attribute.value.replace(/\{\{(\d+)\}\}/, (m, /** @type {string} */ expression_id) => {

                        let reactive = storage.get(parseInt(expression_id));
                        if (reactive) {
                            patchElement.push({ node: element, attribute, reactive });
                        }

                        return "{{" + expression_id + "}}";
                    });
                }

            }

        }

    }

    for (let i = 0; i < patchText.length; i++) {

        let { node, textNodes } = patchText[i];

        for (let j = 0; j < textNodes.length; j++) {
            let childNode = doc.createTextNode(textNodes[j].content);
            let reactive = textNodes[j].reactive;
            if (reactive == null) continue;

            if (textNodes[j].reactive != null) {
                if (!(typeof reactive.value == "string" || typeof reactive.value == "number")) {
                    throw new Error("reactive variable must be a string for text binding");
                }

                // @ts-ignore
                let unsubscribe = bindToText(reactive, childNode, options);
                unsubscribers.push(unsubscribe);
            }

            node.parentNode?.insertBefore(childNode, node);
        }

        node.parentNode?.removeChild(node);
    }

    for (let i = 0; i < patchElement.length; i++) {

        let { node, attribute, reactive } = patchElement[i];

        //console.log(node, attribute.name, attribute.value, reactive.value);

        let element = /** @type {HTMLElement} */ (node);

        if (reactive == null) continue;

        switch (attribute.name) {
            case "v-text": {
                if (!(typeof reactive.value == "string" || typeof reactive.value == "number")) {
                    throw new Error("v-text can only be used with strings");
                }

                // @ts-ignore
                let unsubscribe = bindToText(reactive, element, options);
                unsubscribers.push(unsubscribe);
                element.removeAttribute("v-text");
                break;
            }
            case "v-html": {
                if (typeof reactive.value != "string") {
                    throw new Error("v-html can only be used with strings");
                }

                // @ts-ignore
                let unsubscribe = bindToHtml(reactive, element, options);
                unsubscribers.push(unsubscribe);
                element.removeAttribute("v-html");
                break;
            }

            case "v-show": {
                if (typeof reactive.value != "boolean") {
                    throw new Error("v-show can only be used with booleans");
                }

                // @ts-ignore
                let unsubscribe = bindToShow(reactive, element, options);
                unsubscribers.push(unsubscribe);
                element.removeAttribute("v-show");
                break;
            }
            case "v-disabled": {
                if (typeof reactive.value != "boolean") {
                    throw new Error("v-disabled can only be used with booleans");
                }

                // @ts-ignore
                let unsubscribe = bindToDisabled(reactive, element, options);
                unsubscribers.push(unsubscribe);
                element.removeAttribute("v-disabled");
                break;
            }

            default: {
                if (!(reactive.value == null || typeof reactive.value == "string")) {
                    throw new Error("reactive variable must be a string for attribute binding");
                }

                // @ts-ignore 
                let unsubscribe = bindToAttr(reactive, element, attribute.name, options);
                unsubscribers.push(unsubscribe);
            }
        }

    }

    let root_element = /** @type {HTMLElement} */( /** @type {any} */ root);
    let unsubscriber = () => {
        for (let i = 0; i < unsubscribers.length; i++) {
            unsubscribers[i]();
        }
    };
    
    let fragment = /** @type {Fragment<Refs>} */ (new Fragment(root_element, unsubscriber, refs));

    return fragment;
}