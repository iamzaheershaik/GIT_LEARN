const SECTIONS = [
  {
    group: "Core JavaScript",
    icon: "📦",
    title: "Variables & Scoping",
    subtitle: "var, let, const, hoisting, temporal dead zone",
    concept: "JavaScript has three variable declaration keywords: <code>var</code> (function-scoped, hoisted with undefined), <code>let</code> (block-scoped, temporal dead zone), and <code>const</code> (block-scoped, immutable binding).",
    code: [
      ["javascript", `console.log(a); // undefined
var a = 10;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;

const obj = { name: "John" };
obj.name = "Doe"; // ✅ Valid: const binding is immutable, but object properties aren't.`]
    ],
    questions: [
      ["e", "What is the Temporal Dead Zone (TDZ)?", "The TDZ is the period between entering a block scope and the actual declaration of a <code>let</code> or <code>const</code> variable. Accessing the variable during this time throws a ReferenceError."],
      ["m", "Explain hoisting.", "Hoisting is JS's default behavior of moving declarations to the top of the current scope. <code>var</code> is hoisted and initialized to <code>undefined</code>. <code>let</code>/<code>const</code> are hoisted but NOT initialized (they remain in TDZ). Functions are hoisted completely."],
      ["h", "Output of setTimeout inside a loop with var vs let?", "Using <code>var</code> prints the final loop value (e.g., 5, 5, 5) because `var` is function-scoped and all callbacks share the same variable reference. Using <code>let</code> prints (0, 1, 2) because `let` creates a new lexical environment for each iteration."]
    ]
  },
  {
    group: "Interview Logic",
    icon: "🧠",
    title: "Algorithm Implementation Patterns",
    subtitle: "Common logic questions explained with pseudocode and 'WHY'.",
    concept: "In interviews, it's not just about getting the answer; it's about explaining WHY your logic works. Below are core algorithms with step-by-step logic.",
    questions: [
      ["m", "Check if a number is Prime", "Instead of checking all numbers up to n, we only check up to √n because divisors come in pairs. Furthermore, we skip all even numbers and multiples of 3, checking only 6k ± 1.\n\n```javascript\n// PSEUDOCODE\nfunction isPrime(n):\n    if n <= 1: return false\n    if n <= 3: return true\n    if n % 2 == 0 or n % 3 == 0: return false\n\n    // Check 6k-1 and 6k+1\n    for i = 5; i * i <= n; i += 6:\n        if n % i == 0 or n % (i+2) == 0: return false\n    \n    return true\n```\n\n**WHY i += 6?**\nEvery prime > 3 is of the form 6k ± 1. This skips 2/3 of all numbers instantly."],
      ["e", "Reverse a Number mathematically", "To reverse a number without converting to a string, we extract digits using modulo and build the new number using multiplication.\n\n```javascript\n// PSEUDOCODE\nfunction reverseNumber(n):\n    reversed = 0\n    while n > 0:\n        lastDigit = n % 10        // Get last digit\n        reversed = (reversed * 10) + lastDigit // Shift and add\n        n = Math.floor(n / 10)    // Remove last digit\n    return reversed\n```"],
      ["m", "Check Palindrome Number", "Reverse half the number to prevent integer overflow and save time. If the reversed half equals the remaining half, it's a palindrome.\n\n```javascript\n// PSEUDOCODE\nfunction isPalindrome(n):\n    if n < 0 or (n % 10 == 0 and n != 0): return false\n    \n    reversed = 0\n    while n > reversed: // Stop halfway\n        reversed = (reversed * 10) + (n % 10)\n        n = Math.floor(n / 10)\n    \n    return n == reversed or n == Math.floor(reversed / 10)\n```"]
    ]
  },
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
      ["e", "Difference between map and forEach?", "<code>map</code> returns a new array with the transformed elements, allowing method chaining. <code>forEach</code> executes a function on each element but returns <code>undefined</code>."],
      ["m", "Polyfill for Array.map", "```javascript\nArray.prototype.myMap = function(callback) {\n  const result = [];\n  for(let i=0; i<this.length; i++) {\n    result.push(callback(this[i], i, this));\n  }\n  return result;\n};\n```"],
      ["h", "Flatten an array without Array.flat()", "```javascript\nfunction flatten(arr) {\n  return arr.reduce((acc, curr) => {\n    return acc.concat(Array.isArray(curr) ? flatten(curr) : curr);\n  }, []);\n}\n```"]
    ]
  },
  {
    group: "DOM & BOM",
    icon: "🖥️",
    title: "DOM Manipulation & Events",
    subtitle: "Event delegation, bubbling, and element lifecycle.",
    concept: "The DOM represents the page as a tree. Efficient DOM manipulation batches updates (e.g., DocumentFragment) to avoid layout thrashing.",
    questions: [
      ["e", "What is Event Delegation?", "Attaching a single event listener to a parent element to handle events from its children, leveraging event bubbling. It improves memory and handles dynamically added elements."],
      ["m", "Bubbling vs Capturing", "Event propagation has three phases: Capturing (top to target), Target, and Bubbling (target to top). <code>addEventListener</code> uses bubbling by default. Set the third argument to <code>true</code> to use capturing."],
      ["h", "Reflow vs Repaint", "Repaint occurs when visual styles change (like color). Reflow occurs when layout changes (width, height, adding nodes). Reflow is much more expensive and should be minimized using fragments or CSS transforms."]
    ]
  }
];
