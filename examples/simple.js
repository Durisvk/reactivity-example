import { Reactive, derive } from "../index.js";

const state = Reactive({ a: 1, b: 2 });

state.c = derive((state) => state.a + state.b);
state.d = derive((state) => state.a * state.b + state.c);

console.log(state.c); // 3
console.log(state.d); // 5

state.a = 2;

console.log(state.c); // 4
console.log(state.d); // 8
