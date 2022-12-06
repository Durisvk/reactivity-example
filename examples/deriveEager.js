import { Reactive, deriveEager } from "../index.js";

const state = Reactive({ a: 1, b: 2 });

state.c = deriveEager((state) => state.a + state.b);
state.d = deriveEager((state) => state.a * state.b + state.c);

console.log(state.c); // 3
console.log(state.d); // 5

state.a = 2; // Re-calculations are executed immediately

console.log(state.c); // 4
console.log(state.d); // 8
