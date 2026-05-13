const SECTIONS = [
  // ── SECTION 1: CORE CONCEPTS ──
  {
    group: "Core JavaScript",
    icon: "📦",
    title: "Variables & Scoping",
    subtitle: "var, let, const, hoisting, temporal dead zone",
    concept: "JavaScript has three variable declaration keywords: <code>var</code> (function-scoped, hoisted with undefined), <code>let</code> (block-scoped, temporal dead zone), and <code>const</code> (block-scoped, immutable binding).",
    code: [
      ["javascript", `console.log(a); // undefined (hoisted)
var a = 10;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;

const obj = { name: "John" };
obj.name = "Doe"; // ✅ Valid: const binding is immutable, but object properties aren't.`]
    ],
    questions: [
      ["e", "What is the Temporal Dead Zone (TDZ)?", "The TDZ is the period between entering a block scope and the actual declaration of a <code>let</code> or <code>const</code> variable. Accessing the variable during this time throws a ReferenceError. It prevents accessing variables before they are initialized."],
      ["m", "Explain hoisting.", "Hoisting is JS's default behavior of moving declarations to the top of the current scope during the compile phase. <code>var</code> is hoisted and initialized to <code>undefined</code>. <code>let</code>/<code>const</code> are hoisted but NOT initialized (they remain in TDZ). Functions are hoisted completely."],
      ["h", "Output of setTimeout inside a loop with var vs let?", "```javascript\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Output: 3, 3, 3\n// 'var' is function-scoped. By the time setTimeout runs, the loop finished and 'i' is 3.\n\nfor (let j = 0; j < 3; j++) {\n  setTimeout(() => console.log(j), 100);\n}\n// Output: 0, 1, 2\n// 'let' is block-scoped. Each iteration creates a new lexical environment for 'j'.\n```"]
    ]
  },
  {
    group: "Core JavaScript",
    icon: "🧬",
    title: "Data Types & Coercion",
    subtitle: "primitives vs reference, type coercion, typeof, instanceof",
    concept: "JS has primitive types (String, Number, BigInt, Boolean, Undefined, Symbol, Null) which are passed by value, and reference types (Objects, Arrays, Functions) which are passed by reference.",
    questions: [
      ["e", "Difference between == and ===?", "<code>==</code> performs type coercion before comparison (loose equality). <code>===</code> checks both value and type without coercion (strict equality). Always use <code>===</code>."],
      ["m", "Why is typeof null === 'object'?", "It is a known, unfixable bug in JavaScript dating back to its first version. In early JS, values were stored in 32-bit units. The type tag for objects was 000. `null` was represented as the NULL pointer (all zeros), so its type tag evaluated to 000 (object)."],
      ["h", "Explain Type Coercion in JS. What is the output of [] + [] and [] + {}?", "Coercion is implicit type conversion. Arrays convert to empty strings.\n<code>[] + []</code> -> <code>\"\" + \"\"</code> -> <code>\"\"</code>\n<code>[] + {}</code> -> <code>\"\" + \"[object Object]\"</code> -> <code>\"[object Object]\"</code>\n<code>{} + []</code> -> <code>0</code> (Empty block evaluates to nothing, then unary +[] evaluates to 0)."]
    ]
  },
  {
    group: "Core JavaScript",
    icon: "⚡",
    title: "Functions & Closures",
    subtitle: "arrow functions, IIFE, closures, currying",
    concept: "Functions are first-class citizens in JS. Closures allow a function to remember the variables in its lexical scope even when executed outside that scope.",
    questions: [
      ["e", "What is a Closure?", "A closure is a function bundled together with references to its surrounding lexical environment. It allows a function to access variables from its outer scope even after the outer function has returned. Used for data privacy and currying."],
      ["m", "Differences between Arrow Functions and Regular Functions?", "1. Arrow functions don't have their own <code>this</code> (they inherit it lexically).\n2. They cannot be used as constructors (no <code>new</code> keyword).\n3. They don't have the <code>arguments</code> object.\n4. Implicit return if no curly braces are used."],
      ["h", "Implement a basic Currying function.", "Currying transforms a function with multiple arguments into a sequence of nested functions that take one argument at a time.\n```javascript\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    } else {\n      return function(...args2) {\n        return curried.apply(this, args.concat(args2));\n      }\n    }\n  };\n}\n```"]
    ]
  },
  {
    group: "Core JavaScript",
    icon: "🔗",
    title: "Prototypes & Inheritance",
    subtitle: "prototype chain, Object.create, class syntax",
    concept: "JavaScript is a prototype-based language. Objects inherit properties and methods from a prototype object, forming a prototype chain until it hits `null`.",
    questions: [
      ["e", "What is the Prototype Chain?", "When accessing a property on an object, JS checks the object itself. If not found, it traverses up the `__proto__` link to the object's prototype, continuing until it finds the property or reaches `null`."],
      ["m", "Difference between __proto__ and prototype?", "<code>__proto__</code> is the actual object that is used in the lookup chain to resolve methods, etc. <code>prototype</code> is the object that is used to build <code>__proto__</code> when you create an object with `new`."],
      ["h", "How does Object.create() work under the hood?", "It creates a new object and sets its `__proto__` to the object passed as the argument.\n```javascript\n// Polyfill for Object.create\nObject.myCreate = function(proto) {\n  function F() {}\n  F.prototype = proto;\n  return new F();\n};\n```"]
    ]
  },
  {
    group: "Core JavaScript",
    icon: "⏳",
    title: "Asynchronous JS & Event Loop",
    subtitle: "Promises, async/await, microtasks vs macrotasks",
    concept: "JS is single-threaded. The Event Loop handles async operations by pushing them to Web APIs, and then queueing their callbacks in the Macrotask or Microtask queues.",
    questions: [
      ["e", "What is the Event Loop?", "The Event Loop constantly checks if the Call Stack is empty. If it is, it takes the first task from the Microtask queue (Promises) and executes it. If the Microtask queue is empty, it takes from the Macrotask queue (setTimeout)."],
      ["m", "Microtasks vs Macrotasks?", "Microtasks (Promises, queueMicrotask) have higher priority and execute immediately after the current call stack clears. Macrotasks (setTimeout, setInterval, DOM events) execute in the next tick of the event loop."],
      ["h", "Write a Promise Polyfill.", "```javascript\nfunction MyPromise(executor) {\n  let onResolve, onReject, isFulfilled = false, isRejected = false, value;\n  function resolve(v) {\n    isFulfilled = true;\n    value = v;\n    if (typeof onResolve === 'function') onResolve(v);\n  }\n  function reject(r) {\n    isRejected = true;\n    value = r;\n    if (typeof onReject === 'function') onReject(r);\n  }\n  this.then = function(callback) {\n    onResolve = callback;\n    if (isFulfilled) callback(value);\n    return this;\n  };\n  executor(resolve, reject);\n}\n```"]
    ]
  },

  // ── SECTION 2: ARRAYS & OBJECTS ──
  {
    group: "Arrays & Objects",
    icon: "📋",
    title: "Array Methods Deep Dive",
    subtitle: "map, filter, reduce, and immutable patterns.",
    concept: "Array methods are the backbone of data transformation. Knowing which mutate the original array and which return new ones is critical.",
    code: [
      ["javascript", `// Mutating: push, pop, shift, unshift, splice, sort, reverse
// Immutable: map, filter, reduce, slice, concat, flat

const nums = [1, 2, 3, 4, 5];
// reduce for complex transformations
const grouped = ['apple', 'banana', 'apple'].reduce((acc, curr) => {
  acc[curr] = (acc[curr] || 0) + 1;
  return acc;
}, {}); // { apple: 2, banana: 1 }`]
    ],
    questions: [
      ["e", "Difference between slice and splice?", "<code>slice(start, end)</code> returns a shallow copy of a portion of an array and is IMMUTABLE. <code>splice(start, deleteCount, ...items)</code> changes the contents of an array by removing or replacing existing elements and is MUTATING."],
      ["m", "Polyfill for Array.map and Array.filter", "```javascript\nArray.prototype.myMap = function(cb) {\n  let res = [];\n  for(let i=0; i<this.length; i++) res.push(cb(this[i], i, this));\n  return res;\n};\n\nArray.prototype.myFilter = function(cb) {\n  let res = [];\n  for(let i=0; i<this.length; i++) if(cb(this[i], i, this)) res.push(this[i]);\n  return res;\n};\n```"],
      ["h", "Flatten an array without Array.flat() (using reduce)", "```javascript\nfunction flatten(arr) {\n  return arr.reduce((acc, curr) => {\n    return acc.concat(Array.isArray(curr) ? flatten(curr) : curr);\n  }, []);\n}\n```"]
    ]
  },
  {
    group: "Arrays & Objects",
    icon: "📦",
    title: "Object Methods Deep Dive",
    subtitle: "Object.keys, assign, freeze, descriptors",
    concept: "Objects are reference types. Methods like `Object.keys`, `values`, and `entries` allow iteration, while `freeze` and `seal` control immutability.",
    questions: [
      ["e", "Shallow Clone vs Deep Clone?", "Shallow clone (via Spread <code>{...obj}</code> or <code>Object.assign</code>) only copies the first level of properties; nested objects share references. Deep clone copies all levels (via <code>JSON.parse(JSON.stringify(obj))</code> or <code>structuredClone()</code>)."],
      ["m", "Object.freeze() vs Object.seal()?", "<code>Object.freeze()</code> prevents adding, removing, or modifying properties (totally immutable). <code>Object.seal()</code> prevents adding or removing properties, but ALLOWS modifying existing writable properties."],
      ["h", "What are Property Descriptors?", "Hidden attributes of object properties. Configured via <code>Object.defineProperty</code>.\n- <code>enumerable</code>: Shows up in `for...in` loops.\n- <code>writable</code>: Can be changed.\n- <code>configurable</code>: Can be deleted or modified.\n```javascript\nObject.defineProperty(obj, 'id', { value: 1, writable: false });\n```"]
    ]
  },
  {
    group: "Arrays & Objects",
    icon: "🗺️",
    title: "Set & Map",
    subtitle: "WeakMap, WeakSet, iteration, and memory management",
    concept: "Set stores unique values of any type. Map stores key-value pairs where keys can be of any type (unlike Objects where keys are strings/symbols).",
    questions: [
      ["e", "Remove duplicates from an array.", "```javascript\nconst unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]\n```"],
      ["m", "Map vs Object — When to use which?", "Use Map when: keys are unknown until runtime, you need keys of varying types (like objects as keys), or you frequently add/remove key-value pairs (Map is optimized for this). Use Object for records with fixed, string keys."],
      ["h", "What is a WeakMap and its use case?", "A WeakMap is a Map where the keys must be objects, and they are held 'weakly'. If there are no other references to the key object, it gets garbage collected. Great for storing private data or DOM node metadata without causing memory leaks."]
    ]
  },
  {
    group: "Arrays & Objects",
    icon: "🔤",
    title: "String Methods",
    subtitle: "slice, substring, replace, template literals",
    concept: "Strings are immutable primitive values. Any string manipulation method returns a completely new string.",
    questions: [
      ["e", "Difference between slice() and substring()?", "Both extract parts of a string. `slice()` accepts negative indices (counts from the end), while `substring()` treats negative indices as 0."],
      ["m", "Reverse a string.", "```javascript\n// Approach 1\nconst rev = str.split('').reverse().join('');\n\n// Approach 2 (Two Pointers - better memory)\nfunction reverse(s) {\n  let arr = s.split(''), l = 0, r = arr.length - 1;\n  while(l < r) { [arr[l], arr[r]] = [arr[r], arr[l]]; l++; r--; }\n  return arr.join('');\n}\n```"],
      ["h", "Check if two strings are Anagrams.", "```javascript\nfunction isAnagram(s1, s2) {\n  if(s1.length !== s2.length) return false;\n  let map = {};\n  for(let c of s1) map[c] = (map[c] || 0) + 1;\n  for(let c of s2) {\n    if(!map[c]) return false;\n    map[c]--;\n  }\n  return true;\n}\n```"]
    ]
  },

  // ── SECTION 3: DOM & BOM ──
  {
    group: "DOM & BOM",
    icon: "🌳",
    title: "DOM Selection & Manipulation",
    subtitle: "Nodes, Elements, live vs static NodeLists",
    concept: "The DOM represents the HTML as a tree of Nodes. `querySelector` returns a static NodeList, while `getElementsByClassName` returns a live HTMLCollection.",
    questions: [
      ["e", "What is the difference between innerHTML, textContent, and innerText?", "`innerHTML` parses string as HTML (vulnerable to XSS). `textContent` gets all text inside an element including hidden ones. `innerText` gets only visible text (triggers layout computation)."],
      ["m", "Live vs Static NodeLists?", "`document.querySelectorAll` returns a STATIC NodeList; if the DOM changes, the list does not update. `document.getElementsByTagName` returns a LIVE HTMLCollection that automatically updates when nodes are added/removed."],
      ["h", "How to optimize DOM updates?", "DOM manipulations are expensive (trigger reflow/repaint). To insert multiple elements, use a `DocumentFragment`. It acts as an invisible wrapper, allowing you to append 1000 nodes to it, then append the fragment to the DOM in a single operation."]
    ]
  },
  {
    group: "DOM & BOM",
    icon: "🎯",
    title: "DOM Events",
    subtitle: "Bubbling, Capturing, Delegation",
    concept: "Events travel down the DOM tree (Capturing phase), reach the target, and then travel back up (Bubbling phase).",
    questions: [
      ["e", "What is Event Delegation?", "Attaching a single event listener to a parent element to handle events from its children, leveraging event bubbling. It improves memory and handles dynamically added elements automatically."],
      ["m", "stopPropagation vs preventDefault?", "`stopPropagation()` stops the event from bubbling up the DOM tree. `preventDefault()` stops the default browser action (like following a link or submitting a form) but does NOT stop bubbling."],
      ["h", "How do you trigger a Custom Event?", "```javascript\n// Create the event\nconst event = new CustomEvent('userLogin', { detail: { userId: 123 } });\n\n// Listen for it\ndocument.addEventListener('userLogin', (e) => console.log(e.detail));\n\n// Dispatch it\ndocument.dispatchEvent(event);\n```"]
    ]
  },
  {
    group: "DOM & BOM",
    icon: "🌍",
    title: "BOM (Browser Object Model)",
    subtitle: "window, location, history, storage APIs",
    concept: "The BOM allows JS to talk to the browser. The `window` object is the global context, providing access to `localStorage`, `history`, and timers.",
    questions: [
      ["e", "Local Storage vs Session Storage vs Cookies?", "Local Storage: 5MB, persists after closing browser. Session Storage: 5MB, clears when tab is closed. Cookies: 4KB, sent to server with every HTTP request, used for authentication."],
      ["m", "How does the History API work for SPAs?", "`history.pushState(state, title, url)` changes the URL in the browser without triggering a page reload. `window.addEventListener('popstate', cb)` listens for back/forward button clicks. This is how React Router works."],
      ["h", "setTimeout(fn, 0) vs requestAnimationFrame?", "`setTimeout(..., 0)` pushes the callback to the macrotask queue to run after the current call stack clears. `requestAnimationFrame(cb)` tells the browser to run the callback right before the next repaint, ensuring smooth 60fps animations."]
    ]
  }
];
