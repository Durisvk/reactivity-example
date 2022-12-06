import { Reactive, subscribe, unsubscribeAll } from "../index.js";

const state = Reactive({ a: 1, b: 2 });

state.a = 2; // nothing is logged
subscribe(state, (state) => console.log("state changed", state));
state.b = 3; // state changed { a: 2, b: 3 }

unsubscribeAll(state);

state.b = 4; // nothing is logged anymore
