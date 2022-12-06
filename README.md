# Reactivity

Example of reactive state implementation in JavaScript

## Usage

### **1. Derived properties**

**A) Lazy Approach (Recommended)**

Properties are calculated only once they are requested:

```js
import { Reactive, derive } from "./lib/index.js";

const data = Reactive({ x: 1, y: 2 });

data.z = derive(() => data.x + data.y);

console.log(data.z); // 3

data.x += 1;

console.log(data.z); // 4 - is calculated at this point (on-demand)
```

**B) Eager Approach**

```js
import { Reactive, deriveEager } from "./lib/index.js";

const data = Reactive({ x: 1, y: 2 });
deriveEager(() => (data.z = data.x + data.y));

console.log(data.z); // 3
data.x += 1; // actually "z" gets calculated already here
console.log(data.z); // 4
```

### Difference between "Lazy" & "Eager"

With **Lazy** implementation your properties are computed **only when requested**.

With **Eager** implementation your properties are computed **at the beginning** and then **everytime the state changes**

**Limitations:**

Eager approach with multiple reactive states will produce unnecessary updates

You're not supposed to call `deriveEager` within `deriveEager`

Experiment with calling `derive` within `derive` at your own risk...

### 2. Subscribe to data changes

```js
import { Reactive, subscribe } from "./lib/index.js";

const data = Reactive({ x: 1, y: 2 });

subscribe(data, (newData) => {
  console.log("state changed", newData);
});

data.x += 1; // state changed { x: 2, y: 2 }
```

For More examples see [examples](./examples) directory

## Installation

```bash
npm install
```

## Run

### Simple Example

```bash
node ./examples/simple.js
```

### List Of Examples

**[1. simple.js](./examples/simple.js)**

**[2. deriveEager.js](./examples/deriveEager.js)**

**[3. withSubscription.js](./examples/withSubscription.js)**

**[4. nestedObject.js](./examples/nestedObject.js)**

**[5. arrays.js](./examples/arrays.js)**

**[6. vdom.js](./examples/vdom.js)**

**Author:** Juraj Carnogursky
