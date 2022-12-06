import { Reactive, derive, subscribe } from "../index.js";

const data = Reactive({ person: { name: "John" } });

// nested derive
data.person.upperCaseName = derive(() => data.person.name.toUpperCase());

// upper state subscribe:
subscribe(data, (state) => console.log("upper state changed", state));
// nested subscribe:
subscribe(data.person, (change) => console.log("person changed", change));

// nested derivation:
console.log(data.person.upperCaseName); // JOHN
data.person.name = "Jane"; // person changed { name: "Jane" } + upper state changed { person: { name: "Jane" } }
console.log(data.person.upperCaseName); // JANE
